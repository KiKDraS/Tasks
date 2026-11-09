# Parcial 1 + 2 — Project Brief

Canonical requirements source for all agents. Reference sections from other
docs.

> **Precedence:** the implementation in `src/` is the source of truth for
> Parcial 1. Where this brief and the code disagree, the code wins; the Parcial
> 1 exam was already approved. Parcial 2 task state, device services, and form
> attachment cards are implemented; list attachments and task-delete cleanup
> remain target. Behavior is documented in `SPEC.md`.

## Objetivo del Parcial

Desarrollar una aplicación móvil simple y funcional en React Native, aplicando
los conceptos vistos en clase: componentes, estilos, navegación, almacenamiento
local, autenticación básica y notificaciones locales.

## Consigna General

Cada alumno deberá desarrollar UNA aplicación, eligiendo UNA de las siguientes
opciones:

✅ **Gestor de tareas**

## Requerimientos obligatorios

### 1. Componentes y Styling

La aplicación debe:

- Utilizar componentes básicos de React Native: `View`, `Text`, `TextInput`,
  `Button`, `TouchableOpacity`.
- Aplicar estilos con `StyleSheet`.
- Contar con al menos 1 componente reutilizable (ítem de lista, botón
  personalizado, etc.).
- Mantener una interfaz clara, ordenada y fácil de usar.

### 2. Navegación

Implementar React Navigation (Stack Navigation).

Pantallas obligatorias:

1. Login
2. Registro
3. Home (pantalla principal de la app elegida)
4. Alta / creación de elemento (tarea, evento, producto, hábito o medicación)

### 3. Autenticación

Sistema de autenticación local y simple:

- Registro con usuario y contraseña.
- Login validando los datos guardados.
- No permitir acceso a la app sin iniciar sesión.

📌 Importante (nivel inicial):

- No se necesita backend.
- No se requiere cifrado.
- Se permite guardar usuarios en AsyncStorage.

### 4. Almacenamiento y Datos

Usar AsyncStorage para guardar:

- Usuario registrado.
- Datos principales de la app elegida.

Según la opción seleccionada: ✅ **Tareas**

Requisitos mínimos:

- Agregar elementos.
- Mostrar una lista.
- Eliminar al menos un elemento.
- Mantener datos al cerrar la app.

### 5. Notificaciones Locales (simple)

Implementar al menos una notificación local relacionada con la app:

- Ejemplo: tarea pendiente.

📌 Nivel inicial:

- Notificación simple.
- Puede ser programada a los X segundos o a una hora fija.

✅ Se evalúa: que la notificación se dispare correctamente.

### 6. Testing con JEST (simple)

- Configurar Jest junto con React Native Testing Library (RNTL).
- Escribir un mínimo de 3 tests, incluyendo:
  - Un test de un componente reutilizable (verificando que renderiza
    correctamente y/o responde a interacciones).
  - Un test de una función o lógica de negocio (ej: validación de formulario,
    cálculo, formateo).
- Los tests deben poder ejecutarse con un único comando (ej: `npm test`).

## Aclaraciones por tipo de app

### Gestor de tareas

Agregar tareas con título y recordatorio.

## No se requiere

- Backend
- Firebase
- Bases de datos externas
- Diseño avanzado
- Animaciones complejas

## Entrega

- El proyecto debe subirse a GitHub o GitLab.
- El repositorio debe ser público.
- Se deberá compartir el enlace del repositorio como parte de la entrega.
- Mail a compartir: martin.cornejo@istea.com.ar
- El repositorio debe contener:
  - Todo el código de la aplicación.
  - Breve README indicando:
    - Opción elegida.
    - Cómo ejecutar la app.
    - Funcionalidades implementadas.
    - Enlace Video DEMO de la app en YouTube (no más de 1 min).

## Parcial 1 acceptance checklist

Parcial 1 is approved. Map each requirement to current evidence. Update this
table when the app changes.

