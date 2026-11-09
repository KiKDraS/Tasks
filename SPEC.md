# SPEC — Tasks

Behavior and architecture of the shipped app. §1–14 describe what the code
does, not what it should do. §15 tracks shipped Parcial 2 app features; README
and demo delivery remain target. Every shipped statement cites the file that
implements it.

## 1. Precedence

1. The implementation (`src/`, `app.json`, `package.json`) is authoritative.
2. `.opencode/docs/project-brief.md` records the assignments. Where the
   assignment and the code disagree, the code wins. The Parcial 1 exam was
   already approved; Parcial 2 app features are implemented; README and demo
   delivery remain target.
3. §15 records Parcial 2 status: app features are shipped; README and demo
   delivery remain target. Until an item exists in `src/`, the current code
   wins.
4. Stitch project `Minimalist Reminder Todo App` is a visual reference only. It
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

Parcial 2 status is in §15. App features are shipped; README and demo delivery
are target.

## 3. Stack and runtime

- Expo SDK 57, React Native 0.86.3, React 19.2.3, TypeScript.
- Expo Router 57 for navigation, built on React Navigation.
- `@react-native-async-storage/async-storage` for persistence.
- `expo-notifications` for local reminders.
- `@expo/ui` datetime picker for date reminders.
- `expo-crypto` for task IDs (`generateId` → `randomUUID`).
- `@expo-google-fonts/geist` for the typeface.
- Jest 29 with `jest-expo` and React Native Testing Library.
- Parcial 2 additions (installed): `expo-image-picker`, `expo-location`,
  `expo-contacts`, `expo-calendar`, `expo-file-system`, and `zustand`. See
  §15.1.

Sources: `package.json`, `app.json`, `src/utils/id.ts`, `src/constants/theme.ts`.

## 4. Architecture

Layers, from outside in:

| Layer | Responsibility | Location |
| --- | --- | --- |
| Routes | Screen composition and protected groups | `src/app/` |
| Stores | Global task state, selectors, actions | `src/stores/` |
| Services | AsyncStorage task adapter and device APIs | `src/services/` |
| Context | Auth session only | `src/context/auth/` |
| Hooks | Form state and reusable behavior | `src/hooks/` |
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

Task state lives in `useTasksStore` (`src/stores/tasks/tasks-store.ts`).
`useHydrateTasks` hydrates it when the authenticated tabs mount
(`src/app/(tabs)/_layout.tsx`).

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

Task seeding happens lazily: `readOrSeedTasks` writes `TASKS_DB` only when the
key is missing or empty (`src/services/tasks-storage.ts`). Auth users still seed
through `useDB` (`src/hooks/use-db.ts`). Stored data is never overwritten on
startup. Invalid or non-array JSON parses to an empty array.

Task writes are JSON-stringified arrays. `writeTasks` adds an 800 ms delay
(`src/services/tasks-storage.ts`, `src/constants/time.ts`). Auth user writes
still go through `useDB`. UI loading states rely on this delay.

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

Store: `src/stores/tasks/tasks-store.ts`.

### List

Home reads `tasks` from `useTasksStore` and renders a `FlatList`. The list is
not filtered or sorted; storage order is render order, so new tasks append at
the bottom (`src/components/ui/home/home-tasks-list.tsx`).

When the array is empty, the list renders `No tasks found.`
(`src/components/ui/home/home-tasks-empty.tsx`). This English string is a known
copy inconsistency; the rest of the UI is Spanish.

### Create

1. The form validates the title and shared schedule when needed.
2. `resolveTaskNotification` cancels any previous notification, schedules a new
   one when reminders are enabled, and returns `TaskNotification | null`
   (`src/hooks/task-form/utils/resolve-task-notification.ts`).
3. `saveTask` calls `addTask` with `{ ...fields, isComplete: false, notification }`
   (`src/hooks/task-form/utils/save-task.ts`).
4. `addTask` assigns `generateId()` when the task has no ID and appends it to
   storage (`src/stores/tasks/tasks-store.ts`).
5. The screen calls `router.back()`.

### Edit

