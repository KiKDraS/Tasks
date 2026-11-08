# SPEC — Tasks

Behavior and architecture of the shipped app. This document describes what the
code does, not what it should do. Every statement cites the file that
implements it.

## 1. Precedence

1. The implementation (`src/`, `app.json`, `package.json`) is authoritative.
2. `.opencode/docs/project-brief.md` records the original assignment. Where the
   assignment and the code disagree, the code wins; the exam was already
   approved.
3. Stitch project `Minimalist Reminder Todo App` is a visual reference only. It
   never overrides behavior or tokens; see `DESIGN.md` for the conflict table.

## 2. Scope

A local-only task manager. Authentication, tasks, reminders, and persistence
run on the device; there is no backend, no sync, and no remote account.

In scope:

- Register and sign in with a username and password.
- Create, list, edit, complete, and delete tasks.
- Schedule one local notification per task.
- Persist users, the active session, and tasks across app restarts.

Out of scope: password recovery, profile editing, per-user task isolation,
sharing, recurring tasks, priorities, categories, and server-side validation.

## 3. Stack and runtime

- Expo SDK 57, React Native 0.86.3, React 19.2.3, TypeScript.
- Expo Router 57 for navigation, built on React Navigation.
- `@react-native-async-storage/async-storage` for persistence.
- `expo-notifications` for local reminders.
- `@expo/ui` datetime picker for date reminders.
- `expo-crypto` for task IDs (`generateId` → `randomUUID`).
- `@expo-google-fonts/geist` for the typeface.
- Jest 29 with `jest-expo` and React Native Testing Library.

Sources: `package.json`, `app.json`, `src/utils/id.ts`, `src/constants/theme.ts`.

## 4. Architecture

Layers, from outside in:

| Layer | Responsibility | Location |
| --- | --- | --- |
| Routes | Screen composition and protected groups | `src/app/` |
| Contexts | Auth session and task collections | `src/context/` |
| Hooks | Form state, storage, task lookup, reminder helpers | `src/hooks/` |
| Components | Presentational UI and reusable primitives | `src/components/` |
| Constants and utils | Tokens, routes, storage keys, dates, IDs | `src/constants/`, `src/utils/` |

Provider tree (`src/app/_layout.tsx`):

```text
SessionProvider
└── ThemeProvider (expo-router NavigationTheme)
    └── SafeAreaProvider
        ├── SplashScreenController
        └── RootNavigator (Stack)
```

`TasksProvider` is mounted inside the `(tabs)` layout, so task state exists only
while the authenticated area is mounted (`src/app/(tabs)/_layout.tsx`).

## 5. Routing and access control

`RootNavigator` renders one `Stack` with headers hidden and two protected
groups (`src/app/_layout.tsx`):

| Guard | Screens | Path |
| --- | --- | --- |
| `!!session` | `(tabs)` | `/` resolves to the tabs group |
| `!session` | `index`, `sign-up` | `/`, `/sign-up` |

`Stack.Protected` swaps groups when the session changes. Signing out therefore
unmounts the task tree and returns to the login screen; signing in mounts it.
There is no manual redirect in the auth screens.

Tabs (`src/app/(tabs)/_layout.tsx`):

| Tab route | File | Purpose |
| --- | --- | --- |
| `index` | `src/app/(tabs)/index.tsx` | Task list (Home) |
| `task-form` | `src/app/(tabs)/task-form/index.tsx` | Create or edit a task |

The task form receives an optional `id` query parameter
(`useLocalSearchParams`). Present `id` → edit; absent → create. The form is a
tab, so it stays mounted; `TaskFormContent` is keyed by `taskId ?? "new"` to
reset local state when the target changes (`src/components/ui/task-form/task-form.tsx`).

Route constants live in `src/constants/routes.ts` (`signUp`, `taskForm`).

## 6. Data model and storage

Three AsyncStorage keys (`src/constants/storage-keys.ts`):

