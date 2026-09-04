import { describe, expect, it } from "vitest";
import { parseJsonLoose } from "../engine/agent.js";
import { triageFast } from "../triage.js";
import { formatVerdict, fallbackVerdictLine, VERDICT_EMOJI, HELP_TEXT } from "../format.js";
import { handleInbound } from "../pipeline.js";
import { MockTransport } from "../providers/mock.js";
import type { CheckResult } from "../engine/types.js";
import type { PipelineDeps } from "../provider.js";

function result(overrides: Partial<CheckResult> = {}): CheckResult {
  return {
    claim: "Paris banned all cars from its center.",
    verdict: "REFUTED",
    rationale: "Paris has a low-emission zone but has not banned all cars.",
    citation: "reuters.com: the 2025 plan restricts, not bans, traffic",
    sources: [{ url: "https://www.reuters.com/world/europe/paris-traffic", domain: "reuters.com" }],
    latencyMs: 31200,
    ...overrides,
  };
}

function deps(overrides: Partial<PipelineDeps> = {}): PipelineDeps {
  const state = overrides.state ?? { stopped: false, roast: true, nudgedChats: new Set<string>() };
  return {
    state,
    triage: overrides.triage ?? (async () => ({ kind: "chatter" })),
    check: overrides.check ?? (async () => result()),
    log: overrides.log ?? (() => {}),
    counts: overrides.counts ?? (() => ({ today: 0, total: 0 })),
  };
}

describe("parseJsonLoose", () => {
  it("parses plain, fenced, and embedded JSON", () => {
    expect(parseJsonLoose('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonLoose('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(parseJsonLoose('sure: {"a":{"b":2}} done')).toEqual({ a: { b: 2 } });
    expect(() => parseJsonLoose("no json here")).toThrow();
  });
});

describe("triageFast", () => {
  it("routes commands and quash triggers without a model call", () => {
    expect(triageFast("stop")).toEqual({ kind: "command", command: "stop" });
    expect(triageFast("  STOP ")).toEqual({ kind: "command", command: "stop" });
    expect(triageFast("quash: the moon is cheese")).toEqual({ kind: "claim", claim: "the moon is cheese" });
    expect(triageFast("did you see this?")).toBeUndefined();
  });
});

describe("formatVerdict", () => {
  it("renders verdict, rationale, sources, roast", () => {
    const text = formatVerdict(result({ roast: "The forwarding aunt strikes again." }));
    expect(text.startsWith("Dead wrong.")).toBe(true);
    expect(text).toContain("1. reuters.com: https://www.reuters.com/world/europe/paris-traffic");
    expect(text.endsWith("The forwarding aunt strikes again.")).toBe(true);
  });

  it("shows settlesWith only for UNVERIFIABLE and caps sources at 3", () => {
    const unver = formatVerdict(result({ verdict: "UNVERIFIABLE", settlesWith: "the actual statute" }));
    expect(unver.startsWith("Can't call it.")).toBe(true);
    expect(unver).toContain("Settles with: the actual statute");

    const many = [1, 2, 3, 4, 5].map((i) => ({ url: `https://x.com/${i}`, domain: "x.com" }));
    const text = formatVerdict(result({ sources: many }));
    expect(text.match(/^1\. /gm)?.length).toBe(1);
    expect(text).not.toContain("4. x.com");
  });

  it("never emits em or en dashes in any rendered verdict", () => {
    const samples: CheckResult[] = [
      result(),
      result({ verdict: "VERIFIED", roast: undefined }),
      result({ verdict: "UNVERIFIABLE", settlesWith: "something" }),
      result({ roast: "even a roast with a dash" }),
    ];
    for (const s of samples) {
      expect(formatVerdict(s)).not.toMatch(/[—–]|--/);
    }
    expect(HELP_TEXT).not.toMatch(/[—–]|--/);
    expect(fallbackVerdictLine(result())).not.toMatch(/[—–]|--/);
  });
});

describe("VERDICT_EMOJI map", () => {
  it("uses native tapback-safe emoji", () => {
    expect(Object.values(VERDICT_EMOJI).sort()).toEqual(["👍", "👎", "‼️"].sort());
  });
});

describe("pipeline", () => {
  it("runs claim -> tapdown -> sourced reply -> log", async () => {
    const transport = new MockTransport();
    const logged: unknown[] = [];
    transport.push({ text: "no way paris banned all cars right?" });
    await handleInbound(
      deps({
        triage: async () => ({ kind: "claim", claim: "Paris banned all cars from its center." }),
        log: (e) => logged.push(e),
      }),
      transport.actions,
      { id: "m1", chatId: "c1", senderId: "+15550001", text: "no way paris banned all cars right?" },
    );
    expect(transport.reactions[0]).toEqual({ messageId: "m1", emoji: "👎", landed: true });
    expect(transport.replies).toHaveLength(1);
    expect(transport.replies[0]?.text.startsWith("Dead wrong.")).toBe(true);
    expect(logged).toHaveLength(1);
  });

  it("falls back to emoji-lead reply when reactions are unsupported", async () => {
    const transport = new MockTransport();
    transport.reactionSupport = false;
    await handleInbound(
      deps({
        triage: async () => ({ kind: "claim", claim: "Paris banned all cars." }),
      }),
      transport.actions,
      { id: "m2", chatId: "c1", senderId: "+15550001", text: "quash: paris banned cars" },
    );
    expect(transport.reactions[0]?.landed).toBe(false);
    expect(transport.replies[0]?.text.startsWith("👎 Dead wrong.")).toBe(true);
  });

  it("nudges a chatty chat once, never twice", async () => {
    const transport = new MockTransport();
    const d = deps();
    const msg = (id: string) => ({ id, chatId: "c1", senderId: "+15550001", text: "lol hi" });
    await handleInbound(d, transport.actions, msg("a"));
    await handleInbound(d, transport.actions, msg("b"));
    expect(transport.replies).toHaveLength(1);
    expect(transport.replies[0]?.text).toContain("Forward me a claim");
  });

  it("handles stop via the fast-path command triage", async () => {
    const transport = new MockTransport();
    const d = deps({ triage: async (t) => triageFast(t) ?? { kind: "chatter" } });
    await handleInbound(d, transport.actions, {
      id: "s1",
      chatId: "c1",
      senderId: "+15550001",
      text: "stop",
    });
    expect(d.state.stopped).toBe(true);
    expect(transport.lastReply()).toContain("Quash stopped");
  });

  it("rejects oversized claims without a check", async () => {
    const transport = new MockTransport();
    let checked = 0;
    await handleInbound(
      deps({
        check: async () => {
          checked += 1;
          return result();
        },
        triage: async () => ({ kind: "claim", claim: "x".repeat(700) }),
      }),
      transport.actions,
      { id: "m3", chatId: "c1", senderId: "+15550001", text: "huge paste" },
    );
    expect(checked).toBe(0);
    expect(transport.lastReply()).toContain("Send me the one claim");
  });
});
