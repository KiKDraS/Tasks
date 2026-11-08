# Spanish UI Copy — Rioplatense

Project baseline for `Tasks`. UI copy is Spanish; code identifiers and comments
are English.

## Voice

- Calm, direct, informal.
- Address the user with `vos`, not `usted` or `tú`.
- One idea per string. No exclamation marks. No emojis in product UI.
- Say what happened and what to do next. Never blame the user.

## Pronouns and possessives

- `vos` for the subject: `Ingresá`, `Creá`, `Completá`.
- `tu` / `tus` for possession: `tu lista`, `tus tareas`.
- No `usted`, `su`, `sus` in product copy.

## Imperatives

| Use | Avoid |
| --- | --- |
| Ingresá | Ingresa |
| Creá | Crea |
| Completá | Completa |
| Modificá | Modifica |
| Elegí | Elige |
| Cancelá | Cancela |
| Intentá | Intenta |
| Revisá | Revisa |
| Activá | Activa |
| Guardá | Guarda |

## Vocabulary

| Use | Avoid |
| --- | --- |
| tarea | task, todo |
| recordatorio | reminder |
| usuario | user |
| contraseña | password |
| iniciar sesión | loguear, log in |
| registrarse | sign up |
| crear cuenta | register |
| eliminar | borrar (for destructive actions, `eliminar` is clearer) |

## Length targets

| Element | Target |
| --- | --- |
| Button | ≤ 20 characters |
| Label | ≤ 24 characters |
| Error | ≤ 80 characters |
| Empty state | ≤ 120 characters |
| Notification body | ≤ 100 characters |

These are guardrails, not hard limits. A longer string is fine if shortening
would remove meaning.

## Errors

Pattern: `[what failed]. [recovery].` Omit the period when the string is a
single sentence in a form field.

| Situation | Copy |
| --- | --- |
| Username required | `Ingresá tu usuario` |
| Password required | `Ingresá tu contraseña` |
| Wrong credentials | `Usuario o contraseña incorrectos` |
| Duplicate username | `Ese usuario ya existe` |
| Password confirmation missing | `Confirmá tu contraseña` |
| Passwords differ | `Las contraseñas no coinciden` |
| Task title missing | `El título es obligatorio` |
| Invalid duration | `Ingresá un tiempo válido` |
| Task not found | `No encontramos la tarea` |
| Notification denied | `No se pudo programar la notificación. Activá los permisos en los ajustes.` |

Avoid: `Error`, `Inválido`, `Ilegal`, `Algo salió mal`, `Oops`, `Ups`,
`Por favor`, `Lo sentimos`.

## Buttons

- Use verb + object: `Crear tarea`, `Actualizar tarea`, `Guardar cambios`.
- Auth: `Ingresar`, `Crear cuenta`.
- Secondary: `Cancelar`.
- Recovery: `Reintentar`, `Revisar ajustes`.
- Never use `OK`, `Aceptar`, `Enviar`, `Continuar` when a specific verb exists.

## Empty states

Pattern: `[what is empty]. [what to do].`

- First use: `No hay tareas todavía. Creá tu primera tarea.` CTA: `Crear tarea`.
- All done: `No quedan tareas pendientes.` No CTA needed.
- Filter/search with no results: `No encontramos tareas con ese filtro.` CTA:
  `Limpiar filtros`.

Do not write `No tasks found.` or `Nothing here`.

## Notifications

- Title: the task title, unchanged.
- Body: the task description, or `Recordatorio de tu tarea` when empty.
- Permission rationale, before the system prompt when the flow allows it:
  `Activá las notificaciones para recibir tus recordatorios.`
- Denied: `No se pudo programar la notificación. Activá los permisos en los ajustes.`
- Do not put the app name in the title; the OS already shows it.

## Dates and durations

- Time: 24-hour `14:30`.
- Today: `Hoy, 14:30`; tomorrow: `Mañana, 09:00`.
- Other dates: `8 nov, 14:30`; month abbreviations: `ene`, `feb`, `mar`,
  `abr`, `may`, `jun`, `jul`, `ago`, `sep`, `oct`, `nov`, `dic`.
- Chips: `15m`, `30m`, `1h`, `2h`.
- Full sentence: `La notificación se enviará en 15 minutos.`

## Success messages

Use past tense and the concrete result:

- `Tarea creada`
- `Cambios guardados`
- `Recordatorio programado`

Do not use `¡Listo!`, `Genial`, or confetti language.

## Consistency

- Pick one term and repeat it. Do not rotate synonyms for style.
- Keep the same term in the form, the card, the notification, and the empty
  state.
- Spanish punctuation: opening `¿` and `¡` when used. No space before `:`.
- Use the app's existing strings as the source of truth when they already
  follow these rules.