The same form loads the task by ID (`src/stores/tasks/selectors.ts`) and
prefills title, description, and the pending reminder. A reminder in the past is
treated as disabled and replaced by the default 15-minute time reminder
(`src/hooks/task-form/task-form-reducer.ts`). Saving merges the fields into the
existing task and replaces its notification.

### Complete / uncomplete

The checkbox calls `toggleComplete(task.id)`
(`src/hooks/tasks/use-task-actions.ts`). The store action flips `isComplete`;
completing cancels its pending notification and stores `notification: null`
(`src/stores/tasks/tasks-store.ts`,
`src/context/tasks/utils/get-notification-to-cancel.ts`). Uncompleting does not
reschedule it.
Completed tasks render with muted text and a filled `surface-variant` card.

### Delete

The delete icon calls `removeTask(id)` with no confirmation dialog
(`src/hooks/tasks/use-task-actions.ts`). `removeTask` cancels the pending
notification, then removes the task from storage
(`src/stores/tasks/tasks-store.ts`).

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

Expiry:

- `hydrate` clears every notification whose `scheduledAt <= now`; it writes only
  when something changed (`src/stores/tasks/tasks-store.ts`).
- The Home clock tick calls `clearExpiredNotifications(now)`, so the reminder
  becomes unset while the app is open
  (`src/components/ui/home/home-tasks-list.tsx`).
- A null `notification` means the reminder is unset and the badge disappears.
- The calendar event is preserved when the notification expires. It is deleted
  only when the user explicitly turns the reminder off.

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
| Home | `src/app/(tabs)/index.tsx` | Header, `Mis tareas`, task list with photo count and attachment meta, floating add button |
| Task form | `src/app/(tabs)/task-form/index.tsx` | `Nueva tarea` or `Editar tarea`, fields, photo/location/contact cards, combined schedule card, cancel/save |

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
| `__tests__/form-button-test.tsx` | 5 | Render, press, disabled, role, busy state |
| `__tests__/generate-id-test.ts` | 1 | UUID shape |
| `__tests__/validate-sign-up-form-test.ts` | 3 | Required fields and password mismatch |
| `__tests__/validate-task-form-test.ts` | 4 | Title required, schedule validity |
| `__tests__/tasks-storage-test.ts` | 9 | Parse, seed, and write task storage |
| `__tests__/tasks-store-test.ts` | 18 | Hydrate, expiry, failure, concurrency, add, update, remove, cleanup, toggle |
| `__tests__/permission-state-test.ts` | 4 | Granted, denied, blocked, undetermined |
| `__tests__/reminder-date-test.ts` | 2 | Date identity, time offset |
| `__tests__/media-service-test.ts` | 10 | Multi-pick, denied, cancelled, copy, errors, delete |
| `__tests__/location-service-test.ts` | 5 | Denied, address, geocode fallback, error |
| `__tests__/contacts-service-test.ts` | 5 | Denied, cancel, phone selection, error |
| `__tests__/calendar-service-test.ts` | 11 | Permission, fallback, create, delete, request |
| `__tests__/reminder-notifications-test.ts` | 3 | DATE/TIME triggers, denied permission |
| `__tests__/task-form-attachments-test.ts` | 33 | Multi-photo, legacy prefill, reducer, fields, cleanup, toggle intent, expiry |
| `__tests__/permission-notice-test.tsx` | 6 | Denied/blocked/error and hidden states |
| `__tests__/photo-card-test.tsx` | 7 | Empty, multiple, per-photo remove, pending, denied |
| `__tests__/location-card-test.tsx` | 5 | Empty, address, coords, pending, remove |
| `__tests__/calendar-event-test.ts` | 3 | Date/time/disabled start and end |
| `__tests__/contact-card-test.tsx` | 3 | Empty, filled, denied |
| `__tests__/schedule-card-test.tsx` | 16 | Reminder switch, calendar states, hints, notice, disabled, completed |
| `__tests__/resolve-calendar-attachment-test.ts` | 6 | Disabled, preserve, remove, create, denial, error |
| `__tests__/use-task-form-calendar-test.ts` | 7 | Reminder on/off, failure save, cleanup, completed, alert order |
| `__tests__/task-form-content-test.tsx` | 5 | Reminder toggle, permission retry, disabled |
| `__tests__/use-schedule-permission-test.ts` | 4 | Granted, denied, blocked, error |
| `__tests__/clear-expired-notifications-test.ts` | 2 | Past cleared, future untouched |
| `__tests__/task-mutation-queue-test.ts` | 2 | Serial order, best-effort write |
| `__tests__/option-chip-test.tsx` | 3 | Role, selected state, press |
| `__tests__/reminder-options-test.tsx` | 2 | Disabled subtree hidden, enabled accessible |
| `__tests__/use-photo-attachment-test.ts` | 4 | Camera, gallery, retry, remove |
| `__tests__/use-task-form-photo-cleanup-test.ts` | 2 | Cleanup after save, failure |
| `__tests__/task-attachments-test.tsx` | 8 | Photo count, location, contact, calendar, completed |
| `__tests__/format-contact-label-test.ts` | 2 | Name only, name + phone |

