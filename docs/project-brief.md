# Parcial 1 — Project Brief

Canonical requirements source for all agents. Reference sections from other docs.

## Objetivo del Parcial

Desarrollar una aplicación móvil simple y funcional en React Native, aplicando los conceptos vistos en clase: componentes, estilos, navegación, almacenamiento local, autenticación básica y notificaciones locales.

## Consigna General

Cada alumno deberá desarrollar UNA aplicación, eligiendo UNA de las siguientes opciones:

✅ **Gestor de tareas**

## Requerimientos obligatorios

### 1. Componentes y Styling

La aplicación debe:

- Utilizar componentes básicos de React Native: `View`, `Text`, `TextInput`, `Button`, `TouchableOpacity`.
- Aplicar estilos con `StyleSheet`.
- Contar con al menos 1 componente reutilizable (ítem de lista, botón personalizado, etc.).
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
  - Un test de un componente reutilizable (verificando que renderiza correctamente y/o responde a interacciones).
  - Un test de una función o lógica de negocio (ej: validación de formulario, cálculo, formateo).
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

## Acceptance checklist

Map each requirement to current evidence. Update this table when the app changes.

| # | Requirement | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Components + StyleSheet + reusable component | `src/components/ui/form/form-button.tsx`, `text-field.tsx`, `option-chip.tsx`, `task-checkbox.tsx`; `src/constants/theme.ts` | ✅ |
| 2 | Stack navigation + required screens | `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/sign-up/index.tsx`, `src/app/(tabs)/index.tsx`, `src/app/(tabs)/task-form/index.tsx` | ✅ Expo Router Stack/Tabs |
| 3 | Local auth + protected routes | `src/context/auth/auth-context.tsx`, `src/hooks/sign-in/`, `src/hooks/sign-up/`, `Stack.Protected` in `src/app/_layout.tsx` | ✅ |
| 4 | AsyncStorage tasks + persistence | `src/hooks/use-db.ts`, `src/context/tasks/tasks-context.tsx`, `src/constants/storage-keys.ts` | ✅ |
| 5 | Local notification | `src/context/tasks/utils/notifications.ts`, `src/hooks/task-form/utils/reminder.ts`, `expo-notifications` plugin in `app.json` | ✅ |
| 6 | Jest + RNTL tests, single command | `__tests__/` (5 files, 13 tests); test command in `.opencode/docs/quality-gates.md` | ✅ |
| 7 | Delivery: public repo, README, YouTube demo | `README.md`; repo visibility and demo link require manual verification | ⚠️ accepted gaps |

## Accepted gaps

The exam was already approved. These gaps are recorded but are not blockers for agent work:

- `README.md` says 4 suites / 12 tests; actual suite is 5 files / 13 tests.
- `README.md` demo link points to Google Drive; the assignment asks for YouTube.

## Manual QA

- **Auth:** register a user, log in, close the app, reopen it, and confirm the session and tasks persist. Verify protected routes redirect when logged out.
- **Tasks:** add, list, complete, edit, and delete a task. Confirm data survives an app restart.
- **Notifications:** create a task with a short reminder, confirm the local notification fires on a development build/device, then confirm it is cancelled when the task is completed or deleted.
