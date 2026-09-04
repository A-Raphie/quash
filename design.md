# Quash — Design

The source of truth for how Quash looks, speaks, and behaves in the chat. Every message template defers to this file; deviations update this file, not just the code.

## Design brief (hackathon-design Phase 6)

- **Consensus default (banned):** the helpful AI assistant in iMessage: sycophantic openers ("Great question!"), verbose listicle replies, emoji salad, generic bot name, a purple-gradient landing nobody needs.
- **Axes pushed:** (1) voice: copy-editor terse, verdict-first, dry wit; (2) chat choreography: the typing-indicator suspense beat is part of the show, then the tapback lands on the claim; (3) motion: stillness otherwise, no unsolicited messages.
- **Axes kept conventional:** the chat itself stays 100% iMessage-native. Apple's visual language IS the familiarity anchor; we do not restyle bubbles or send custom cards in v1.
- **Sponsor synthesis:** Photon tokens mined from live CSS: ink ladder #252525 #2F2F2F #4D4D4D #666666 #999999 #C5C5C5 #EEEEEE, accent #00BBFF, support #FF3366. Photon cyan is reserved for branded artifacts (README hero, post overlays, any stretch landing). Inside chat, verdict semantics use Apple system colors by platform default, not Photon's.
- **Signature move:** THE TAPBACK LANDS ON THE LIE. The verdict glyph is a native tapback on the original forwarded message (👍 holds up, 👎 dead wrong, ‼️ can't call it), followed by a sourced verdict threaded under it. Mechanism test: the tapback IS the product's output, not decoration. 5-minute test: a clone can call react(), but the tapback-as-verdict grammar + suspense choreography + sourced thread is the bespoke composition. Demo test: it is the money moment on camera. Scarcity: one tapback per claim, never spam.
- **Avoid-list:** sycophancy, "Great question", exclamation marks in verdicts, markdown tables in bubbles, more than 3 source URLs, unsolicited messages, custom app cards, restyled anything, em dashes.
- **Familiarity anchor:** the chat looks exactly like iMessage. Convention is the product here.
- **Chains to:** ui-craft (if any web surface ever gets built), deterministic-design (demo screenshot audits).

## Feel

"Sharp newsroom desk." Precise, quick, a little dry. The friend who checks before they speak.

## Audience

Normal people in group chats, and contest judges watching screenshots. They expect the agent to read like a sharp human editor, not a bot. Trust is the whole product: verdicts cite, hedges are honest, no guessing.

## Visual direction

In-chat: plain iMessage. No custom formatting experiments in v1: bold text only via plain text, links plain. The composition craft goes into message SHAPE (verdict line, spacing, numbered sources), not styling.

Branded artifacts (README, post overlays, stretch landing): ink-on-light editorial, Photon cyan as the single accent, hairline rules, no gradients, no glow, no rounded-2xl card soup.

## Design tokens

Chat-side: none (native). Branded-side (only if a web surface or overlay is built):

- `--ink: #252525`, `--ink-2: #4D4D4D`, `--ink-3: #666666`, `--paper: #EEEEEE`-ladder from Photon neutrals
- `--accent: #00BBFF` (Photon cyan, single accent)
- `--refuted: #FF3366` (Photon pink-red)
- Type: system stack for chat replicas; brand surfaces get an editorial serif display + grotesk body pairing, decided if/when built
- Radius: Apple-like on chat replicas only; sharp hairlines on brand surfaces

## Copy tone

Copy-editor terse. Verdict first, evidence after, zero filler.

Good:
```
Dead wrong.

The "study" is from 2017 and was retracted in 2019 over faked data. Nobody banned anything.

1. retractionwatch.com: <url>
2. apnews.com: <url>
```

```
Can't call it.

One outlet covers this, nobody corroborates. Settles with a primary filing or an official statement.
```

Bad: "Great question! Let me look into that for you. Here's what I found: there are several perspectives on this topic."

Verdict lead lines: VERIFIED → "Holds up." / REFUTED → "Dead wrong." / UNVERIFIABLE → "Can't call it." Roast mode: one dry sentence after sources, optional, never cruel to a person, always aimed at the claim.

## User flow

1. Claim lands (forwarded or typed) — agent triages silently: claim vs command vs chatter. Chatter gets ignored (or a one-line nudge in DMs only).
2. Checking — typing indicator on, 15-60s. This is the suspense beat. No interim messages.
3. Verdict — tapback lands on the original message, then the threaded verdict reply posts under it.
4. Control — `stop` halts the agent; `quiet` / `roast` toggles the one-liner; `status` replies with checks-today count from the log.

Stretch landing (only if time remains after demo assets): hero is a real chat screenshot composition, one line of copy, "how it works" is the 3-step chat flow. Footer: built by Raphie linking https://x.com/a_raphie.

## Folds used

- (none yet; append per surface when built)

## Avoid-list

- Sycophantic openers, exclamation marks in verdicts, "AI-powered" anywhere in copy
- Em dashes and double hyphens in any user-visible string
- More than 3 sources per verdict, URLs without domain labels
- Custom bubble styling, mini-app cards, rich effects in v1
- Messaging anyone first: the agent only ever replies
- Photon cyan inside the chat (Apple-native semantics only)