Total: 33 files, 203 tests. Auth context has no automated coverage. Manual checks: `.opencode/docs/project-brief.md`
§Manual QA.

Counts above describe the current suite. Remaining Parcial 2 target test
additions are in §15.6.

## 13. Known gaps and deviations

Recorded, not hidden:

| Item | Current behavior | Owner |
| --- | --- | --- |
| Empty-state copy | English `No tasks found.` while the rest is Spanish | `home-tasks-empty.tsx` |
| Per-user data | Tasks are shared across all local accounts | `tasks-store.ts` |
| Delete confirmation | None; the icon deletes immediately | `task-actions.tsx` |
| Credentials | Plaintext in AsyncStorage, no hashing | `auth-context.tsx` |
| Notification permission | Task saves without a reminder if permission is denied | `resolve-task-notification.ts` |
| Completed task edit | Reminder controls disabled, so a completed task cannot gain a reminder | `task-form-content.tsx` |
| Past reminder on edit | Silently replaced by the default 15-minute option | `task-form-reducer.ts` |

## 14. Parcial 1 assignment traceability

Requirements live in `.opencode/docs/project-brief.md`. This table points to the
current Parcial 1 implementation, not a restatement of the assignment.

| Requirement | Implementation |
| --- | --- |
| Reusable components + StyleSheet | `src/components/ui/form/`, `src/components/ui/home/home-task/` |
| Stack navigation + 4 screens | `src/app/_layout.tsx`, `src/app/`, `src/app/(tabs)/` |
| Local auth + protected routes | `src/context/auth/`, `Stack.Protected` in `src/app/_layout.tsx` |
| AsyncStorage persistence | `src/services/tasks-storage.ts`, `src/hooks/use-storage-state.ts`, `src/hooks/use-db.ts` |
| Local notification | `src/context/tasks/utils/notifications.ts`, `app.json` plugin |
| Jest + RNTL | `__tests__/`, `package.json` `jest` block |

Parcial 2 traceability is in §15.7. Rows marked ✅ are shipped; ⬜ rows are targets.

## 15. Parcial 2 status

Status: all Parcial 2 app features are shipped; README and demo delivery remain
target. `(target)` marks files that do not exist yet. Implementation status is
tracked in the project-brief §Parcial 2 acceptance checklist; scoring stays
separate.

### 15.1 Stack additions

| Package | Use | Status |
| --- | --- | --- |
| `expo-image-picker` | Camera and gallery selection | installed |
| `expo-location` | Foreground location and reverse geocoding | installed |
| `expo-contacts` | Contact picker | installed |
| `expo-calendar` | Device calendar event | installed |
| `expo-file-system` | Copy the picked image into app storage | installed |
| `zustand` | Global task state | installed |

SDK 57 notes:

- Import `expo-contacts/legacy` for `requestPermissionsAsync` and
  `presentContactPickerAsync`. The top-level SDK 57 methods are deprecated and
  throw at runtime.
- Import `expo-calendar/legacy` for `requestCalendarPermissionsAsync`,
  `getDefaultCalendarAsync`, `createEventAsync`, and `deleteEventAsync`. The
  top-level SDK 57 methods are deprecated and throw at runtime.