| Key | Value | Type |
| --- | --- | --- |
| `session` | Active session JSON, removed on sign-out | `Session` |
| `users` | JSON array of registered sessions | `Session[]` |
| `tasks` | JSON array of tasks | `Task[]` |

```ts
type Session = { user: string; password: string };

type TaskNotification = { id: string; scheduledAt: string };

type Task = {
  id?: string;
  title: string;
  description: string;
  isComplete?: boolean;
  notification: TaskNotification | null;
};

type ReminderSelection =
  | { type: "time"; seconds: number }
  | { type: "date"; date: Date };
```

Sources: `src/context/auth/types/Session.ts`,
`src/context/tasks/types/Task.ts`,
`src/context/tasks/types/Reminder.ts`.

Credentials are stored in plaintext. This is intentional for the assignment and
must not be treated as production authentication.

Seed data:

- Users: `Ana` / `1234` (`src/context/auth/data/users-seed.ts`).
- Tasks: three examples, one complete, one with a reminder one week out
  (`src/context/tasks/data/tasks-seed.ts`).

Seeding happens lazily: `useDB` writes the provided seed only when the key is
missing or empty (`src/hooks/use-db.ts`). Stored data is never overwritten on
startup. Invalid JSON parses to an empty array.

All writes are JSON-stringified arrays. `useDB` adds an 800 ms delay to
`createItem`, `updateItem`, `deleteItem`, and `itemExists` to simulate a network
round trip (`src/hooks/use-db.ts`). UI loading states rely on this delay.

## 7. Authentication

Context: `src/context/auth/auth-context.tsx`.

### Register

1. The sign-up form trims the username and validates the fields
   (`src/hooks/sign-up/use-sign-up-form.ts`).
2. `registerUser` calls `itemExists` for the same username.
3. If taken, it returns `false`; the form shows `Ese usuario ya existe`
   (`src/hooks/sign-up/constants/index.ts`).
4. Otherwise it appends the session to `users`, writes the same object to
   `session`, and returns `true`. Registration signs the user in immediately.

### Sign in

1. `signIn` calls `itemExists` with an exact `user` and `password` match
   (`src/context/auth/auth-context.tsx`).
2. On success it writes the session to `session`; on failure the form shows
   `Usuario o contraseña incorrectos` (`src/hooks/sign-in/constants/index.ts`).

### Sign out

`signOut` removes the `session` key. Users and tasks remain stored.
The control is the user menu in the header (`src/components/ui/header/user-menu.tsx`).

### Session restore

`useStorageState` reads `session` on mount and reports `isLoading` until the
read resolves (`src/hooks/use-storage-state.ts`). `SplashScreenController` keeps
the splash visible until then (`src/components/splash-screen-controller.tsx`).

No password strength, length, or username format rule exists. Only "required"
checks run.

## 8. Task lifecycle

Context: `src/context/tasks/tasks-context.tsx`.

### List

Home reads `tasks` from `TasksProvider` and renders a `FlatList`. The list is
not filtered or sorted; storage order is render order, so new tasks append at
the bottom (`src/components/ui/home/home-tasks-list.tsx`).

When the array is empty, the list renders `No tasks found.`
(`src/components/ui/home/home-tasks-empty.tsx`). This English string is a known
copy inconsistency; the rest of the UI is Spanish.

### Create

1. The form validates the title and reminder.
2. `resolveTaskNotification` cancels any previous notification, schedules a new
   one when reminders are enabled, and returns `TaskNotification | null`
   (`src/hooks/task-form/utils/resolve-task-notification.ts`).
3. `saveTask` calls `addTask` with `{ ...fields, isComplete: false, notification }`
   (`src/hooks/task-form/utils/save-task.ts`).
4. `addTask` assigns `generateId()` when the task has no ID and appends it to
   storage (`src/context/tasks/tasks-context.tsx`).
5. The screen calls `router.back()`.

### Edit

The same form loads the task by ID (`src/hooks/tasks/use-task-by-id.ts`) and
prefills title, description, and the pending reminder. A reminder in the past is
treated as disabled and replaced by the default 15-minute time reminder
(`src/hooks/task-form/task-form-reducer.ts`). Saving merges the fields into the
existing task and replaces its notification.

