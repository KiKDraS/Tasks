# Stack Standards

Binding: `mobile-dev` (write) + `code-review` (audit). Applies to new and
changed code in a PR; untouched legacy is out of scope. Contract = AGENTS.md
structure + SPEC.md behavior + DESIGN.md aesthetics. Refines, never overrides.
Single source — no copies in agent files.

## Project fit

- Expo SDK 57, React Native, Expo Router, TypeScript `strict`.
- Auth state: React context. Task state: Zustand store (Parcial 2 target).
- Tokens and colors: `src/constants/theme.ts` (`Colors`). No `colors.ts`.
- UI copy: Spanish, inline per `.opencode/skills/ux-writing/SKILL.md`.
- Routes, storage keys, time values: `src/constants/`.
- Scope: new/changed code; do not reject unrelated legacy.

## TypeScript

- **Strict** (`"strict": true`). Zero `tsc` errors. No `any` without
  justification — `unknown` + narrowing.
- **Interfaces** for component props and exported object shapes.
  Discriminated unions for state machines. Function signatures use explicit
  parameter and return types.
- **No magic strings.** Storage keys, routes, domain terms, and fixed values
  come from `src/constants/` or domain constants. No hardcoded hexes; use
  `Colors` from `src/constants/theme.ts`. UI copy stays inline in Spanish unless
  reused or domain-critical.
- **Constants per domain:** one file per concept. No catch-all
  `constants.ts`/`types.ts`/`utils.ts`/`helpers.ts`.
- **Promote:** feature constants/types used in 2+ files → `<name>/types/` or
  `<name>/constants/`. Single-file stays inline.
- **No barrel imports.** Direct source import only.
- **Read-only props:** `readonly` per prop or `Readonly<Props>`.
- `satisfies` for config objects. Generics for reusable utilities.

## Composition

- **No boolean prop proliferation.** Compound components, explicit variants over
  `isPrimary`, `isLarge`, `isDisabled`.
- **Lift shared state** to providers or Zustand stores when siblings share it.
- **Children over render props.** Compose via `children` unless dynamic render
  control genuinely needed.
- **No inline components** defined inside other components — breaks
  reconciliation.

## Component hygiene

- **No raw string state.** Use const objects:
  ```ts
  const ViewType = { Grid: "grid", Numpad: "numpad" } as const;
  type ViewType = (typeof ViewType)[keyof typeof ViewType];
  ```
- **150+ line component/logic files** or 2+ distinct blocks → split. Token and
  config files are exempt.
- **One concern per file.** Layout XOR logic XOR IO. Inline hooks/utils past
  20 lines → own file.