- `expo-image-picker` covers both `launchCameraAsync` and
  `launchImageLibraryAsync`; no `expo-camera` dependency is needed.

`app.json` target config:

- `expo-image-picker` plugin: `photosPermission`, `cameraPermission`,
  `microphonePermission: false`.
- `expo-location` plugin: `locationWhenInUsePermission`.
- `expo-contacts` plugin: `contactsPermission`; Android `READ_CONTACTS`, with
  `WRITE_CONTACTS` blocked.
- `expo-calendar` plugin: `calendarPermission`; Android `READ_CALENDAR` and
  `WRITE_CALENDAR`.
- Add the plugins to `expo.plugins`; never edit generated `ios/` or `android/`.

### 15.2 Permission model

Every device action runs the same sequence: read the current status, request
when needed, run the action only when granted, and report the result to the
form.

| Resource | Request API | UI action |
| --- | --- | --- |
| Camera | `ImagePicker.requestCameraPermissionsAsync()` | Take photo |
| Gallery | `ImagePicker.requestMediaLibraryPermissionsAsync()` | Choose from gallery |
| Location | `Location.requestForegroundPermissionsAsync()` | Use my location |
| Contacts | `Contacts.requestPermissionsAsync()` from `expo-contacts/legacy` | Choose contact |
| Calendar | `Calendar.requestCalendarPermissionsAsync()` from `expo-calendar/legacy` | Create calendar event |

Target UI states:

| State | Trigger | UI |
| --- | --- | --- |
| `idle` | No request yet | Action enabled |
| `pending` | Request or device call in flight | Action disabled, spinner |
| `granted` | `status === "granted"` | Action enabled; show attached value |
| `denied` | `status === "denied"` and `canAskAgain` | Inline message, retry allowed |
| `blocked` | `status === "denied"` and `!canAskAgain` | Inline message + `Abrir ajustes` (`Linking.openSettings()`) |
| `error` | Device call throws | Inline message, retry allowed |

The form keeps one state per resource. Photo, location, and contact denials
save the task without that attachment. When the reminder is on, calendar
permission denial or event failure skips the calendar event but still saves the
task and schedules the app notification. The user sees an inline notice and a
post-save alert.

Target files: `src/services/permissions.ts` (shared result types),
`src/utils/permission-state.ts` (pure status mapping),
`src/components/ui/permissions/permission-notice.tsx`.

### 15.3 Extended task model

The current `Task` stays backward compatible. New fields are optional and
nullable; old stored tasks load with `null` defaults.

```ts
type TaskLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

type TaskContact = {
  id: string;
  name: string;
  phoneNumber?: string;
};

type Task = {
  id?: string;
  title: string;
  description: string;
  isComplete?: boolean;
  notification: TaskNotification | null;
  photoUris?: string[];
  photoUri?: string | null; // legacy single-photo field
  location?: TaskLocation | null;
  contact?: TaskContact | null;
  calendarEventId?: string | null;
};
```

- `photoUris` points to files copied into the app document directory, not the
  picker cache URIs. Legacy `photoUri` is read as a one-item array and cleared on
  save. Removing, replacing, or deleting a task best-effort deletes files no
  longer referenced.
- `location.address` is best effort from `Location.reverseGeocodeAsync`; the
  coordinates are always stored.
- `contact` stores only the ID, display name, and first phone number.
- `calendarEventId` is the device event ID returned by
  `Calendar.createEventAsync`; the event is not duplicated in AsyncStorage.
- The storage key stays `tasks` with the same bare-array JSON format. No
  migration is required.

Current type: `src/context/tasks/types/Task.ts`. Target move:
`src/stores/tasks/types.ts`. Storage: `src/services/tasks-storage.ts`.

### 15.4 Architecture

Layers after the migration:

