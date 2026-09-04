import { Spectrum } from "spectrum-ts";
import { imessage } from "spectrum-ts/providers/imessage";
import type { ChatActions, InboundMessage, QuashTransport } from "../provider.js";

/**
 * Live transport: Photon Spectrum Cloud iMessage.
 * API shapes verified against node_modules/@spectrum-ts types (2026-09-04).
 */
export async function createSpectrumTransport(creds: {
  projectId: string;
  projectSecret: string;
}): Promise<QuashTransport> {
  const app = await Spectrum({
    projectId: creds.projectId,
    projectSecret: creds.projectSecret,
    providers: [imessage.config()],
  });

  async function* inbound(): AsyncIterable<InboundMessage & { __raw: unknown; __space: unknown }> {
    for await (const [space, message] of app.messages) {
      if (message.direction !== "inbound") continue;
      yield {
        id: message.id,
        chatId: space.id,
        senderId: message.sender?.id ?? "unknown",
        text: extractText(message.content),
        __raw: message,
        __space: space,
      };
    }
  }

  // The pipeline consumes the plain port shape; raw handles ride along here.
  const seen = new Set<string>();

  return {
    actions: {
      async react(message, emoji) {
        const raw = (message as any).__raw;
        if (!raw?.react) return false;
        const result = await raw.react(emoji);
        return result !== undefined;
      },
      async reply(message, text) {
        const raw = (message as any).__raw;
        if (!raw?.reply) throw new Error("spectrum message has no reply");
        await raw.reply(text);
      },
      responding<T>(message: InboundMessage, fn: () => Promise<T>): Promise<T> {
        const rawSpace = (message as any).__space;
        if (rawSpace?.responding) return rawSpace.responding(fn);
        return fn();
      },
    },
    messages() {
      return (async function* () {
        for await (const m of inbound()) {
          if (seen.has(m.id)) continue;
          seen.add(m.id);
          yield m as InboundMessage;
        }
      })();
    },
  };
}

export function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (content && typeof content === "object") {
    const c = content as Record<string, unknown>;
    if (typeof c.text === "string") return c.text;
    if (typeof c.source === "string") return c.source;
  }
  return "";
}
