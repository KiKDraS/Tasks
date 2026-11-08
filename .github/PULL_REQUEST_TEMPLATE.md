<!-- Adapted from KiKDraS/opencode-landing-page-template. -->

| **Type:** Feature / Fix / Docs / Meta | **Status:** Ready for review |
|---|---|
| **From:** `feature/*`, `fix/*`, or `docs/*` | **To:** `main` or the parent integration branch |

---

## Summary

One paragraph: what changes and why.

---

## Changes

| File | Change |
|------|--------|
| `path/to/file` | What changed and why |

<details>
<summary><b>Review checklist</b></summary>

**Branch hygiene**
- [ ] Branch is based on the correct parent (`main` or the integration branch)
- [ ] No direct commits to `main`
- [ ] Stacked PRs state their parent in the summary

**Scope**
- [ ] Code changes stay in `src/`, `assets/`, or approved config
- [ ] Tests stay in `__tests__/`
- [ ] Docs/meta changes do not alter app behavior
- [ ] No rule copies; shared rules point to their canonical source

**Quality**
- [ ] Code: `pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit` pass
- [ ] Docs/meta: human review only; no code review or QA required
- [ ] Config JSON parses; no broken paths or secrets
- [ ] UI copy checked with `ux-writing`; accessibility checked with `accessibility-mobile`
- [ ] Reminder flow manually checked on a device if notifications changed
- [ ] README/demo link updated only with a real, approved link

</details>

---

## Related

Closes #...

---

> **Reviewer:** requirements live in `.opencode/docs/project-brief.md`; behavior in `.opencode/docs/SPEC.md`; visuals in `.opencode/docs/DESIGN.md`.