| Layer | Responsibility | Location |
| --- | --- | --- |
| Routes | Screen composition and protected groups | `src/app/` |
| Stores | Global task state, selectors, actions | `src/stores/` |
| Services | AsyncStorage task adapter and device APIs | `src/services/` |
| Context | Auth session only | `src/context/auth/` |
| Hooks | Form state and reusable behavior | `src/hooks/` |
| Components | Presentational UI | `src/components/` |
| Constants and utils | Tokens, keys, pure helpers | `src/constants/`, `src/utils/` |

Task store (`src/stores/tasks/tasks-store.ts`, shipped):

```ts
type TasksState = {
  tasks: Task[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  clearSentNotification: (notificationId: string) => Promise<void>;
  clearExpiredNotifications: (now?: Date) => Promise<void>;
};
```

- `hydrate` reads `tasks` through `src/services/tasks-storage.ts`, writes the
  seed when the key is missing or empty, and sets `isLoading`.
- Actions write storage first, then update the store. The existing notification
  cancellation rules stay in the action.
- Components use `useTasksStore` selectors. `useTaskById` becomes a selector.
- The authenticated tab layout calls `useHydrateTasks`
  (`src/hooks/tasks/use-hydrate-tasks.ts`) and mounts the notification listener
  (`src/app/(tabs)/_layout.tsx`).
- `useDB` is no longer used by tasks. Auth still uses it for users alongside
  `useStorageState`.
- The store does not use `persist`; storage stays in the existing adapter to
  preserve the `tasks` key, seed behavior, and the 800 ms simulated delay.
- No prop drilling: `HomeTasksList` and `TaskFormContent` read the store
  directly. `TaskHeader` and `TaskBody` still receive props from `HomeTask`.

Device results use one shape:

```ts
type DeviceResult<T> =
  | { status: "granted"; value: T }
  | { status: "cancelled" }
  | { status: "denied"; canAskAgain: boolean }
  | { status: "error"; message: string };
```

Device services (shipped):

| File | Contract |
| --- | --- |
| `src/services/media.ts` | `takePhoto()` returns `DeviceResult<{ uri: string }>`; `pickPhotos()` returns `DeviceResult<{ uris: string[] }>`; copy each asset into `task-photos` |
| `src/services/location.ts` | `getCurrentLocation()` returns `DeviceResult<TaskLocation>`; request foreground permission, get position, reverse geocode with coordinate fallback |
| `src/services/contacts.ts` | `pickContact()` returns `DeviceResult<TaskContact>`; request permission, open the native picker, keep first phone |
| `src/services/calendar.ts` | `requestCalendarPermission()` returns `DeviceResult<true>`; `createTaskEvent(event)` returns `DeviceResult<{ eventId: string }>`; `deleteTaskEvent(id): Promise<void>`; default/first writable calendar |
| `src/services/permissions.ts` | `DeviceResult<T>`, `PermissionLike`, `isPermissionGranted`, `openAppSettings` |
| `src/utils/reminder-date.ts` | Shared `getReminderDate` for notifications and calendar starts |

### 15.5 Target task flows

Create:

1. The form validates the title and shared schedule when the reminder is on.
2. Photo, location, and contact are wired in the form. Gallery can append
   multiple photos; camera adds one per capture. The reminder switch uses one
   shared date/time selection for both the app notification and the calendar
   event. Enabling the reminder requests calendar permission.
3. `resolveTaskNotification` runs when the reminder is on.
4. When the reminder is on, create the device event from the shared schedule.
   Event end is one hour after start. Title = task title, notes = description,
   location = address. Use `getDefaultCalendarAsync`; if it fails, use the first
   writable event calendar.
5. `addTask` writes the extended task. Calendar permission denial or event
   failure skips the event but still saves the task and schedules the
   notification; the user sees the notice and a post-save alert.
6. `router.back()` runs as today.

Edit:

1. The form prefills the attachments from the task.
2. Changing or removing an attachment updates the form state only; storage is
   written on save.
3. The calendar event is created on first save. Editing the title or reminder
   does not update an existing device event; this is a known target gap.
4. Saving merges the extended fields and replaces the notification as today.

Complete / delete:

- Completing a task cancels the notification as today. Attachments stay.
- Deleting a task cancels the notification, removes the task, then best-effort
  deletes all photo files and the calendar event.
