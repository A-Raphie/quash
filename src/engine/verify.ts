import type { Agent } from "./agent.js";
import type { CheckResult, Evidence, Verdict } from "./types.js";

const VERIFIER_SYSTEM = `You are a verification judge. For one claim circulating in a group chat, read the
collected evidence (search results with snippets) and reply with a strict verdict.

Verdicts:
- VERIFIED: the evidence directly supports the claim as stated.
- REFUTED: the evidence directly contradicts the claim as stated.
- UNVERIFIABLE: the evidence cannot decide the claim (opinion, prediction, too new,
  only fringe or single-source coverage, or nothing in the evidence bears on it).

Strictness rules:
- A distorted version of a real event is REFUTED, not VERIFIED: judge the claim as stated.
- Absence of evidence is not refutation. If nothing in the evidence addresses the claim,
  answer UNVERIFIABLE, never guess.
- citation must reference the decisive evidence: a domain plus its key line. Keep it under
  240 characters.
- rationale: one or two sentences a normal person can re-check against the sources.
- For UNVERIFIABLE only: settlesWith names the concrete thing that would decide it
  (e.g. "an official statement from the agency", "the actual study text"). One sentence.
- roast: only when allowedInputs says roast is on AND the verdict is REFUTED or VERIFIED:
  one dry, witty sentence aimed at the CLAIM, never at a person. No emoji. No exclamation
  marks. If you cannot be genuinely dry, omit it.

Reply ONLY with JSON:
{"verdict":"VERIFIED|REFUTED|UNVERIFIABLE","citation":"...","rationale":"...","settlesWith":"...","roast":"..."}`;

const VERDICTS: Verdict[] = ["VERIFIED", "REFUTED", "UNVERIFIABLE"];

export async function verifyClaim(
  agent: Agent,
  input: { claim: string; evidence: Evidence[]; roast: boolean },
): Promise<Omit<CheckResult, "latencyMs">> {
  const evidenceText = input.evidence.length
    ? input.evidence
        .map(
          (e, i) =>
            `SOURCE ${i + 1}: ${e.url}\n${e.title ? `${e.title}\n` : ""}${e.snippet ?? ""}`,
        )
        .join("\n\n")
    : "(no sources were found)";
  const reply = await agent.chatJson<{
    verdict?: string;
    citation?: string;
    rationale?: string;
    settlesWith?: string;
    roast?: string;
  }>({
    label: "verify",
    system: VERIFIER_SYSTEM,
    user: [
      `CLAIM: ${input.claim}`,
      `EVIDENCE:\n${evidenceText}`,
      `roast allowed: ${input.roast ? "yes" : "no"}`,
    ].join("\n\n"),
  });
  const verdict = VERDICTS.includes(reply.verdict as Verdict) ? (reply.verdict as Verdict) : "UNVERIFIABLE";
  const roast = input.roast && verdict !== "UNVERIFIABLE" && reply.roast ? reply.roast.trim() : undefined;
  return {
    claim: input.claim,
    verdict,
    citation: (reply.citation || "(no citation provided)").slice(0, 300),
    rationale: clean(reply.rationale || "(no rationale provided)", 600),
    settlesWith: reply.settlesWith ? clean(reply.settlesWith, 240) : undefined,
    roast: roast ? clean(roast, 240) : undefined,
    sources: input.evidence,
  };
}

function clean(s: string, max: number): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/[—–]/g, "-")
    .trim()
    .slice(0, max);
}
