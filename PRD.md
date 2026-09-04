# Quash — PRD

One-line pitch: **Quash. Text it the rumor, it tapbacks the lie with sources.**

An iMessage agent on Photon (spectrum-ts) that fact-checks claims in your group chats: it reacts to the original message with a native tapback verdict, then threads a short sourced verdict reply under it. "Community Notes for iMessage."

Entry: Photon's "The Best iMessage Agent" contest ($3,000 across 3 slots; judged on usefulness, creativity, viral/funny factor, plus social traction). Deadline Sep 10, 2026. Post + typeform by Sep 8, 2026.

## Problem

Group chats are where misinformation actually travels between normal people: a screenshot, a wild health claim, a fake quote. The correction workflow today is: someone leaves the chat, googles, comes back with "that's not true," and gets argued with. The correction rarely attaches to the original message, so the chat scrolls past it. X solved this format with Community Notes; iMessage has nothing.

## Personas

- **Primary: the group-chat member** (Raphie himself, and anyone in a family or friends chat) who receives forwarded claims daily and wants a reality check attached to the exact message, inside the chat, without anyone opening a browser.
- **Secondary: the chat's designated skeptic** who currently does manual googling for everyone and wants a machine to take the shift.

## Jobs to be Done

1. When someone drops a dubious claim in the chat, I want a sourced verdict attached to that exact message, so the chat self-corrects where the claim happened.
2. When a claim is genuinely unverifiable, I want the agent to say so plainly instead of guessing, so I can trust its verdicts.
3. When I want entertainment value, I want the verdict to have a dry one-liner, so the correction gets screenshots and shares.

## Scope (v1)

- Photon Spectrum Cloud line (free tier), agent process runs locally on Raphie's Mac.
- DM and existing group chats with registered project users (free-tier allowlist is upstream).
- Claim intake: any inbound message with a checkable factual claim (triaged), or explicit `quash: <claim>` / `quash` reply trigger.
- Verdict output: native tapback on the original message (VERIFIED thumbs up, REFUTED thumbs down, UNVERIFIABLE exclamation), then a threaded reply: verdict line, one or two sentence rationale, 2 or 3 sources as plain URLs with domain labels, optional dry one-liner (roast mode).
- Typing indicator while checking (the suspense beat is part of the show).
- `stop` kill command; JSONL log of every check.

## Non-goals

- No website in v1 (stretch at most, only after demo assets exist).
- No WhatsApp / Telegram / SMS surfaces even though Spectrum supports them.
- No image, video, or screenshot verification: text claims only in v1.
- No proactive outbound messaging, no scheduled sends, no broadcast.
- No user accounts, no dashboard, no onboarding flow.
- No new-group creation (free tier cannot create groups).

## Success metrics

- End to end claim to tapback + verdict reply under 60 seconds (Groq free tier pace).
- At least 90% of REFUTED/VERIFIED verdicts carry at least one real, resolvable URL.
- Zero messages sent to numbers outside the registered allowlist.
- Contest package live: X post (chat-history screenshots + one short video) by Sep 8, typeform submitted by Sep 8.

## Kill criteria

- If Photon signup or line provisioning is blocked by EOD Sep 5: pivot to `@spectrum-ts/imessage-local` (chat.db) and accept the typeform Project ID risk, or drop the entry. Do not burn Sep 6-7 on provisioning.
- If native tapbacks prove unavailable at runtime: fall back to a lead-emoji verdict line in the threaded reply. Never block the build on the reaction API.
- If the Groq search path (compound) returns junk evidence on 3 consecutive calibration claims: switch evidence provider (Tavily free tier) before Sep 6 ends.

## Open questions

- [assumption] Category choice "Most useful" holds; re-scan the X field of entries right before submitting and switch if the useful track looks oversubscribed.
- [assumption] Roast mode ON by default is the right show for the demo; a `quiet` command can turn it off.
- [to fill] One friend's phone number for the group-chat demo scene (needs their consent; free tier allows 10 registered users).
