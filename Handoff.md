# Quash — Handoff

Read this first if you're picking up the project. Mirrors current state; updated as work progresses.

## Current state

Scaffold day (Sep 4, 2026). Name locked, spec docs written, design direction fixed, no code yet. Next concrete step is the TS scaffold + mock-provider tests, which need no credentials. The live hello-world needs Raphie's Photon account (his 10-minute checklist below).

## What's done

- Research: Photon = spectrum-ts SDK + Spectrum Cloud (free tier, allowlist). Typeform fields captured. Competitor scan: Codex/Claude-in-iMessage clones dominate; excluded.
- Naming: Quash (repo handle free, no collisions).
- Spec: PRD.md, Architecture.md, Tasks.md, Memory.md, design.md, ORCHESTRATOR.md.
- Design brief: iMessage-native chat grammar, copy-editor voice, tapback-as-verdict signature; DESIGN_LEDGER appended (canonical + per-entry).

## In progress

- TS scaffold + AGENTS.md + first commit/push.

## Blocked / waiting

- Hello-world live loop — blocked on Raphie's Photon creds (his account, his click).
- Group-chat demo scene — blocked on one friend's consented number.

## How to run it

```bash
npm install
npm run typecheck
npm test          # mock provider, no creds needed
npm start         # live loop; needs QUASH_* env vars + Photon creds
```

## Raphie's Photon checklist (10 minutes, his account)

1. Sign up at https://app.photon.codes (his email).
2. Create a project: copy Project ID + Project Secret.
3. Users tab: add his own phone number (E.164) so his texts reach the agent.
4. Put both values in `.env` (template in `.env.example`): QUASH_PROJECT_ID, QUASH_PROJECT_SECRET.
5. Text the Photon-assigned number "hello" from his phone; the echo bot should reply.

## Next steps

1. TS scaffold + AGENTS.md + push (no creds needed).
2. Mock-provider tests for triage + verify (offline).
3. When creds land: hello-world echo, then calibration claims.

## Open questions

- Category switch (Most useful vs Funny/viral): re-scan the X field on Sep 8 before submitting.
- Friend number for the group scene: consent pending.

## Pointers

- Spec: [PRD.md](./PRD.md) · [Architecture.md](./Architecture.md)
- Plan: [Tasks.md](./Tasks.md)
- History: [Memory.md](./Memory.md)
- Design: [design.md](./design.md)
- Ledger: [ORCHESTRATOR.md](./ORCHESTRATOR.md)
