import type { ChatActions, InboundMessage, QuashTransport } from "../provider.js";

export interface RecordedReaction {
  messageId: string;
  emoji: string;
  landed: boolean;
}

export interface RecordedReply {
  messageId: string;
  text: string;
}

export interface TypingEvent {
  messageId: string;
}

/**
 * Offline transport: scripted inbound, recorded side effects.
 * The same pipeline runs against this in tests and rehearsals.
 */
export class MockTransport implements QuashTransport {
  readonly actions: ChatActions;
  readonly reactions: RecordedReaction[] = [];
  readonly replies: RecordedReply[] = [];
  readonly typing: TypingEvent[] = [];
  reactionSupport = true;

  private queue: InboundMessage[] = [];

  constructor() {
    const self = this;
    this.actions = {
      async react(message, emoji) {
        const landed = self.reactionSupport;
        self.reactions.push({ messageId: message.id, emoji, landed });
        return landed;
      },
      async reply(message, text) {
        self.replies.push({ messageId: message.id, text });
      },
      async responding<T>(_message: InboundMessage, fn: () => Promise<T>): Promise<T> {
        return fn();
      },
    };
  }

  push(message: Partial<InboundMessage> & { text: string }): void {
    this.queue.push({
      id: message.id ?? `mock-${this.queue.length + 1}`,
      chatId: message.chatId ?? "chat-1",
      senderId: message.senderId ?? "+15550001",
      text: message.text,
    });
  }

  async *messages(): AsyncIterable<InboundMessage> {
    while (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) yield next;
    }
  }

  lastReply(): string | undefined {
    return this.replies.at(-1)?.text;
  }
}
