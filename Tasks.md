# Quash — Tasks

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Phase 0 — Foundations (Sep 5)
- [x] Spec docs + design brief + DESIGN_LEDGER (canonical + per-entry) — done 2026-09-04
- [x] AGENTS.md in repo — done 2026-09-04 (75 lines, 7 clause families)
- [ ] Repo pushed to github.com/A-Raphie/quash — done when remote has the scaffold commit
- [x] Photon signup steps handed to Raphie (Handoff.md checklist) — done 2026-09-04
- [x] TS scaffold: package.json, tsconfig, env template, config, log — done 2026-09-04, typecheck green
- [ ] Hello-world DM loop (echo bot) — blocked on Raphie's Photon creds — done when his phone texts the Photon line and gets an echo
- [x] Mock-provider unit tests for triage + verify (no creds needed) — done 2026-09-04, 11/11 passing offline

## Phase 1 — MVP (Sep 6)
- [~] Calibration: search + verify over 5 fixed claims — engine rewired to gpt-oss-120b + built-in browser_search after groq/compound 413'd; first live run in progress
- [ ] Full pipeline: triage → search → verify → tapback → threaded verdict → typing indicator — done when a real false claim gets tapdown + sourced thread under 60s
- [ ] Roast mode one-liner (flag, default on) — done when the one-liner lands after sources, dry not cringe
- [ ] Guardrails: `stop` command, allowlist double-check, claim length cap — done when stop halts the loop and non-registered senders get ignored
- [ ] Self-test matrix over iMessage: true claim, false claim, unverifiable, opinion, pleasantry, command, quoted long article text — done when all 7 behave per spec
- [ ] mock-hunter pass: every on-screen value in demo material traces to a real check in checks.jsonl — done when zero fabricated data

## Phase 2 — Demo package (Sep 7)
- [ ] demo-script storyboard mapped to usefulness / creativity / viral criteria — done when storyboard file exists with per-scene criterion tags
- [ ] Chat-history screenshot set (the allowed demo format): DM + group scenes — done when 4-6 screenshots selected, clean, no personal data leaks
- [ ] One 45-60s screen recording of Messages.app on Desktop 2 (terminal-preflight, real takes, rough cut) — done when rough cut on disk
- [ ] README with hero (chat screenshot), one-liner, how-it-works, honesty section — done when links audited
- [ ] posts.md drafts (X post + follow-ups) — done when 3 variants ready for Raphie
- [ ] Typeform answers pre-filled (category Most useful, one-liner, title, handle, Project ID) — done when the form can be submitted in one sitting

## Phase 3 — Submit (Sep 8)
- [ ] Raphie's VO if wanted, final cut — done when he approves the cut
- [ ] Raphie posts to X tagging @PhotonHQ — his click
- [ ] Typeform submit — his click, after notify
- [ ] Sep 9-10 buffer: follow-up posts, field re-scan, category switch if needed

## Dependencies

Hello-world and all live tests depend on Raphie's Photon creds (Phase 0). Everything else proceeds offline (mock provider). Demo package depends on MVP. Submission depends on demo package + his clicks.

## Done = X post live and tagged @PhotonHQ, typeform submitted with Project ID, repo public and clean.