| #   | Requirement                                  | Evidence                                                                                                                                  | Status                    |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | Components + StyleSheet + reusable component | `src/components/ui/form/form-button.tsx`, `text-field.tsx`, `option-chip.tsx`, `task-checkbox.tsx`; `src/constants/theme.ts`              | ✅                        |
| 2   | Stack navigation + required screens          | `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/sign-up/index.tsx`, `src/app/(tabs)/index.tsx`, `src/app/(tabs)/task-form/index.tsx` | ✅ Expo Router Stack/Tabs |
| 3   | Local auth + protected routes                | `src/context/auth/auth-context.tsx`, `src/hooks/sign-in/`, `src/hooks/sign-up/`, `Stack.Protected` in `src/app/_layout.tsx`               | ✅                        |
| 4   | AsyncStorage tasks + persistence             | `src/services/tasks-storage.ts`, `src/stores/tasks/tasks-store.ts`, `src/constants/storage-keys.ts`                                             | ✅                        |
| 5   | Local notification                           | `src/context/tasks/utils/notifications.ts`, `src/hooks/task-form/utils/reminder.ts`, `expo-notifications` plugin in `app.json`            | ✅                        |
| 6   | Jest + RNTL tests, single command            | `__tests__/` (23 files, 128 tests); test command in `.opencode/docs/quality-gates.md`                                                       | ✅                        |
| 7   | Delivery: public repo, README, YouTube demo  | `README.md`; repo visibility and demo link require manual verification                                                                    | ⚠️ accepted gaps          |

## Accepted gaps

The Parcial 1 exam was already approved. These gaps are recorded but are not
blockers for agent work:

- `README.md` says 4 suites / 12 tests; actual suite is 23 files / 128 tests.
- `README.md` demo link points to Google Drive; the assignment asks for YouTube.

Parcial 2 task state, device services, and all form attachment cards are
implemented; list attachments and task-delete cleanup are target. See §Parcial 2
acceptance checklist.

## Manual QA

- **Auth:** register a user, log in, close the app, reopen it, and confirm the
  session and tasks persist. Verify protected routes redirect when logged out.
- **Tasks:** add, list, complete, edit, and delete a task. Confirm data survives
  an app restart.
- **Notifications:** create a task with a short reminder, confirm the local
  notification fires on a development build/device, then confirm it is cancelled
  when the task is completed or deleted.

# Parcial 2 — Project Brief continuity

## Objetivo del Parcial

Ampliar la aplicación desarrollada en el Parcial 1, incorporando el acceso a
recursos del dispositivo (permisos, cámara, galería, ubicación, contactos y
calendario), la implementación de testing automatizado con Jest y la migración
del manejo de estado a una solución de estado global (Zustand o Redux Toolkit).

## Consigna General

Cada alumno deberá continuar trabajando sobre la misma aplicación entregada en
el Parcial 1, incorporando las nuevas funcionalidades que se detallan a
continuación.

## Requerimientos obligatorios

- 1 Permisos y Acceso a Recursos del Dispositivo
  - Solicitar los permisos correspondientes antes de usar cada recurso (cámara,
    galería, ubicación, contactos, calendario).
  - Manejar correctamente los distintos estados de permiso: concedido, denegado,
    pendiente.
  - Mostrar un mensaje claro al usuario si el permiso es rechazado.
- 2 Cámara y Galería
  - Utilizar expo-image-picker y/o expo-camera.
  - Permitir tomar una foto con la cámara o seleccionar una imagen desde la
    galería.
  - Asociar la imagen seleccionada a un elemento de la app (tarea).
  - Mostrar la imagen asociada en la lista y/o en el detalle del elemento.
- 3 Ubicación (GPS)
  - Utilizar expo-location para obtener la ubicación actual del dispositivo.
  - Asociar la ubicación obtenida a un elemento de la app (ej: lugar de la
    tarea).
  - Mostrar la ubicación asociada (coordenadas, dirección aproximada o mapa
    simple).
- 4 Acceso a Contactos y Calendario
  - Utilizar expo-contacts para seleccionar un contacto de la agenda del
    dispositivo y asociarlo a un elemento de la app.
  - Utilizar expo-calendar para crear un evento o recordatorio en el calendario
    del dispositivo, vinculado a un elemento de la app.
