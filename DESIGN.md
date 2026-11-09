# DESIGN — Tasks

Visual system for the shipped app. §1–11 cover tokens, components, layout, and
visual states only; §12 is the Parcial 2 target. Behavior lives in `SPEC.md`.

## 1. Precedence

1. `src/constants/theme.ts` and the component styles are authoritative.
2. Stitch project `Minimalist Reminder Todo App` supplied the visual direction.
   Where Stitch and the code disagree, the code wins. The conflict table is in
   §10.
3. `README.md` and the app UI are Spanish; this document is English.
4. §12 tracks Parcial 2 UI status: all form and list attachment UI is shipped.
   Implementation status is tracked in the project-brief §Parcial 2 acceptance
   checklist; scoring stays separate. Where §12 and the code disagree, the code
   wins until the feature lands.

## 2. Design intent

- Calm, monochrome surface with a near-black navy ink (`#091426`).
- One cool accent family (`secondary` / `secondary-container`) for selection.
- Generous spacing, flat filled inputs, no outlines.
- Small radii: cards and inputs are subtly rounded, chips are pills.
- Typeface is Geist at every level, with weight and size carrying hierarchy.
- No gradients, illustration, or decorative color. The only warm signal is the
  error red.

## 3. Color tokens

Defined in `src/constants/theme.ts` (`Colors`). Role names follow Material 3.

| Token | Hex | Used for |
| --- | --- | --- |
| `surface` | `#f7f9fb` | App background, cards, header, tab bar, splash |
| `surface-container` | `#eceef0` | Home list background, reminder card |
| `surface-variant` | `#e2e4e6` | Inputs, incomplete checkbox, chips, completed card |
| `on-surface` | `#191c1e` | Primary text, icons on light surfaces |
| `on-surface-variant` | `#6e7073` | Secondary text, labels, placeholders, edit icon |
| `primary` | `#091426` | Navigation tint, default icon color, notification accent |
| `on-primary` | `#ffffff` | Text and icons on primary fills |
| `primary-container` | `#1e293b` | Primary buttons, FAB, user badge |
| `on-primary-container` | `#8590a6` | Shadow color token only |
| `secondary` | `#505f76` | Auth subtitle, active tab tint, switch thumb |
| `secondary-container` | `#d0e1fb` | Selected chip, reminder badge, switch track |
| `on-secondary-container` | `#54647a` | Selected chip label |
| `error` | `#ba1a1a` | Error text, delete icon, navigation notification |

Rules of thumb:

- Text on `surface` is `on-surface`; secondary text is `on-surface-variant`.
- Selected controls use `secondary-container` plus `on-secondary-container`.
- Destructive affordances are the only place `error` appears.
- Completed tasks switch from `surface` to `surface-variant` and their text to
  `secondary` with a line-through
  (`src/components/ui/home/home-task/task-text-styles.ts`).

Navigation theme (`NavigationTheme`): light mode, primary `#091426`, background
`#f7f9fb`, card `#eceef0`, text `#191c1e`, border `#eceef0`, notification
`#ba1a1a`. The app does not switch to dark mode even when the OS does.

## 4. Typography

Font: Geist, loaded via the `expo-font` plugin in `app.json` with weights 400,
500, 600, and 700. Platform family names are mapped in `Fonts`.

| Token | Size | Line height | Weight | Tracking | Typical use |
| --- | --- | --- | --- | --- | --- |
| `display` | 36 | 44 | 600 | -0.72 | Screen titles (`Tasks`, `Mis tareas`, `Nueva tarea`) |
| `headline-lg` | 28 | 36 | 600 | -0.56 | Reserved, not used by a screen |
| `headline-md` | 22 | 28 | 600 | -0.33 | Card title, header brand, auth subtitle (weight overridden to 400) |
| `body-lg` | 16 | 24 | 400 | 0 | Text input value |
| `body-md` | 14 | 20 | 400 | 0 | Task description, auth helper text |
| `body-sm` | 13 | 18 | 400 | 0 | Reserved |
| `label-md` | 13 | 16 | 500 | 0.13 | Buttons, field labels, chip labels, badge |
| `label-sm` | 11 | 14 | 500 | 0.22 | Errors, hints, reminder badge text |

