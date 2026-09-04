import type { CheckResult, Verdict } from "./engine/types.js";

export const VERDICT_LEAD: Record<Verdict, string> = {
  VERIFIED: "Holds up.",
  REFUTED: "Dead wrong.",
  UNVERIFIABLE: "Can't call it.",
};

export const VERDICT_EMOJI: Record<Verdict, string> = {
  VERIFIED: "👍",
  REFUTED: "👎",
  UNVERIFIABLE: "‼️",
};

const MAX_SOURCES_SHOWN = 3;

export function formatVerdict(result: CheckResult): string {
  const lines: string[] = [VERDICT_LEAD[result.verdict], "", result.rationale];
  if (result.verdict === "UNVERIFIABLE" && result.settlesWith) {
    lines.push("", `Settles with: ${result.settlesWith}`);
  }
  const sources = result.sources.slice(0, MAX_SOURCES_SHOWN);
  if (sources.length > 0) {
    lines.push("");
    sources.forEach((s, i) => lines.push(`${i + 1}. ${s.domain}: ${s.url}`));
  }
  if (result.roast) {
    lines.push("", result.roast);
  }
  return lines.join("\n");
}

export function fallbackVerdictLine(result: CheckResult): string {
  return `${VERDICT_EMOJI[result.verdict]} ${VERDICT_LEAD[result.verdict]}`;
}

export const HELP_TEXT = [
  "Quash checks claims. Forward me something dubious, or write: quash <claim>.",
  "I react to the original with the verdict, then reply with sources.",
  "Commands: stop, status, quiet, roast.",
].join("\n");
