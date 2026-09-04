# Quash — Architecture

## Overview

A single long-lived TypeScript process. It connects to Photon Spectrum Cloud as an iMessage provider, consumes the async message stream, triages each inbound message, and for checkable claims runs a two-stage engine: evidence gathering (search) then verdict (judge). The verdict is delivered in chat as a native tapback on the original message plus a threaded sourced reply. Every check is appended to a JSONL log.

## Components

- `src/index.ts` — entry: Spectrum client init, message stream loop, guardrails (allowlist, `stop`), error containment.
- `src/triage.ts` — decides if an inbound message contains a checkable factual claim (cheap single call, JSON verdict: `claim | command | chatter`). Extracts the claim text.
- `src/engine/agent.ts` — ported from claimcheck: OpenAI-compatible chat client (base URL, model, key from env), JSON mode, 429 pacing with server-advertised wait, network retry. Unchanged discipline, renamed env (`QUASH_*`).
- `src/engine/search.ts` — evidence gatherer. Primary: Groq `groq/compound` (built-in web search, returns search results with URLs) asked for 3-5 decisive sources on the claim. Output: `Evidence[]` {url, domain, snippet}.
- `src/engine/verify.ts` — ported verifier discipline: VERIFIED / REFUTED / UNVERIFIABLE + citation + rationale + settlesWith, judged only on the gathered evidence. Absence of evidence is UNVERIFIABLE, never a guess.
- `src/format.ts` — chat formatting: verdict line, rationale (one or two sentences), sources as numbered plain URLs with domain labels, optional roast one-liner. iMessage-safe plain text (no markdown tables).
- `src/actions.ts` — chat side effects: tapback on original message, threaded reply, typing indicator (`space.responding`), optional group poll. Tapback map: VERIFIED → 👍, REFUTED → 👎, UNVERIFIABLE → ‼️ (native-safe six; runtime check, fallback = lead emoji in reply).
- `src/log.ts` — append-only `data/checks.jsonl`: {ts, chatRef, sender, claim, verdict, sources, latencyMs, roast}.
- `src/config.ts` — env parsing, allowlist (defense in depth: Photon enforces registered users upstream; we also check sender locally), feature flags (roast, polls).

## Data model

Append-only JSONL, no database. One line per check:

```json
{"ts":"2026-09-06T13:22:11Z","chat":"+44...","sender":"+44...","claim":"...", "verdict":"REFUTED","rationale":"...","sources":[{"url":"...","domain":"..."}],"latencyMs":41200,"roast":"..."}
```

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node 22 + TypeScript ESM | matches spectrum-ts requirement (Node 20+), claimcheck engine is TS |
| Transport | `spectrum-ts` (Photon Spectrum Cloud, free tier) | the contest requirement; typeform wants a Project ID |
| LLM: search | Groq `groq/compound` (built-in web search) | $0 budget, search + sources in one OpenAI-compatible call |
| LLM: verdict | Groq `openai/gpt-oss-120b` | free tier, proven in claimcheck (100% VERIFIED precision) |
| Datastore | JSONL file | nothing to host, diffable, enough for receipts |
| Hosting | Raphie's Mac, long-lived process | see decision below |

## Key decisions and trade-offs

- **Hosting: local process, no deploy** — eligibility needs a Photon Project ID, not a URL; free-tier allowlist means only registered users can text the agent, so judges never text it anyway; the Railway slot stays with purser until Sep 9. Trade-off: the agent is down when the Mac sleeps; acceptable, `caffeinate` during demo windows.
- **Two models instead of one** — compound for evidence, gpt-oss-120b for the verdict keeps the claimcheck verifier discipline intact (the judge only sees evidence, never searches). Fallback: if compound search disappoints, Tavily free tier for search, keep gpt-oss for verdict.
- **Tapback as the verdict glyph** — the signature mechanic. Fallback documented in PRD kill criteria; the threaded reply carries the verdict either way.
- **Port, do not fork, the engine** — claimcheck's `agent.ts` + `verifier.ts` port nearly verbatim; the repo sandbox and planner do not port (Quash gathers web evidence, not repo evidence). This keeps the proven 429/network retry and strictness rules.
- **JSON mode with loose parsing** — same `parseJsonLoose` as claimcheck (strips fences, finds outermost object), one re-ask on failure.

## API surface (internal)

- `runCheck(agent, searchAgent, claim): Promise<CheckResult>` in `src/engine/`
- `CheckResult = {verdict, rationale, citation, settlesWith?, sources: Evidence[], roast?}`
- Spectrum loop: `for await (const [space, message] of app.messages)` → triage → check → act. `space.responding(async () => {...})` wraps check + reply so the typing indicator runs during the whole check.

## Open architectural questions

- [assumption] `message.react()` accepts 👍/👎/‼️ and maps them to native tapbacks; verify on first live run, fallback is a lead-emoji verdict line.
- [assumption] Groq compound search returns usable URLs on news/health/science claims; calibration test is Tasks Phase 1.