`ThemedText` defaults to `body-md` and color `primary`
(`src/components/themed-text.tsx`). `headline-lg`, `body-sm` are defined but
currently unused.

## 5. Spacing, radius, shadow

Spacing (`Spacing`):

| Token | Value | Use |
| --- | --- | --- |
| `space-xs` | 4 | Badge padding, tight gaps |
| `space-sm` | 8 | Label-to-input, chip gaps |
| `space-md` | 12 | Button padding block, row gaps |
| `gutter` | 16 | Screen and card padding |
| `space-lg` | 20 | Section gaps, card internal gap |
| `margin` | 20 | Content top offset |
| `space-xl` | 32 | Reserved |

Radius (`Rounded`):

| Token | Value | Use |
| --- | --- | --- |
| `sm` | 2 | Reserved |
| `DEFAULT` | 4 | Reserved |
| `md` | 6 | Inputs, cards, badges |
| `lg` | 8 | Buttons, reminder card, user badge |
| `xl` | 12 | Reserved |
| `full` | 9999 | Chips, FAB |

Shadow (`setShadow`): offset `{ width: 0, height: 2 }`, opacity `0.25`, radius
`3.84`, color token `on-primary-container` (`#8590a6`). Used on the header, tab
bar, task cards, primary buttons, and FAB. Completed cards remove the shadow and
add a 1 px `surface-variant` border instead.

Fixed dimensions found in the code:

| Element | Size |
| --- | --- |
| Header content height | 56 |
| Header logo | 32 |
| User badge | 36, radius 8 |
| Tab icon | 42 |
| Tab bar height | 48 total, with 16 top and `insets.bottom + 24` bottom padding |
| Task checkbox | 24 |
| Task action icons | 22 |
| FAB | 42, offset 24 from right and bottom |
| Reminder icon | 20 |
| Badge reminder icon | 11 |
| Multiline input minimum height | 96 |
| Auth vertical padding | 24 plus safe-area insets |

## 6. Component inventory

Reusable primitives:

| Component | File | Notes |
| --- | --- | --- |
| `ThemedText` | `src/components/themed-text.tsx` | Type + color props |
| `ThemedView` | `src/components/themed-view.tsx` | `surface` background, `flex: 1` |
| `AppTouchableOpacity` | `src/components/ui/app-touchable-opacity.tsx` | Default `activeOpacity` 0.85 |
| `FormButton` | `src/components/ui/form/form-button.tsx` | `primary` / `surface`; disabled and loading at 50% opacity |
| `TextField` | `src/components/ui/form/text-field.tsx` | Label above, filled input, optional trailing slot and error |
| `OptionChip` | `src/components/ui/task-form/reminder-options/option-chip.tsx` | Pill, selected uses `secondary-container` |
| `TaskCheckbox` | `src/components/ui/home/home-task/task-checkbox.tsx` | Empty square or app icon when complete |
| `HomeBadge` | `src/components/ui/home/home-badge.tsx` | Pill-ish badge, radius 6, `secondary-container` |

Auth:

| Component | File | Notes |
| --- | --- | --- |
| `AuthScreen` | `src/components/ui/auth/auth-screen.tsx` | Full-height shell, centered display title, subtitle, flex content, footer |
| `AuthRedirect` | `src/components/ui/auth/auth-redirect.tsx` | Centered row, bold link |
| `PasswordVisibilityToggle` | `src/components/ui/auth/password-visibility-toggle.tsx` | Eye icon, labeled for screen readers |
| `SignInForm` | `src/components/ui/sign-in/sign-in-form.tsx` | Two fields plus submit |
| `SignUpForm` | `src/components/ui/sign-up/sign-up-form.tsx` | Three fields plus submit |

Task list:

| Component | File | Notes |
| --- | --- | --- |
| `HomeTasksList` | `src/components/ui/home/home-tasks-list.tsx` | `Mis tareas` title, `FlatList`, 16 gap |
| `HomeTask` | `src/components/ui/home/home-task/index.tsx` | Composes card, header, body |
| `TaskCard` | `src/components/ui/home/home-task/task-card.tsx` | Radius 6, padding 16, gap 20, shadow |
| `TaskHeader` | `src/components/ui/home/home-task/task-header.tsx` | Checkbox, title, actions |
| `TaskBody` | `src/components/ui/home/home-task/task-body.tsx` | Description and optional reminder badge |
| `TaskActions` | `src/components/ui/home/home-task/task-actions.tsx` | Edit and delete icons, 12 gap |
| `HomeTasksEmpty` | `src/components/ui/home/home-tasks-empty.tsx` | Single line, default body style |
| `HomeAddButton` | `src/components/ui/home/home-add-button.tsx` | Floating round button |