### Complete / uncomplete

The checkbox calls `updateTask({ ...task, isComplete: !task.isComplete })`
(`src/hooks/tasks/use-task-actions.ts`). Completing a task cancels its pending
notification and stores `notification: null`
(`src/context/tasks/utils/get-notification-to-cancel.ts`,
`src/context/tasks/tasks-context.tsx`). Uncompleting does not reschedule it.
Completed tasks render with muted text and a filled `surface-variant` card.

### Delete

The delete icon calls `removeTask(id)` with no confirmation dialog
(`src/hooks/tasks/use-task-actions.ts`). `removeTask` cancels the pending
notification, then removes the task from storage
(`src/context/tasks/tasks-context.tsx`).

Tasks are global: they are not scoped to the signed-in user. Any account sees
the same `tasks` array. This is a known deviation from multi-user expectations,
not from the assignment.

## 9. Reminder lifecycle

Scheduling lives in `src/context/tasks/utils/notifications.ts`:

| Reminder type | Trigger |
| --- | --- |
| `time` | `TIME_INTERVAL` with `seconds` from the selected preset or custom input |
| `date` | `DATE` with the selected timestamp |

- Android channel `default`, name `Recordatorios`, importance `HIGH`.
- Notification content: title = task title, body = description or
  `Recordatorio de tu tarea`, sound `default`, data `{ taskTitle }`.
- The handler shows banner and list entry, plays sound, and does not set a badge.
- `scheduledAt` is stored as an ISO string.

Permission flow: check current status, request if not granted, and return
`null` when denied. The form then shows an alert (`Permiso denegado`) and still
saves the task without a reminder
(`src/hooks/task-form/utils/resolve-task-notification.ts`,
`src/context/tasks/constants/index.ts`).

Cancellation points:

- Saving an edit, before scheduling the replacement.
- Completing a task.
- Deleting a task.
- The notification arriving: `useClearSentNotification` listens for received
  notifications and clears the matching task notification by ID
  (`src/hooks/tasks/use-clear-sent-notification.ts`).

The task card shows a badge while a notification is pending and the task is
incomplete (`src/components/ui/home/home-task/task-body.tsx`):

- Less than one minute away → `Recordatorio activo`.
- Later today → `Hoy, H:MM`.
- Tomorrow → `Mañana, H:MM`.
- Otherwise → `d mmm, H:MM` in Spanish (`src/utils/date.ts`,
  `src/context/tasks/utils/notification-badge.ts`).

The badge clock ticks every 30 seconds (`src/constants/time.ts`,
`src/hooks/use-current-time.ts`).

Notification delivery is only observable on a real device or development build.
Expo Go cannot prove the plugin behavior.

## 10. Validation and error states

| Form | Rule | Message | Source |
| --- | --- | --- | --- |
| Sign in | Username required | `Ingresá tu usuario` | `src/context/auth/utils/validate-credentials.ts` |
| Sign in | Password required | `Ingresá tu contraseña` | same |
| Sign in | Credentials must match | `Usuario o contraseña incorrectos` | `src/hooks/sign-in/constants/index.ts` |
| Sign up | Username required | `Ingresá tu usuario` | `src/context/auth/utils/validate-credentials.ts` |
| Sign up | Password required | `Ingresá tu contraseña` | same |
| Sign up | Confirmation required | `Confirmá tu contraseña` | `src/hooks/sign-up/constants/index.ts` |
| Sign up | Passwords must match | `Las contraseñas no coinciden` | same |
| Sign up | Username must be free | `Ese usuario ya existe` | same |
| Task | Title required (trimmed) | `El título es obligatorio` | `src/hooks/task-form/constants/index.ts` |
| Task | Time reminder must be > 0 s | `Ingresá un tiempo válido` | same |

Additional states:

