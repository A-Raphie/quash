import type { Agent } from "./agent.js";
import { gatherEvidence } from "./search.js";
import { verifyClaim } from "./verify.js";
import type { CheckResult } from "./types.js";

export * from "./types.js";
export { Agent, AgentError, parseJsonLoose } from "./agent.js";

export async function runCheck(
  searchAgent: Agent,
  verifyAgent: Agent,
  claim: string,
  opts: { roast: boolean },
): Promise<CheckResult> {
  const started = Date.now();
  const evidence = await gatherEvidence(searchAgent, claim);
  const verdict = await verifyClaim(verifyAgent, { claim, evidence, roast: opts.roast });
  return { ...verdict, latencyMs: Date.now() - started };
}