- Deleting a task with a denied calendar permission still removes the task; the
  event cleanup is skipped.

Permission denial messages are listed in §15.8.

### 15.6 Tests

All Parcial 2 target tests are shipped; keep the 203 current tests. Mock
`expo-image-picker`, `expo-location`, `expo-contacts/legacy`,
`expo-calendar/legacy`, `expo-file-system`, and AsyncStorage. Run `pnpm test`.

### 15.7 Target traceability

| Parcial 2 requirement | Target evidence | Status |
| --- | --- | --- |
| Permission states and denied message | `src/services/permissions.ts`, `src/utils/permission-state.ts`, `src/components/ui/permissions/permission-notice.tsx` | ✅ implemented |
| Camera / gallery photo | `src/services/media.ts`, `src/components/ui/task-form/photo-card.tsx`, `src/components/ui/home/home-task/task-attachments.tsx`; form is the detail view; list shows count, not image | ✅ implemented |
| GPS location | `src/services/location.ts`, `src/components/ui/task-form/location-card.tsx`, `src/components/ui/home/home-task/task-attachments.tsx` | ✅ implemented |
| Contact | `src/services/contacts.ts`, `src/components/ui/task-form/contact-card.tsx` | ✅ implemented |
| Calendar event | `src/services/calendar.ts`, `src/components/ui/task-form/schedule-card.tsx` | ✅ implemented |
| Zustand global state | `src/stores/tasks/`, `src/hooks/tasks/use-hydrate-tasks.ts` | ✅ implemented |
| Tests | `__tests__/` additions | ✅ implemented |
| README + demo | `README.md` | ⬜ pending |

All Parcial 2 app features, tests, and cleanup are shipped; README and demo
delivery remain pending. Implementation status is tracked in the project-brief
§Parcial 2 acceptance checklist. ⬜ = pending implementation; ✅ = implemented.
Scoring stays separate.

### 15.8 Target copy

| Context | String |
| --- | --- |
| Schedule title | `Recordatorio` |
| Photo card title | `Fotos` |
| Photo empty | `Sin fotos` |
| Photo actions | `Tomar foto`, `Elegir de galería` |
| Photo remove | `Quitar foto N` |
| Photo count | `1 foto`, `N fotos` |
| Photo loading | `Cargando fotos` |
| Location empty | `Sin ubicación` |
| Location action | `Usar mi ubicación` |
| Location loading | `Obteniendo ubicación...` |
| Location remove | `Quitar ubicación` |
| Contact empty | `Sin contacto` |
| Contact remove | `Quitar contacto` |
| Contact action | `Elegir contacto` |
| Calendar helper | `Se agregará al calendario al guardar` |
| Calendar created | `Evento agregado` |
| Calendar pending | `Verificando permiso...` |
| Calendar not added | `No se agregará al calendario` |
| Calendar alert title | `No se agregó al calendario` |
| Calendar alert message (notification) | `La tarea se guardó con notificación, pero sin evento en el calendario.` |
| Calendar alert message (no notification) | `La tarea se guardó sin evento en el calendario.` |
| Calendar will remove | `Se quitará al guardar` |
| Calendar idle | `Se pedirá permiso al guardar` |
| Reminder + calendar hint | `La notificación se enviará y el evento se agregará al calendario {label}` |
| Reminder-only hint | `La notificación se enviará {label}` |
| Permission denied (retry) | `Permiso denegado. Podés volver a intentarlo.` |
| Retry action | `Reintentar` |
| Permission blocked | `Permiso denegado. Habilitalo en Ajustes.` |
| Settings action | `Abrir ajustes` |
| Media error | `No pudimos usar la cámara o la galería. Intentá de nuevo.` |
| Location error | `No pudimos obtener tu ubicación. Intentá de nuevo.` |
| Contacts error | `No pudimos acceder a tus contactos. Intentá de nuevo.` |
| Calendar error | `No pudimos acceder a tu calendario. Intentá de nuevo.` |
| Calendar missing | `No encontramos un calendario editable. Creá uno en tu calendario e intentá de nuevo.` |

Copy rules: Spanish rioplatense, `vos`, sentence case, no terminal period.
