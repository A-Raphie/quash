# Quash

**Text it the rumor, it tapbacks the lie with sources.**

Quash is an iMessage agent that fact-checks your group chats. Forward it a dubious claim and it reacts to the original message with a native tapback (👍 holds up, 👎 dead wrong, ‼️ can't call it), then threads a short sourced verdict right under it. No app, no link, no leaving the chat: Community Notes, in the place misinformation actually travels.

Built on [Photon](https://photon.codes/)'s Spectrum (TypeScript SDK + Spectrum Cloud iMessage line). Entry for Photon's "The Best iMessage Agent" contest, September 2026.

## How it works

1. **Claim lands.** Any inbound message gets triaged: checkable claim, command, or chatter. Chatter gets ignored (one nudge, ever). `quash <claim>` also works as an explicit trigger.
2. **Evidence.** A search agent (gpt-oss-20b with Groq's built-in `browser_search` tool) gathers 3 to 5 decisive sources, primary-first.
3. **Verdict.** A separate judge (gpt-oss-120b) sees only the evidence and answers strictly: VERIFIED, REFUTED, or UNVERIFIABLE, with a citation and a one-to-two sentence rationale. Absence of evidence is never a guess.
4. **The tapback lands on the claim.** Then the sourced verdict threads under it, with an optional dry one-liner (roast mode, `quiet` turns it off).

Every check is appended to `data/checks.jsonl`: timestamp, claim, verdict, sources, latency. No fiction anywhere.

## Stack

- [spectrum-ts](https://github.com/photon-hq/spectrum-ts) on Spectrum Cloud (free tier): the iMessage line, inbound stream, tapbacks, typing indicator, replies
- Groq free tier: gpt-oss-20b (search) + gpt-oss-120b (verdict), OpenAI-compatible
- Node 22, TypeScript. The agent process is a single long-lived loop.

## Run it

```bash
npm install
cp .env.example .env        # Photon project creds + Groq key
npm start                   # live loop
npm run calibrate           # engine-only check over 5 fixed claims (no Photon needed)
npm test                    # offline: mock transport, full pipeline
```

## Honesty section

- The judge model only ever sees gathered evidence, never searches: it cannot confabulate sources it wasn't shown.
- UNVERIFIABLE is a first-class verdict. Claims with no decisive evidence get "Can't call it" plus what would settle them, not a guess.
- Live calibration numbers (verdict accuracy vs ground truth, latency, source counts) land in `docs/submission/` before submission.
- Allowlist enforced twice: Photon's free tier only delivers registered project users, and the agent re-checks senders locally.

## Credit

built by [Raphie](https://x.com/a_raphie)
