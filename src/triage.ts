import type { Agent } from "./engine/agent.js";
import type { TriageResult } from "./engine/types.js";

const TRIAGE_SYSTEM = `You triage one inbound group-chat message for a fact-checking agent.
Classify it:

- "claim": the message asserts something checkable about the real world (news, health,
  science, history, law, statistics, quotes attributed to real people, "did you know"
  forwards). Extract the claim as a clean standalone sentence worth checking.
- "chatter": greetings, opinions, questions about the agent, plans, jokes, anything that
  does not assert a checkable fact. Also chatter: chain-letter hoaxes that are pure
  superstition with no factual nucleus, and pure abuse.

Rules:
- If the message wraps a claim in commentary ("no way this is real but my aunt sent it"),
  still classify as claim and extract the factual nucleus.
- claim must be under 600 characters. If the message is a giant pasted article, extract
  its single central factual claim.

Reply ONLY with JSON:
{"kind":"claim|chatter","claim":"..."}`;

const COMMANDS = new Set(["stop", "status", "quiet", "roast", "help"]);

/** Fast paths before any model call: commands and explicit quash: triggers. */
export function triageFast(text: string): TriageResult | undefined {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  if (COMMANDS.has(lower)) return { kind: "command", command: lower };
  const quash = lower.startsWith("quash:") ? trimmed.slice(6).trim() : undefined;
  if (quash) return { kind: "claim", claim: quash.slice(0, 600) };
  return undefined;
}

export async function triage(agent: Agent, text: string): Promise<TriageResult> {
  const fast = triageFast(text);
  if (fast) return fast;
  const clipped = text.length > 2000 ? text.slice(0, 2000) : text;
  const reply = await agent.chatJson<{ kind?: string; claim?: string }>({
    label: "triage",
    system: TRIAGE_SYSTEM,
    user: clipped,
    maxTokens: 512,
  });
  if (reply.kind === "claim" && typeof reply.claim === "string" && reply.claim.trim()) {
    return { kind: "claim", claim: reply.claim.trim().slice(0, 600) };
  }
  return { kind: "chatter" };
}