Task form:

| Component | File | Notes |
| --- | --- | --- |
| `TaskForm` | `src/components/ui/task-form/task-form.tsx` | Loading spinner or not-found message, then content |
| `TaskFormContent` | `src/components/ui/task-form/task-form-content.tsx` | Two fields, reminder card, cancel/save row |
| `ReminderCard` | `src/components/ui/task-form/reminder-card.tsx` | `surface-container`, radius 8, padding 16 |
| `ReminderOptions` | `src/components/ui/task-form/reminder-options/index.tsx` | Header plus mode-dependent body |
| `ReminderHeader` | `.../reminder-header.tsx` | Bell icon, `Recordatorio`, native switch |
| `ReminderModeSelector` | `.../reminder-mode-selector.tsx` | `Tiempo` / `Fecha y hora` chips |
| `ReminderTimeOptions` | `.../reminder-time-options.tsx` | Preset chips and custom time |
| `ReminderCustomTime` | `.../reminder-custom-time.tsx` | Hours, minutes, seconds fields |
| `ReminderDateOptions` | `.../reminder-date-options.tsx` | Date and time picker fields |
| `ReminderPickerField` | `.../reminder-picker-field.tsx` | Filled field showing the formatted value |
| `ReminderOptions` disabled | same | 50% opacity, no pointer events |

Chrome:

| Component | File | Notes |
| --- | --- | --- |
| `Header` | `src/components/ui/header/index.tsx` | 56 px row, logo + `Tasks`, user menu |
| `UserMenu` | `src/components/ui/header/user-menu.tsx` | Native menu, account row disabled, destructive sign-out |
| `SplashScreenController` | `src/components/splash-screen-controller.tsx` | Splash is `#f7f9fb` with a 76 px icon |

Parcial 2 components are listed in §12.2; all form and list attachment components are shipped.

## 7. Screen layouts

### Sign in (`src/app/index.tsx`)

```text
safe area
16 padding
  Tasks                     display, centered, 36
  Ingresar a tu lista...     headline-md, centered, secondary, weight 400
  20 top gap
  Usuario                    label-md + filled input
  Contraseña                 label-md + filled input + eye toggle
  [ Ingresar ]               primary button, full width
  ¿No tenés cuenta? Registrate   centered body-md row
```

The content block is `flex: 1`, so the footer sits at the bottom of the safe
area. The form fields stack with 16 gap.

### Sign up (`src/app/sign-up/index.tsx`)

Same shell with subtitle `Creá tu cuenta`, three fields, and the footer
`¿Ya tenés cuenta? Iniciá sesión`.

### Home (`src/app/(tabs)/index.tsx`)

```text
Header                       logo 32 + Tasks + user badge 36
surface-container background
16 padding
  Mis tareas                 display
  20 gap
  FlatList, 16 gap
    TaskCard
      [checkbox] Title [edit] [delete]
      description
      reminder badge (optional)
  FAB 42, bottom-right 24
```

The tab bar sits below the list with a 16 px top pad and a large bottom pad
(`insets.bottom + 24`). Labels are hidden; only icons show, tinted `secondary`
when active.

### Task form (`src/app/(tabs)/task-form/index.tsx`)

```text
ScrollView, 16 padding
  Nueva tarea / Editar tarea       display
  Completá los datos...            body-md, on-surface-variant
  16 gap
  Título                           label + input
  Descripción                      label + multiline input (min 96)
  ReminderCard
    [bell] Recordatorio   [switch]
    Tiempo | Fecha y hora          two equal chips
    15m 30m 1h 2h                  wrap chips
    Personalizado
      Horas | Minutos | Segundos   three equal fields
    hint line
  [ Cancelar ] [ Crear tarea ]     equal-width row, 12 gap
```

