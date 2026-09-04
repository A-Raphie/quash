export type Verdict = "VERIFIED" | "REFUTED" | "UNVERIFIABLE";

export interface Evidence {
  url: string;
  domain: string;
  title?: string;
  snippet?: string;
}

export interface CheckResult {
  claim: string;
  verdict: Verdict;
  rationale: string;
  citation: string;
  settlesWith?: string;
  sources: Evidence[];
  roast?: string;
  latencyMs: number;
}

export type TriageKind = "claim" | "command" | "chatter";

export interface TriageResult {
  kind: TriageKind;
  claim?: string;
  command?: string;
}

export interface UsageSummary {
  calls: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
}
