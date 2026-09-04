import "dotenv/config";
import { Agent } from "./engine/agent.js";
import { runCheck } from "./engine/index.js";
import { loadConfig } from "./config.js";

/**
 * Engine calibration without Photon: runs the real search + verify path over
 * fixed claims and prints verdicts. Requires QUASH_API_KEY only.
 */
const CLAIMS: Array<{ text: string; expect: string }> = [
  { text: "The city of Paris has banned cars from its city center entirely since January 2026.", expect: "expect REFUTED or UNVERIFIABLE" },
  { text: "Drinking coffee stunts your growth, according to peer-reviewed research.", expect: "expect REFUTED" },
  { text: "Water boils at 100 degrees Celsius at sea level.", expect: "expect VERIFIED" },
  { text: "A new study found that left-handed people live on average 3 years longer.", expect: "expect REFUTED or UNVERIFIABLE" },
  { text: "In September 2026 the UN declared an international holiday for postal workers.", expect: "expect REFUTED or UNVERIFIABLE" },
];

async function main(): Promise<void> {
  const config = loadConfig();
  if (!process.env.QUASH_API_KEY) {
    console.error("QUASH_API_KEY missing. Calibration needs Groq access but not Photon.");
    process.exit(1);
  }
  const searchAgent = new Agent({ ...process.env, QUASH_MODEL: config.searchModel });
  const verifyAgent = new Agent(process.env);
  const claimed = process.env.QUASH_SEARCH_MODEL ?? "";
  if (claimed.includes("compound")) {
    console.error("note: groq/compound 413s on real searches at this tier; use gpt-oss-120b + browser_search");
  }
  let ok = 0;
  for (const c of CLAIMS) {
    try {
      const result = await runCheck(searchAgent, verifyAgent, c.text, { roast: true });
      const good = c.expect.includes(result.verdict);
      if (good) ok += 1;
      console.log(
        `${good ? "PASS" : "MISS"}  ${result.verdict.padEnd(12)} ${String(result.sources.length).padStart(2)} src  ${(result.latencyMs / 1000).toFixed(1)}s  ${c.text}`,
      );
      console.log(`       ${result.citation}`);
      if (result.roast) console.log(`       roast: ${result.roast}`);
    } catch (err) {
      console.log(`ERROR  ${c.text}: ${(err as Error).message}`);
    }
    // Back-to-back browser searches drain the free-tier TPM bucket and the
    // batch ends up throttling itself; spacing keeps runs honest.
    await new Promise((r) => setTimeout(r, 45_000));
  }
  console.log(`\n${ok}/${CLAIMS.length} in expected band`);
  process.exit(0);
}

main();