- Task form, invalid ID → `No encontramos la tarea.` in the error color
  (`src/components/ui/task-form/task-form.tsx`).
- Edit of a completed task disables the reminder card at 50% opacity
  (`src/components/ui/task-form/reminder-options/index.tsx`).
- Task save button is disabled while the title error is present or the reminder
  is invalid; it shows a spinner while submitting
  (`src/components/ui/task-form/task-form-content.tsx`).
- Auth buttons show a spinner while `isSubmitting`
  (`src/components/ui/sign-in/sign-in-form.tsx`,
  `src/components/ui/sign-up/sign-up-form.tsx`).

## 11. Screens

| Screen | File | Content |
| --- | --- | --- |
| Sign in | `src/app/index.tsx` | Brand title `Tasks`, subtitle, username, password with visibility toggle, submit, link to sign-up |
| Sign up | `src/app/sign-up/index.tsx` | Same shell, username, password, confirmation, submit, link back |
| Home | `src/app/(tabs)/index.tsx` | Header, `Mis tareas`, task list, floating add button |
| Task form | `src/app/(tabs)/task-form/index.tsx` | `Nueva tarea` or `Editar tarea`, fields, reminder card, cancel/save |

Shared layout shells:

- Auth screens use `AuthScreen` with safe-area padding and a centered header
  (`src/components/ui/auth/auth-screen.tsx`).
- The tabs header shows the app icon, `Tasks`, and the user menu
  (`src/components/ui/header/index.tsx`).
- The tab bar has no labels and two icons
  (`src/app/(tabs)/_layout.tsx`).

## 12. Tests

Command: `pnpm test` → `jest`, with the `jest-expo` preset and `@/` alias, both
in `package.json`.

| File | Tests | Covers |
| --- | --- | --- |
| `__tests__/auth-form-reducer-test.ts` | 3 | Field updates, password visibility, error reset |
| `__tests__/form-button-test.tsx` | 3 | Render, press, disabled behavior |
| `__tests__/generate-id-test.ts` | 1 | UUID shape |
| `__tests__/validate-sign-up-form-test.ts` | 3 | Required fields and password mismatch |
| `__tests__/validate-task-form-test.ts` | 3 | Title required, reminder validity |

Total: 5 files, 13 tests. Contexts, AsyncStorage, notifications, and date
helpers have no automated coverage. Manual checks: `.opencode/docs/project-brief.md`
§Manual QA.

## 13. Known gaps and deviations

Recorded, not hidden:

| Item | Current behavior | Owner |
| --- | --- | --- |
| Empty-state copy | English `No tasks found.` while the rest is Spanish | `home-tasks-empty.tsx` |
| Per-user data | Tasks are shared across all local accounts | `tasks-context.tsx` |
| Delete confirmation | None; the icon deletes immediately | `task-actions.tsx` |
| Credentials | Plaintext in AsyncStorage, no hashing | `auth-context.tsx` |
| Notification permission | Task saves without a reminder if permission is denied | `resolve-task-notification.ts` |
| Completed task edit | Reminder controls disabled, so a completed task cannot gain a reminder | `task-form-content.tsx` |
| Past reminder on edit | Silently replaced by the default 15-minute option | `task-form-reducer.ts` |

## 14. Assignment traceability

Requirements live in `.opencode/docs/project-brief.md`. This table points to the
current implementation, not a restatement of the assignment.

| Requirement | Implementation |
| --- | --- |
| Reusable components + StyleSheet | `src/components/ui/form/`, `src/components/ui/home/home-task/` |
| Stack navigation + 4 screens | `src/app/_layout.tsx`, `src/app/`, `src/app/(tabs)/` |
| Local auth + protected routes | `src/context/auth/`, `Stack.Protected` in `src/app/_layout.tsx` |
| AsyncStorage persistence | `src/hooks/use-storage-state.ts`, `src/hooks/use-db.ts` |
| Local notification | `src/context/tasks/utils/notifications.ts`, `app.json` plugin |
| Jest + RNTL | `__tests__/`, `package.json` `jest` block |
