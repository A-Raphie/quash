import { mkdir, appendFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface CheckLog {
  ts: string;
  chatId: string;
  senderId: string;
  claim: string;
  verdict: string;
  citation: string;
  settlesWith: string | null;
  sources: string[];
  roast: string | null;
  latencyMs: number;
}

export class CheckLogStore {
  private file: string;
  private today = 0;
  private total = 0;

  constructor(dataDir: string) {
    this.file = join(dataDir, "checks.jsonl");
  }

  async init(): Promise<void> {
    await mkdir(dirname(this.file), { recursive: true });
    try {
      const raw = await readFile(this.file, "utf8");
      const today = new Date().toISOString().slice(0, 10);
      for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        this.total += 1;
        try {
          const entry = JSON.parse(line) as CheckLog;
          if (entry.ts?.slice(0, 10) === today) this.today += 1;
        } catch {
          // a torn last line is not fatal
        }
      }
    } catch {
      // first run: no file yet
    }
  }

  append(entry: CheckLog): void {
    this.total += 1;
    if (entry.ts.slice(0, 10) === new Date().toISOString().slice(0, 10)) this.today += 1;
    void appendFile(this.file, `${JSON.stringify(entry)}\n`, "utf8").catch((err) =>
      console.error("log append failed:", (err as Error).message),
    );
  }

  counts(): { today: number; total: number } {
    return { today: this.today, total: this.total };
  }
}
