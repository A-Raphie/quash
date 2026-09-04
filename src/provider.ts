import type { CheckResult, TriageResult, Verdict } from "./engine/types.js";

/**
 * Transport port: the pipeline only knows this shape, so the live Spectrum
 * transport and the offline mock are interchangeable in tests and rehearsals.
 */
export interface InboundMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
}

export interface ChatActions {
  react(message: InboundMessage, emoji: string): Promise<boolean>;
  reply(message: InboundMessage, text: string): Promise<void>;
  /** Wraps a slow check in a typing indicator where the transport supports it. */
  responding<T>(message: InboundMessage, fn: () => Promise<T>): Promise<T>;
}

export interface QuashTransport {
  actions: ChatActions;
  messages(): AsyncIterable<InboundMessage>;
}

export interface QuashState {
  stopped: boolean;
  roast: boolean;
  nudgedChats: Set<string>;
}

export interface PipelineDeps {
  triage: (text: string) => Promise<TriageResult>;
  check: (claim: string) => Promise<CheckResult>;
  log: (entry: CheckLogEntry) => void;
  state: QuashState;
  counts: () => { today: number; total: number };
}

export interface CheckLogEntry {
  ts: string;
  chatId: string;
  senderId: string;
  claim: string;
  verdict: Verdict | string;
  citation: string;
  settlesWith: string | null;
  sources: string[];
  roast: string | null;
  latencyMs: number;
}
