# Quality Gates

Canonical review and test checklist. Requirements live in `.opencode/docs/project-brief.md`; Expo/React Native rules in `.opencode/docs/expo-react-native.md`; source-of-truth policy in `directive-sync.md`.

## Review categories

Use these categories in findings. One failed category rejects the submission.

1. **[REQ] Requirements** — verify against `.opencode/docs/project-brief.md` §Acceptance checklist.
2. **[ARCH] Architecture** — verify against `.opencode/docs/expo-react-native.md` §Navigation & Routing and §Repo Notes. Scope guardrails: `.opencode/docs/project-brief.md` §No se requiere.
3. **[RN] Expo/React Native** — verify against `.opencode/docs/expo-react-native.md`.
4. **[A11Y] Accessibility** — accessible labels and roles, touch targets, contrast, readable text, screen-reader order.
5. **[TEST] Tests** — verify coverage against `.opencode/docs/project-brief.md` §Testing and the conventions below.
6. **[SYNC] No duplicates** — apply `directive-sync.md`.
7. **[DELIVERY] Delivery** — verify `.opencode/docs/project-brief.md` §Entrega and §Accepted gaps.

## Test conventions

- Jest + React Native Testing Library with the `jest-expo` preset; tests live in `__tests__/`.
- Use the `@/` import alias. Mock native modules where needed (`expo-crypto`, `expo-notifications`, AsyncStorage).
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
