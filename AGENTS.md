# AGENTS.md: Quash

Behavior layer for any agent working in this repo. Context lives in PRD.md / Architecture.md / Tasks.md / Memory.md / Handoff.md / design.md; this file only constrains how you act.

## Project facts

- Node 22, TypeScript ESM. `npm run typecheck`, `npm test` (offline, mock provider), `npm start` (live loop, needs QUASH_* env).
- Layout: `src/index.ts` (loop) · `src/triage.ts` · `src/engine/` (agent, search, verify) · `src/format.ts` · `src/actions.ts` · `src/provider.ts` (+ `mock`) · `src/config.ts` · `src/log.ts`.
- The engine is a port of claimcheck's agent.ts + verifier.ts (429 pacing, JSON mode, strict verdicts). Keep the port faithful; improve via parameters, not rewrites.
- Deadline Sep 10, 2026. Phases and done-criteria live in Tasks.md.

## Decision defaults

- Default to the least-surprising reversible option and note the choice in Memory.md.
- Blocked on credentials or an external account? Attempt the offline path (mock provider, unit tests) before stopping; log the blocker in Handoff.md.
- When spectrum-ts API shape is uncertain, read the installed package's types in node_modules before writing against it. Never invent API names.

## Research-first

- Never edit a file you have not read in this session.
- Before claiming a Spectrum or Groq API does X, verify from installed types, docs, or a live probe.

## Wrongness detection

- Never claim done without evidence: typecheck green, tests green, or the verified behavior described.
- After a fix, re-verify the original failure is gone.
- Every check result must trace to a real engine run: no fabricated verdicts, sources, or log lines, ever, including in tests, demos, and README examples. Fictional data in demo material is disqualifying.

## Stop conditions (pause for Raphie)

- Sending any message to a real person or chat outside his own registered number.
- Creating accounts, spending money, or accepting terms anywhere.
- Posting publicly: X posts, typeform submit, repo visibility flips.
- Registering anyone's phone number without their consent.
- Deleting the JSONL check log.

## Style invariants

- No em dashes or double hyphens in any user-visible string, message template, README, or doc. Grep before you ship copy.
- English only, everywhere.
- Verdict lead lines and message shapes come from design.md. Do not invent new formats mid-build.
- The agent never messages first. No unsolicited outbound, no scheduled sends.

## Persistence

- Verify `git status` and remote before starting work; say so if unpushed work exists.
- Commit and push after every meaningful checkpoint. One-line progress notes to Memory.md as you go, not at session end.
- Never commit .env, node_modules, or data/checks.jsonl with real chat content.
