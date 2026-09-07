# Quash — Memory

Running log of decisions, conventions, and gotchas. Newest at the top.

## Decisions

- **2026-09-04** — Photon account already existed (arnxto@gmail.com, Google OAuth, "Legend"); signed in via the IAB's live Google session, no signup needed. Generated email+password in .env is therefore unused; kept in case a fallback login is ever needed. Dedicated project **quash** created for the contest: Project ID dc3cc640-ad0c-4729-8dd8-ecca7ca383ca (secret in .env, both QUASH_* and SPECTRUM_* spellings). The pre-existing "HQ" project (02730355-0ffd-41d2-903d-7eb57782f24f) stays untouched.
- **2026-09-04** — Dashboard quirks: signup/login pages render but expose empty ARIA trees (drive via evaluate + native setters); phone enrollment wall is `account_phone_missing` on the Get started page until a phone is added from the avatar menu (nested menu is flaky under synthetic clicks: real-pointer or hand-driven).

- **2026-09-04** — Photon account identity: arnxto@gmail.com (the hackathon account email, same as app-ryochan.com "Legend"). Credentials live in quash/.env (PHOTON_ACCOUNT_EMAIL/PASSWORD), gitignored, never in transcript or repo. Signup form driven via IAB; Create account click held for his go per the notify-gate rule.

- **2026-09-04** — Name: **Quash** (archaic-legal verb, to kill a claim). Finalists: stet, errata. Quash won the hook-sentence test and reads as an action, fitting "Most useful". Repo A-Raphie/quash free, zero contest collisions.
- **2026-09-04** — Concept: group-chat fact-checker, "Community Notes for iMessage" framing. Chosen via hackathon-idea-hack against an exclusion list (the field is a flood of Codex/Claude-in-iMessage clones). Reuses the claimcheck verification thesis; engine ports (agent.ts, verifier.ts), sandbox does not.
- **2026-09-04** — Transport: Photon Spectrum Cloud (free tier), NOT imessage-local. The typeform requires a Photon Project ID; cloud needs no Full Disk Access; local mode lacks reactions (the signature mechanic).
- **2026-09-04** — Hosting: long-lived local process on Raphie's Mac. No hosted URL needed for eligibility; Railway slot occupied by purser until Sep 9; free-tier allowlist means judges never text the agent.
- **2026-09-04** — Two-model design: groq/compound (built-in web search) for evidence, openai/gpt-oss-120b for the verdict JSON. Judge only sees evidence, never searches. Fallback: Tavily free tier for search.
- **2026-09-04** — Signature mechanic: native tapback lands on the original claim (👍/👎/‼️), sourced verdict threads under it. No web receipts page: the receipt/stamp axis belongs to Assay, ledger check confirmed.
- **2026-09-04** — Category: "Most useful" (default), re-scan the X field before submitting; roast mode carries the funny track as a bonus, not the pitch.
- **2026-09-04** — Timeline: lean sprint. Post by Sep 8 to give the traction window runway (traction is judged; posts count from Sep 3).

## Conventions

- No em dashes anywhere in copy, docs, README, or message templates. Use `:` or `.` for asides.
- Verdict vocabulary: VERIFIED / REFUTED / UNVERIFIABLE internally; in chat: "Holds up." / "Dead wrong." / "Can't call it." for the UNVERIFIABLE honesty state.
- All model env vars prefixed `QUASH_` (QUASH_API_KEY, QUASH_BASE_URL, QUASH_MODEL, QUASH_SEARCH_MODEL).
- Engine ports keep claimcheck's strictness: absence of evidence is UNVERIFIABLE, never a guess; citation required.

## Gotchas

- **groq/compound is unusable for search at this tier (verified 2026-09-04):** any query that actually triggers its server-side web search 413s with `request_too_large`, both compound and compound-mini. Search path is now `openai/gpt-oss-20b` + Groq's built-in `browser_search` tool: 10s per search, clean JSON, real sources (probe-verified). Verdict stays on 120b. First full calibration run: verdicts + roasts on-voice, but 120b-heavy pacing produced 774-831s latencies; the 20b search split exists to fix exactly that.
- Groq compound probe artifacts in /tmp/r_*.json, oss_bs.json were used for diagnosis; safe to delete.
- Photon free tier: shared-pool numbers with a registered-user allowlist; strangers cannot text the agent ("Target not allowed for this project" is the tell). 10 users max, 50 new conversations/line/day quota. Inbound-first is also Apple deliverability best practice.
- Native tapbacks are only the six: 👍 👎 ❤️ 😂 😮 ‼️. Spectrum's `Emoji` map has `like/dislike/emphasize/question` plus hundreds of custom keys; arbitrary emoji may not map to native tapbacks on iMessage. Runtime-verify on first live run; `message.react()` resolves `undefined` when unsupported (our fallback signal).
- Groq free tier: 429s are normal on gpt-oss-120b; the claimcheck client paces off the server's "try again in Ns" hint. Keep that port intact. Browser-search calls run long (30s+); request timeout raised to 120s.
- Spectrum API shapes verified from installed types 2026-09-04: `Spectrum({projectId, projectSecret, providers: [imessage.config()]})`; `for await (const [space, message] of app.messages)`; `message.react/reply/read`, `space.responding(fn)`; inbound text at `message.content` (object with `text` field).
- No scheduled-send API in Spectrum: never promise delayed sends.
- **Shared-pool lines reject email-handle senders (verified live 2026-09-07):** texts sent from an @icloud.com handle get an autoreply ("can't route it to the right agent... only supports phone numbers") and never reach the agent stream. Fix is on the sender's device: Settings → Messages → Send & Receive, "Start new conversations from" must be the enrolled phone number (+234...), then start a FRESH thread to the line (the old thread stays tied to the email identity). Business dedicated lines accept both, but that costs $250/line.
- Compound model output shape differs from plain chat completions (executed tools + search results); verify the response parsing on first call.

## Things to not forget

- Raphie must create the Photon account himself (his email, his click): app.photon.codes, copy Project ID/Secret, register his phone number under Users. Checklist goes in Handoff.md.
- Group-chat demo scene needs one friend's registered number: consent ask, do not register anyone without it.
- `caffeinate` the Mac during demo/recording windows; the agent process must be visibly alive for takes.
- Before any recording: Desktop 2 rule, terminal-preflight, verify Space with a screencapture probe.
