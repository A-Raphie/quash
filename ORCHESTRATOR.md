# Quash — Hackathon Orchestrator Ledger
Event: Photon "The Best iMessage Agent" (photon.codes, typeform yqt76Mv9) · Deadline: 2026-09-10 · Current stage: 2 (Plan+design) · Updated: 2026-09-04

## Sweeps
| Stage | Entered | Exited | Notes |
|---|---|---|---|
| 0 Calibrate | 2026-09-04 | 2026-09-04 | Event already accepted by Raphie (brief pasted); great-work folded into scope question (lean sprint chosen) |
| 1 Idea+validation | 2026-09-04 | 2026-09-04 | hackathon-idea-hack run vs exclusion list; ≤6d event so idea-hack gates 9-11 stand in for the full trio |
| 2 Plan+design | 2026-09-04 | 2026-09-04 | spec + design-direction + hackathon-design + naming + agents-md done; DESIGN_LEDGER appended + diffed vs last 3 |
| 3 Build | 2026-09-04 | | engine ported (agent/search/verify), triage, format, pipeline, live+mock transports, 11/11 offline tests; groq/compound 413 discovered, search rewired to gpt-oss-20b + built-in browser_search; calibration running |

## Skill ledger
| Skill | Stage | State | Note (reason / revisit trigger / result) |
|---|---|---|---|
| great-work | 0 | 🔍 checked-not-needed | entry decision pre-made by Raphie pasting the brief; scope calibrated via AskUserQuestion (defaults taken) |
| hackathon-winner-research | 0 | ✅ done | playbook Exec Summary + Win/Loss read; sponsor-primitive-fit rule drove concept choice |
| hackathon-idea-hack | 1 | ✅ done | exclusion list + 3 pitches; Quash chosen |
| idea-autopsy | 1 | 🔍 checked-not-needed | ≤48h compression rule analog: idea-hack gates suffice on a 6-day solo sprint |
| before-you-build | 1 | ⏸ deferred | only if timeline allows after MVP; risk review mostly settled in PRD kill criteria |
| talk-to-users | 1 | ⏸ deferred | demo scenes with real friends double as conviction signals |
| spec | 2 | ✅ done | 5 files + design.md written 2026-09-04 |
| design-direction | 2 | ✅ done | chat-native direction fixed; user confirmation deferred to his demo review (flagged in design.md) |
| hackathon-design | 2 | ✅ done | consensus default banned, signature move designed, ledger appended |
| agents-md | 2 | ✅ done | written 2026-09-04 |
| naming | 2 | ✅ done | Quash locked, stet in pocket |
| semantic-tokens | 2 | ⏸ deferred | only if a web surface gets built (stretch) |
| component-harvest | 2 | ⏸ deferred | same trigger as semantic-tokens |
| enoch-ui / winsznx-ui / winsznx-landing / winsznx-arcade | 2 | 🔍 checked-not-needed | no dashboard/fintech/game surface exists; chat is Apple-native; landing is stretch |
| deploy-target check | 2 | ✅ done | local process, documented in Architecture.md; Railway stays with purser |
| andrej-karpathy | 3 | ⏳ possibly-useful | always-on during coding |
| lemmaly / invariant-guard / mathguard | 3 | 🔍 checked-not-needed | no non-trivial algorithms: triage is a prompt, engine is sequential calls |
| ui-craft | 3 | ⏸ deferred | trigger: web surface build only |
| ux-laws | 3 | ⏳ possibly-useful | chat copy decisions lean on it; no interface build |
| humaniser | 3 | ⏳ possibly-useful | run before finalizing verdict templates + post copy |
| browser-testing-with-devtools | 3 | ⏸ deferred | no web surface in v1 |
| dos-verify-done-claims | 4 | ⏳ possibly-useful | run before claiming MVP done |
| see-whats-going-on | 3 | ✅ done | event rules via tweet + typeform JSON; photon.codes + docs rendered by Explore agent |
| web-search-fallback | 3 | ⏸ deferred | trigger: search quota death |
| terminal-preflight | 3 | ⏸ deferred | trigger: before any recording launch |
| resume-project | 3 | ⏳ possibly-useful | any fresh session re-enters via Handoff.md |
| mock-hunter | 4 | ⏸ deferred | mandatory before demo material ships (Sep 7) |
| deterministic-design | 4 | ⏸ deferred | trigger: web surface build only |
| lookdev / lookdev-auto | 4 | 🔍 checked-not-needed | no tunable web UI in v1 |
| frontend-lighthouse | 4 | 🔍 checked-not-needed | no web surface in v1 |
| agent-legible | 4 | ⏳ possibly-useful | Quash IS an agent product; a tiny llms.txt on stretch landing could help judges |
| website-audit | 4 | ⏸ deferred | trigger: landing built |
| ship-rehearsal / vercel-disable-sso / pre-release-review / pre-ship-gate | 5 | 🔍 checked-not-needed | no hosted deploy; live rehearsal happens in-chat instead |
| production-audit | 5 | 🔍 checked-not-needed | post-event only |
| demo-script | 6 | ⏸ deferred | mandatory first in demo prep (Sep 7) |
| vo-first | 6 | ⏸ deferred | trigger: Raphie provides VO audio |
| demo-video | 6 | ⏸ deferred | recorder pick likely desktop-demo (Messages.app on camera) |
| desktop-demo | 6 | ⏸ deferred | ◆: explicit go before recording his real surfaces |
| submission | 6 | ⏸ deferred | ◆: typeform submit is his click |
| post-hackathon | 7 | ⏸ deferred | after winners Sep 12 |

## Stage gate
- [x] Exit sweep done (all ⏳/⏸ revisited) for stages 0-1
- [ ] Stage 2 exit sweep before Phase 0 code
- [x] ◆ skills that ran: none yet
- [ ] Next stage's entry sweep queued (Stage 3 at first code)