The edit variant changes the title, subtitle, and primary button to
`Editar tarea`, `Modificá los datos de tu tarea`, and `Actualizar tarea`.

## 8. Visual states

| State | Treatment |
| --- | --- |
| Field error | `label-sm` error text directly below the input; input keeps its normal fill |
| Form-level auth error | `label-sm` error line above the submit button |
| Submit loading | `ActivityIndicator` replaces the label; button at 50% opacity |
| Button disabled | 50% opacity, no press |
| Chip selected | `secondary-container` fill, `on-secondary-container` label |
| Chip unselected | `surface-variant` fill, `on-surface-variant` label |
| Task complete | `surface-variant` fill, 1 px border, no shadow, title and body `secondary` + line-through |
| Reminder sent | Badge disappears once `scheduledAt` is in the past |
| Reminder imminent | Badge reads `Recordatorio activo` under one minute |
| Empty list | `No tasks found.` in default body style, top-left of the list area |
| Task not found | `No encontramos la tarea.` in `error` |
| Reminder disabled on completed task | Card at 50% opacity, not interactive |
| Task form loading (edit) | Inline `ActivityIndicator` in `primary` |

There is no skeleton, toast, pull-to-refresh, or offline banner.

## 9. Iconography and copy

Icons use `expo-symbols`, which maps SF Symbols on iOS and Material Symbols on
Android (`src/components/icons/base/BaseIcon.tsx`). Default size is 32, default
color `primary`.

| Component | iOS | Android | Size in UI |
| --- | --- | --- | --- |
| `AddIcon` | `plus.circle` | `add_circle` | 42 (FAB) |
| `DeleteIcon` | `trash` | `delete` | 22 |
| `EditIcon` | `pencil` | `edit` | 22 |
| `HidePasswordIcon` | `eye.slash` | `visibility_off` | 20 |
| `ShowPasswordIcon` | `eye` | `visibility` | 20 |
| `HomeIcon` | `house` | `home` | 42 (tab) |
| `ReminderIcon` | `bell` | `notifications` | 20 |
| `ReminderNotificationIcon` | `bell.and.waveform` | `notifications_active` | 11 |
| `SchedulingIcon` | `calendar` | `calendar_month` | 42 (tab) |
| `UserIcon` | `person` | `person` | 24 |

Parcial 2 target icons are listed in §12.5.

The app mark is `assets/images/icon.png`, rendered through `AppIcon`
(`src/components/icons/AppIcon.tsx`). The splash uses the same image at 76 px on
`#f7f9fb`.

Copy rules:

- Spanish, informal `vos`: `Ingresá`, `Creá`, `Completá`, `Modificá`.
- Sentence case. No terminal period on buttons, labels, or titles.
- Buttons are actions: `Ingresar`, `Crear cuenta`, `Cancelar`, `Crear tarea`,
  `Actualizar tarea`.
- Errors state what to do or what happened, never a code.
- Placeholders are examples: `Ana`, `****`, `Ej: Comprar leche`,
  `Detalles de la tarea`.

Exact strings live in the components and in `SPEC.md` §10. Known English
leftovers: `No tasks found.` (`home-tasks-empty.tsx`) and the hidden tab titles
`Home` / `Create Task` (`src/app/(tabs)/_layout.tsx`). Full checklist:
`.opencode/skills/ux-writing/SKILL.md`; Spanish patterns:
`.opencode/skills/ux-writing/references/spanish-rioplatense.md`.

## 10. Stitch reference and conflicts

Project: `Minimalist Reminder Todo App` (9 screens, 780 px mobile frames, plus a
checkmark logo). The shared Tailwind config matches the code's palette and
spacing almost exactly.

Adopted from Stitch:

- Geist as the only family, with the same display / headline / body / label
  hierarchy.
- `#091426` primary, `#f7f9fb` surface, `#505f76` secondary, `#ba1a1a` error.
- 16 px gutter, 20 px margin, 4/8/12/20/32 spacing, 20 px card gap.
- Filled inputs, chip selectors, floating add button, reminder badge, 56 px
  header, two-icon tab bar.
- Calm, borderless card treatment with a soft shadow.

Rejected or overridden by the implementation:

| Topic | Stitch | Implementation (wins) |
| --- | --- | --- |
| `on-surface-variant` | `#45474c` | `#6e7073` |
| `surface-variant` | `#e0e3e5` | `#e2e4e6` |
| Radius scale | `DEFAULT 2`, `lg 4`, `xl 8`, `full 12` | `sm 2`, `DEFAULT 4`, `md 6`, `lg 8`, `xl 12`, `full 9999` |
| `headline-sm` | 18/24/600 | Not defined; `headline-md` 22/28/600 is used instead |
| Login identity | Student email + `Forgot?` | Username + password, no recovery |
| Registration | Full name, email, terms | Username, password, confirmation |
| Home sidebar | `Today's Tasks`, `All Tasks`, course counts | Single `Mis tareas` list |
| Task metadata | Course tag, priority, drag handle, due date | Title, description, optional reminder badge |
| Delete | Confirmation modal | Immediate delete, no modal |
| Bottom navigation | 4 text destinations | 2 icon-only tabs |
| Reminder sheet | Bottom sheet with presets and notification preview | Inline card in the form, presets + custom time or native date/time picker |
| Notification preview | Separate screen | No preview screen; hint line under the reminder card |
| Logo | Checkmark glyph | App icon PNG |

Stitch used Material Symbols on the web. The app keeps the same metaphors but
renders native symbols per platform, so shapes differ slightly.

## 11. Accessibility notes

Checklist: `.opencode/skills/accessibility-mobile/SKILL.md`.

Present:

- Password toggle exposes `Mostrar contraseña` / `Ocultar contraseña`.
- User menu exposes `Menú de usuario`.
- Body text uses the platform font scale (`allowFontScaling` defaults to true).
  Fixed-height chrome (header, tab bar, FAB) can clip at large accessibility
  sizes.

Gaps in the current build:

- Icon-only edit, delete, checkbox, and FAB controls have no accessibility
  label.
- Touch targets for the checkbox (24), edit/delete icons (22), and password
  toggle (20) are below the 44×44 iOS / 48×48 Android guideline.
- Error text is not linked to its input through `accessibilityHint` or
  `aria-describedby`.
- Contrast is measured: `on-surface` on `surface` 16.23:1, `on-surface-variant`
  on `surface` 4.71:1, `on-secondary-container` on `secondary-container`
  4.55:1, `on-primary` on `primary-container` 14.63:1, `error` on `surface`
  6.12:1. `on-surface-variant` on `surface-variant` is 3.90:1, below the 4.5:1
  normal-text threshold; rework that pair before using it for labels,
  placeholders, or chips.

Parcial 2 target controls must meet the same checklist; see §12.6 for the
specific labels and touch targets.

These are recorded as current state, not as approved design.

## 12. Parcial 2 UI status

Status: `PhotoCard`, `LocationCard`, `ContactCard`, `CalendarCard`,
`PermissionNotice`, and `TaskAttachments` are shipped. Implementation
status is tracked in the project-brief §Parcial 2 acceptance checklist; scoring
stays separate. Use the tokens in §3–§5, the type scale in §4, and the
primitives in §6. Do not add a new palette.

### 12.1 Intent

- Attachments are compact rows, not a second visual system.
- One `surface-container` card per device resource, radius 8, padding 16,
  20 px internal gap. The reminder card keeps the same treatment.
- Photo is the only visual element; location, contact, and calendar are text
  rows with an icon.
- No map, no full-screen photo viewer, no new navigation destinations.

### 12.2 Task form order

Add the device cards after `Descripción` and before `ReminderCard`:

```text
Foto
  [thumbnail 64] Sin foto
  [Tomar foto] [Elegir de galería]
  Quitar foto (only when set)
Ubicación
  [pin] Ubicación                 [Usar mi ubicación]
  Sin ubicación / address / coords
Contacto
  [person] Contacto               [Elegir contacto]
  Sin contacto / name · phone
Calendario
  [calendar] Evento en el calendario   [switch]
  Se crea al guardar la tarea
  Evento creado (when set)
Recordatorio (existing)
```

Component names:

| Component | File | Notes |
| --- | --- | --- |
| `PhotoCard` | `src/components/ui/task-form/photo-card.tsx` | Shipped. 64 px thumbnail, two actions, remove |
| `LocationCard` | `src/components/ui/task-form/location-card.tsx` | Shipped. Icon, value, `Usar mi ubicación` |
| `ContactCard` | `src/components/ui/task-form/contact-card.tsx` | Shipped. Icon, name/phone, `Elegir contacto` |
| `CalendarCard` | `src/components/ui/task-form/calendar-card.tsx` | Shipped. Icon, switch, helper, event state |
| `PermissionNotice` | `src/components/ui/permissions/permission-notice.tsx` | Shipped. Inline message, retry or settings |
| `TaskAttachments` | `src/components/ui/home/home-task/task-attachments.tsx` | Shipped. Card thumbnail and meta row |

The cards reuse `ThemedText`, `HomeBadge`, and `AppTouchableOpacity`. Buttons
inside cards use `label-md`; helper text uses `label-sm` and `secondary` for
contrast on `surface-container`.

### 12.3 Task card

```text
TaskCard
  [checkbox] Title                  [edit] [delete]
  description
  TaskAttachments
    [photo 56]  [pin] address
                [person] name · phone
                [calendar] Evento
  reminder badge (existing)
```

- Thumbnail 56×56, radius 6, `surface-variant` placeholder when empty.
- Meta rows use `label-sm`, `secondary`, one line each with
  `numberOfLines={1}`.
- Calendar indicator is a small icon plus `Evento`; no date duplication.
- The card grows only when an attachment exists. Do not reserve empty space.
- The photo is not tappable in this target; there is no viewer.

### 12.4 Permission states

| State | Treatment |
| --- | --- |
| Pending | Action disabled; `ActivityIndicator` in the card value or action; card stays at full opacity |
| Denied, can retry | `PermissionNotice` below the card value: `Permiso denegado. Podés volver a intentarlo.` + `Reintentar` |
| Blocked | `PermissionNotice`: `Permiso denegado. Habilitalo en Ajustes.` + `Abrir ajustes` |
| Granted, empty value | Normal empty copy (`Sin foto`, `Sin ubicación`, `Sin contacto`, `Sin evento`) |
| Granted, value set | Value row plus remove or change action |
| Device error | `PermissionNotice` with the matching message from `SPEC.md` §15.8. |

`PermissionNotice` uses `label-sm` and `error` for the message, and a
`FormButton` `variant="surface"` for the action. It is not a modal.

### 12.5 Icons

Add these wrappers under `src/components/icons/`:

| Component | iOS | Android | Size |
| --- | --- | --- | --- |
| `CameraIcon` | `camera` | `photo_camera` | 20 |
| `GalleryIcon` | `photo.on.rectangle` | `photo_library` | 20 |
| `LocationIcon` | `mappin.and.ellipse` | `location_on` | 20 |
| `ContactIcon` | `person.crop.circle` | `person` | 20 |
| `CalendarIcon` | `calendar` | `calendar_month` | 20 |
| `CloseIcon` | `xmark` | `close` | 18 |

Use `BaseIcon`; one icon per file. Existing `ReminderIcon` and
`SchedulingIcon` keep their current sizes.

### 12.6 Accessibility

- Every icon-only action gets an `accessibilityLabel`: `Tomar foto`,
  `Elegir de galería`, `Quitar foto`, `Usar mi ubicación`, `Elegir contacto`,
  `Crear evento`.
- Every action target is at least 44×44 (iOS) / 48×48 (Android); pad the icon
  wrappers, do not enlarge the glyph.
- `PermissionNotice` uses `accessibilityLiveRegion="polite"` on Android and
  announces once on iOS when the state changes.
- The photo thumbnail gets `accessibilityLabel="Foto de la tarea"`; decorative
  icons use `accessibilityElementsHidden` on iOS and
  `importantForAccessibility="no"` on Android.
- Errors and permission notices use the live region and iOS announcement;
  do not rely on color alone.
- Body text keeps the platform font scale. Fixed-height rows must not clip at
  large sizes; let the value wrap to two lines.

### 12.7 Copy

Use §15.8 in `SPEC.md` for the exact strings. Follow
`.opencode/skills/ux-writing/SKILL.md`: Spanish rioplatense, `vos`, sentence
case, no terminal period on labels or buttons.
