export interface Config {
  projectId: string;
  projectSecret: string;
  baseUrl: string;
  model: string;
  searchModel: string;
  allowlist: string[];
  roast: boolean;
  dataDir: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const allowlist = (env.QUASH_ALLOWLIST ?? "")
    .split(",")
    .map((s) => normalizeHandle(s))
    .filter(Boolean);
  return {
    projectId: env.QUASH_PROJECT_ID ?? "",
    projectSecret: env.QUASH_PROJECT_SECRET ?? "",
    baseUrl: (env.QUASH_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/+$/, ""),
    model: env.QUASH_MODEL || "openai/gpt-oss-120b",
    searchModel: env.QUASH_SEARCH_MODEL || "openai/gpt-oss-20b",
    allowlist,
    roast: (env.QUASH_ROAST ?? "on").toLowerCase() !== "off",
    dataDir: env.QUASH_DATA_DIR || "data",
  };
}

export function normalizeHandle(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9+@.]/gi, "");
}

export function isAllowed(config: Config, senderId: string): boolean {
  if (config.allowlist.length === 0) return true;
  return config.allowlist.includes(normalizeHandle(senderId));
}
