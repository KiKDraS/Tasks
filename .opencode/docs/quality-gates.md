# Quality Gates

Canonical review and test checklist. Requirements live in `.opencode/docs/project-brief.md`; Expo/React Native rules in `.opencode/docs/expo-react-native.md`; source-of-truth policy in `directive-sync.md`.

## Review categories

Use these categories in findings. One failed category rejects the submission.

1. **[REQ] Requirements** — verify against `.opencode/docs/project-brief.md` §Parcial 1 acceptance checklist and, for Parcial 2 implementation, the §Parcial 2 acceptance checklist. Target evidence is in `.opencode/docs/SPEC.md` §15.7. `✅` means implemented; scoring is separate.
2. **[ARCH] Architecture** — verify against `.opencode/docs/expo-react-native.md` §Navigation & Routing and §Repo Notes. Scope guardrails: `.opencode/docs/project-brief.md` §No se requiere.
3. **[RN] Expo/React Native** — verify against `.opencode/docs/expo-react-native.md`.
4. **[A11Y] Accessibility** — apply `.opencode/skills/accessibility-mobile/SKILL.md`: labels, roles, state, touch targets, dynamic type, contrast, screen-reader order.
5. **[TEST] Tests** — verify coverage against `.opencode/docs/project-brief.md` §Testing and the conventions below.
6. **[SYNC] No duplicates** — apply `directive-sync.md`.
7. **[DELIVERY] Delivery** — verify `.opencode/docs/project-brief.md` §Entrega and §Accepted gaps.
8. **[COPY] UI copy** — apply `.opencode/skills/ux-writing/SKILL.md`: Spanish rioplatense, `vos`, no Spanglish, no AI slop.
9. **[STACK] Stack standards** — apply `.opencode/docs/stack-standards.md`.

## Test conventions

- Jest + React Native Testing Library with the `jest-expo` preset; tests live in `__tests__/`.
- Use the `@/` import alias. Mock native modules where needed (`expo-crypto`, `expo-notifications`, `expo-image-picker`, `expo-location`, `expo-contacts/legacy`, `expo-calendar/legacy`, `expo-file-system`, AsyncStorage).
- Run `pnpm test`.
- Coverage target: `.opencode/docs/project-brief.md` §Testing.

## Manual checks

Manual QA steps: `.opencode/docs/project-brief.md` §Manual QA. Record results in the QA handoff.

## Output

Approved:

```text
STATUS: APPROVED
```

Rejected:

```text
### Findings
- [CATEGORY] `file:line` — issue and required fix.

STATUS: REJECTED
```