- 5 Estado Global con Zustand o Redux Toolkit
  - Migrar al menos una porción relevante del estado de la app (ej: lista
    principal de elementos, usuario autenticado, preferencias) a Zustand o Redux
    Toolkit.
  - Crear el/los store(s) correspondientes, con acciones para agregar, eliminar
    y actualizar elementos.
  - Reemplazar el uso de useState/prop drilling por el store global donde
    corresponda.
  - Los componentes deben leer y modificar el estado a través del store
    (selectores/hooks del store).

## Aclaraciones por tipo de app (guía para el alumno)

Gestor de tareas: Foto adjunta a la tarea, ubicación del lugar a realizarla,
contacto relacionado (responsable) y evento en el calendario.

## Punto Extra: IA aplicada al desarrollo

Como parte extra del parcial, el alumno puede incorporar el uso de herramientas
de Inteligencia Artificial como apoyo al desarrollo, aplicando alguno (o varios)
de los siguientes conceptos:

- Generación de código con IA: utilizar un asistente de IA (ej: GitHub Copilot,
  ChatGPT, Claude, etc.) para generar o refactorizar parte del código de la app.
  Prompts efectivos para LLMs: documentar los prompts utilizados, mostrando cómo
  se redactaron para obtener mejores resultados (contexto, ejemplos,
  restricciones).
- Diseño a código automáticamente: aplicar herramientas que transformen un
  diseño (mockup/wireframe) en código de componentes.
- Figma a React Native: convertir una pantalla o componente diseñado en Figma a
  código React Native.
- Plugins de conversión: utilizar plugins de Figma u otras herramientas (ej:
  Anima, Figma to Code, Locofy, Visual Copilot) para acelerar la conversión de
  diseño a código. Si se realiza esta parte, documentar en el README:
  herramientas/plugins utilizados, ejemplos de prompts aplicados y una breve
  comparación entre el código generado automáticamente y el código final
  integrado en la app.

## No se requiere

- Backend
- Firebase
- Bases de datos externas
- Diseño avanzado
- Animaciones complejas

## Entrega

- El proyecto debe subirse al mismo repositorio de GitHub o GitLab del Parcial
  1, actualizado con los nuevos cambios.
- El repositorio debe seguir siendo público.
- Se deberá compartir nuevamente el enlace del repositorio actualizado.
- Mail a compartir: martin.cornejo@istea.com.ar
- El repositorio debe contener todo el código actualizado de la aplicación.
- Actualizar el README indicando:
  - Nuevas funcionalidades implementadas (permisos, cámara/galería, ubicación,
    contactos, calendario, testing, estado global).
  - Cómo ejecutar la app y cómo correr los tests.
  - Enlace al video DEMO actualizado en YouTube (no más de 1 minuto), mostrando
    las nuevas funcionalidades.

## Parcial 2 acceptance checklist

This checklist tracks implementation. Mark a row `✅ implemented` when its
feature lands and passes review/QA. Target evidence is in `SPEC.md`
§15.7.

| # | Requirement | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Permissions for camera, gallery, location, contacts, calendar; granted / denied / pending states; clear denied message | `src/services/permissions.ts`, `src/utils/permission-state.ts`, `src/components/ui/permissions/permission-notice.tsx` | ✅ implemented |
| 2 | Camera and gallery photo attached to a task and shown in the list | `src/services/media.ts`, `src/components/ui/task-form/photo-card.tsx`; list wiring pending | ⬜ pending implementation |
| 3 | GPS location attached to a task and shown as coordinates or address | `src/services/location.ts`, `src/components/ui/task-form/location-card.tsx`; list wiring pending | ⬜ pending implementation |
| 4 | Contact selected from the device and calendar event created for a task | `src/services/contacts.ts`, `src/services/calendar.ts`, `src/components/ui/task-form/contact-card.tsx`, `src/components/ui/task-form/calendar-card.tsx` | ✅ implemented |
| 5 | Zustand global state with add, update, and delete actions; components read through store selectors | `src/stores/tasks/`, `src/hooks/tasks/use-hydrate-tasks.ts` | ✅ implemented |
| 6 | Jest automated tests for the new state and device flows | Service/state/form tests in `__tests__/`; list attachment/cleanup tests pending | ⬜ pending implementation |
| 7 | Delivery: updated public repo, README with new features, YouTube demo | None yet; target `README.md` | ⬜ pending implementation |
