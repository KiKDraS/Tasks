---
name: write-root-readme
description: Write or rewrite the repo-root README.md for Tasks.
---

<!-- Adapted from KiKDraS/opencode-landing-page-template (.opencode/skills). -->

# Write Root README

`README.md` is Spanish. Docs, code, and this skill are English.

## Read first

- `README.md` — current delivery copy.
- `.opencode/docs/project-brief.md` §Entrega and §Accepted gaps.
- `package.json` — real scripts and dependencies.
- `__tests__/` — real suite and test counts.

## Keep these sections

1. Title and one-line purpose.
2. Why the repo exists (ISTEA Parcial 1 context).
3. Chosen option (`Gestor de tareas`).
4. How to run: install, start, device/emulator, test, lint, typecheck.
5. Implemented features: auth, tasks, reminders, persistence, navigation, tests.
6. Test evidence: real command and real counts.
7. Demo video link.
8. Stack.

## Rules

- Spanish rioplatense, concise. Code identifiers and commands stay unchanged.
- Every command must exist in `package.json` or the Expo CLI. Use `pnpm`.
- Never hardcode a test count. Run the test command on the branch you are
  documenting and use its real suite/test numbers; never copy an old count.
- No Socialify, badge walls, emojis, or invented links.
- No relative links. Use absolute GitHub URLs.
- Do not duplicate `SPEC.md` or `DESIGN.md`; link to them if useful.
- The assignment asks for a YouTube demo. If the link is still Google Drive,
  record it under accepted gaps; do not silently call it YouTube.
- Prefer a full rewrite over incremental edits when the README is stale.

## Validation

- Run `pnpm test` if the README states a count or result.
- Run `pnpm lint` and `pnpm exec tsc --noEmit` if the README documents them.
- Open every link; confirm it resolves.
- Spot-check the run commands against `package.json`.
- Confirm the demo link is the one the user approved.
- Confirm the README does not claim a feature that is absent from `src/`.
