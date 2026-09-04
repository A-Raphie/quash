import { formatVerdict, fallbackVerdictLine, HELP_TEXT, VERDICT_EMOJI } from "./format.js";
import type { ChatActions, InboundMessage, PipelineDeps } from "./provider.js";

/**
 * The whole product: one inbound message in, chat side effects out.
 * Same path for live iMessage and offline mock, so tests rehearse the real thing.
 */
export async function handleInbound(
  deps: PipelineDeps,
  actions: ChatActions,
  message: InboundMessage,
): Promise<void> {
  const { state } = deps;
  const triage = await deps.triage(message.text);

  if (triage.kind === "command") {
    await handleCommand(deps, actions, message, triage.command ?? "");
    return;
  }

  if (triage.kind === "chatter") {
    // One nudge per chat, ever. The agent never messages first and never nags.
    if (!state.nudgedChats.has(message.chatId)) {
      state.nudgedChats.add(message.chatId);
      await actions.reply(
        message,
        "Forward me a claim and I'll check it. `quash <claim>` also works.",
      );
    }
    return;
  }

  const claim = (triage.claim ?? "").trim();
  if (!claim) return;
  if (claim.length > 600) {
    await actions.reply(message, "That's a lot to check. Send me the one claim worth settling.");
    return;
  }

  const result = await actions.responding(message, () => deps.check(claim));

  deps.log({
    ts: new Date().toISOString(),
    chatId: message.chatId,
    senderId: message.senderId,
    claim: result.claim,
    verdict: result.verdict,
    citation: result.citation,
    settlesWith: result.settlesWith ?? null,
    sources: result.sources.map((s) => s.url),
    roast: result.roast ?? null,
    latencyMs: result.latencyMs,
  });

  // The signature: the tapback lands on the original claim. If reactions are
  // unsupported the verdict still leads the reply as a plain emoji line.
  let reacted = false;
  try {
    reacted = await actions.react(message, VERDICT_EMOJI[result.verdict]);
  } catch {
    reacted = false;
  }
  const text = formatVerdict(result);
  await actions.reply(message, reacted ? text : `${fallbackVerdictLine(result)}\n\n${text}`);
}

async function handleCommand(
  deps: PipelineDeps,
  actions: ChatActions,
  message: InboundMessage,
  command: string,
): Promise<void> {
  switch (command) {
    case "stop":
      deps.state.stopped = true;
      await actions.reply(message, "Quash stopped. Bye.");
      break;
    case "status": {
      const c = deps.counts();
      await actions.reply(message, `${c.today} checks today, ${c.total} all time. Still on duty.`);
      break;
    }
    case "quiet":
      deps.state.roast = false;
      await actions.reply(message, "Quiet mode. Verdicts only, no commentary.");
      break;
    case "roast":
      deps.state.roast = true;
      await actions.reply(message, "Roast mode on.");
      break;
    case "help":
    default:
      await actions.reply(message, HELP_TEXT);
      break;
  }
}
