import "dotenv/config";
import { Agent } from "./engine/agent.js";
import { runCheck } from "./engine/index.js";
import { triage } from "./triage.js";
import { handleInbound } from "./pipeline.js";
import { loadConfig, isAllowed } from "./config.js";
import { CheckLogStore } from "./log.js";
import { createSpectrumTransport } from "./providers/spectrum.js";
import type { PipelineDeps, QuashState } from "./provider.js";

async function main(): Promise<void> {
  const config = loadConfig();
  if (!config.projectId || !config.projectSecret) {
    console.error("QUASH_PROJECT_ID / QUASH_PROJECT_SECRET missing. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  const agentEnv = { ...process.env, QUASH_API_KEY: process.env.QUASH_API_KEY ?? "" };
  const searchAgent = new Agent({ ...agentEnv, QUASH_MODEL: config.searchModel });
  const verifyAgent = new Agent(agentEnv);
  const triageAgent = new Agent(agentEnv);

  const log = new CheckLogStore(config.dataDir);
  await log.init();

  const state: QuashState = { stopped: false, roast: config.roast, nudgedChats: new Set() };
  const deps: PipelineDeps = {
    state,
    triage: (text) => triage(triageAgent, text),
    check: (claim) => runCheck(searchAgent, verifyAgent, claim, { roast: state.roast }),
    log: (entry) => log.append(entry),
    counts: () => log.counts(),
  };

  const transport = await createSpectrumTransport({
    projectId: config.projectId,
    projectSecret: config.projectSecret,
  });

  console.error("quash: connected. waiting for claims.");
  for await (const message of transport.messages()) {
    if (state.stopped) break;
    if (!isAllowed(config, message.senderId)) {
      console.error(`ignored non-allowlisted sender ${message.senderId}`);
      continue;
    }
    if (!message.text.trim()) continue;
    try {
      await handleInbound(deps, transport.actions, message);
    } catch (err) {
      console.error(`check failed for ${message.id}:`, (err as Error).message);
      await transport.actions
        .reply(message, "Couldn't finish that check. Try again in a minute.")
        .catch(() => {});
    }
  }
  console.error("quash: loop ended.");
}

main().catch((err) => {
  console.error("quash: fatal:", (err as Error).message);
  process.exit(1);
});
