---
name: accessibility-mobile
description: React Native and Expo accessibility checklist adapted from WCAG. Use when building, reviewing, or fixing mobile UI, forms, icon buttons, task lists, modals, or notification flows.
---

# Accessibility — Mobile

Adapted from WCAG 2.2 AA principles for native React Native. This is a
project checklist, not a legal compliance claim.

## Scope

Applies to `src/app/`, `src/components/`, and any screen read by VoiceOver
(iOS) or TalkBack (Android). Web-only rules (skip links, DOM landmarks, HTML
`alt`) do not apply.

## 1. Labels, roles, state

Every interactive element needs an accessible name and a role.

- Icon-only control → `accessibilityLabel`.
- Role → `accessibilityRole` (`button`, `link`, `header`, `checkbox`,
  `switch`, `alert`, `text`, `image`).
- State → `accessibilityState` (`checked`, `disabled`, `selected`, `busy`,
  `expanded`).
- Hint → `accessibilityHint` only when the result is not obvious from the
  label. Do not repeat the label.

```tsx
<AppTouchableOpacity
  accessibilityRole="button"
  accessibilityLabel={`Editar ${task.title}`}
  accessibilityState={{ disabled: !task.id }}
  onPress={openEdit}
>
  <EditIcon />
</AppTouchableOpacity>
```

Rules:

- Do not put a label on a decorative icon. Use `accessible={false}`,
  `accessibilityElementsHidden`, or `importantForAccessibility="no"`.
- `Text` is readable by default. Give `TextInput` a visible label and an
  `accessibilityLabel`; `accessibilityLabelledBy` is Android-only.
- A row that acts as one control should be one accessible element. Do not
  flatten unrelated text and actions into a single element.
- `Switch` needs a label; the native control exposes the state.
- `Alert` role for errors that must interrupt.

## 2. Touch targets

Minimum: 44×44 pt iOS, 48×48 dp Android.

- Wrap small icons in a 44/48 container or add `hitSlop`.
- Checkbox, edit, delete, password toggle, and FAB must meet the minimum.
- Do not rely on visual size alone; the hit area is what counts.

Current gap: checkbox 24, password toggle 20. Edit/delete/share actions and the
FAB now have labels and padded targets. Add `hitSlop` or a larger pressable
wrapper to the remaining two.

## 3. Dynamic type

- Keep `allowFontScaling` on (default).
- Avoid fixed heights on text containers. Use padding and `minHeight`.
- Test at 200% text size; nothing may clip, overlap, or disappear.
- `maxFontSizeMultiplier` only for compact chrome where layout breaks, and
  only after testing.
- Do not use `adjustsFontSizeToFit` as a substitute for a responsive layout.

## 4. Contrast

WCAG AA: 4.5:1 normal text, 3:1 large text (18 pt+ or 14 pt+ bold).

Measured project tokens:

| Pair | Ratio | Result |
| --- | --- | --- |
| `on-surface` on `surface` | 16.23:1 | pass |
| `on-surface-variant` on `surface` | 4.71:1 | pass |
| `on-surface-variant` on `surface-variant` | 3.90:1 | **fail for normal text** |
| `on-secondary-container` on `secondary-container` | 4.55:1 | pass |
| `on-primary` on `primary-container` | 14.63:1 | pass |
| `error` on `surface` | 6.12:1 | pass |
| `secondary` on `surface` | 6.14:1 | pass |

Do not use `on-surface-variant` on `surface-variant` for chips, placeholders, or
labels below 18 pt. Fix the token pair or use a darker text color.

Never encode meaning with color alone. The completed task uses color, a
line-through, and a filled checkbox; keep at least two signals.

## 5. Focus and screen reader order

- Order follows the visual reading order: title, description, actions.
- Do not hide focusable content behind `opacity: 0`; remove it or mark it
  inaccessible.
- Modal or overlay → `accessibilityViewIsModal` (iOS) and hide the background
  with `importantForAccessibility="no-hide-descendants"` (Android).
- After a screen change or validation error, move focus deliberately with
  `AccessibilityInfo.setAccessibilityFocus` and a node ref, or announce the
  change.
- `accessibilityElementsHidden` hides children on iOS; `importantForAccessibility`
  controls Android. Use both when hiding a subtree.

## 6. Errors and announcements

- Show the error next to the field, in text, not only in color.
- Announce validation errors:
  - Android: `accessibilityLiveRegion="polite"` on the error text.
  - Both: `AccessibilityInfo.announceForAccessibility(message)` after submit.
- Include the field name in the message: `El título es obligatorio`, not
  `Campo inválido`.
- Do not steal focus on every keystroke; announce on submit or blur.
- The task-not-found state is an alert; keep it readable.

## 7. Motion and timing

- Respect reduce motion: read `AccessibilityInfo.isReduceMotionEnabled()` and
  subscribe to `reduceMotionChanged`; skip non-essential animation when true.
- No essential information may depend on animation or a time limit.
- The reminder badge updates every 30 s; it is not announced continuously.
  Announce only when the state changes in a user-triggered flow.

## 8. Forms and notifications

- Every input has a persistent visible label, not only a placeholder.
- Password visibility toggle has `Mostrar contraseña` / `Ocultar contraseña`
  labels and a 44×44 target.
- Request notification permission with a reason before the system prompt when
  the flow allows it. If denied, keep the task saved and explain how to enable
  permissions.
- Notification content: task title plus a useful body; do not put only
  `Recordatorio`.

## 9. Testing

Use React Native Testing Library queries by role and label:

```ts
screen.getByRole("button", { name: "Editar Comprar leche" });
screen.getByRole("checkbox", { checked: false });
screen.getByLabelText("Contraseña");
```

Manual checks:

- VoiceOver: swipe through Home, task form, and auth; every control is named.
- TalkBack: same flow; check state announcements.
- 200% text size: no clipping in header, cards, form, buttons.
- Reduce motion: enable, confirm animations are skipped.
- Contrast: verify new color pairs with a checker; do not trust the eye.

## Review checklist

- [ ] Every icon-only control has a label and role.
- [ ] Every control has a 44/48 target or `hitSlop`.
- [ ] State is exposed (`checked`, `disabled`, `selected`, `busy`).
- [ ] Decorative icons are hidden from the screen reader.
- [ ] Text scales to 200% without clipping.
- [ ] Text contrast is 4.5:1; large text 3:1.
- [ ] No meaning by color alone.
- [ ] Errors are visible and announced.
- [ ] Modal hides background focus.
- [ ] Reduce motion is respected.

## References

- React Native accessibility: https://reactnative.dev/docs/accessibility
- React Native AccessibilityInfo: https://reactnative.dev/docs/accessibilityinfo
- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
