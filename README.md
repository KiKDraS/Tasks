# Tasks — Gestor de tareas

App móvil en **React Native + Expo** para organizar tareas con recordatorios,
fotos, ubicación, envío a un contacto y evento en el calendario. Funciona de
forma local, sin backend.

## ¿Por qué existe este repositorio?

Proyecto desarrollado para **Aplicaciones Móviles (ISTEA)**. El **Parcial 1**
cubrió componentes, estilos, navegación, autenticación local, almacenamiento y
notificaciones. El **Parcial 2** sumó permisos y acceso a recursos del
dispositivo, testing automatizado y estado global con Zustand.

Repositorio: [github.com/KiKDraS/Tasks](https://github.com/KiKDraS/Tasks)

## Opción elegida

**Gestor de tareas** — continuación de la app del Parcial 1, con título,
descripción y recordatorio (tiempo relativo o fecha y hora).

## Cómo ejecutar la app

Requisitos: Node.js, pnpm y, para el development build, Xcode (iOS) o Android
Studio (Android).

```bash
pnpm install
pnpm start
```

Para compilar un development build:

```bash
pnpm dlx expo run:ios
pnpm dlx expo run:android
```

> **Development build obligatorio para las funciones del dispositivo.** Cámara,
> galería, ubicación, contactos, calendario y notificaciones usan módulos nativos
> con permisos propios. Expo Go no alcanza para probarlos ni para validar los
> permisos: usá un development build, y un dispositivo físico para cámara y
> notificaciones.

Usuario de prueba (seed): `Ana` / `1234`, o creá una cuenta desde el registro.

## Tests y calidad

```bash
pnpm test              # Jest + React Native Testing Library
pnpm lint              # ESLint (expo lint)
pnpm exec tsc --noEmit # TypeScript
```

Estado actual: **42 suites, 263 tests, todos pasando** (`pnpm test`).

## Funcionalidades implementadas

### Parcial 1

- **Autenticación local**: registro, login contra los datos guardados y rutas
  protegidas con `Stack.Protected`. Sin sesión no se accede a las tareas.
- **Tareas**: alta, listado, edición, completar y eliminar.
- **Persistencia con AsyncStorage**: usuarios, sesión y tareas sobreviven al
  cierre de la app.
- **Recordatorios**: notificación local programada por tiempo o por fecha, con
  badge en la tarea y cancelación al completarla o eliminarla.
- **Navegación**: Expo Router (Stack + Tabs).
- **UI**: componentes reutilizables (`FormButton`, `TextField`, `OptionChip`,
  `TaskCheckbox`) y tema centralizado de color, tipografía y espaciado.

### Parcial 2

- **Permisos con estados**: cada recurso informa concedido, denegado o pendiente.
  Si se deniega, la pantalla muestra un mensaje claro con opción de reintentar; si
  el permiso quedó bloqueado, ofrece **Abrir ajustes**.
- **Cámara y galería**: fotos por tarea con `expo-image-picker`. La galería
  permite elegir varias imágenes y la cámara agrega una por captura. Las fotos se
  copian al almacenamiento de la app. El formulario es la vista de detalle; el
  listado muestra solo la cantidad de fotos.
- **Ubicación GPS**: con `expo-location` se guardan las coordenadas de la tarea y
  se muestran como dirección aproximada cuando el geocoding la devuelve.
- **Compartir con contacto**: `expo-contacts` se usa solo para elegir el contacto
  de destino (el permiso de contactos sigue siendo obligatorio); compartir abre el
  share sheet del sistema con el resumen de la tarea. Cada envío exitoso se
  registra en `Task.shares` (método, nombre del destinatario, tipo de actividad de
  iOS y fecha) y se muestra en **Historial de envíos**. No se guarda el ID ni el
  teléfono del contacto.
- **Calendario**: con `expo-calendar` se crea un evento vinculado a la tarea
  cuando el recordatorio está activo. Si el permiso se deniega, la tarea se
  guarda igual, sin evento.
- **Estado global con Zustand**: `src/stores/tasks/` concentra las tareas con
  acciones de agregar, actualizar, completar y eliminar. Los componentes leen el
  estado por selectores; la hidratación ocurre al montar las tabs autenticadas.

## Estructura del proyecto

```text
src/
├── app/          rutas (Expo Router)
├── components/   UI reutilizable, agrupada por función
├── constants/    tema, rutas, claves de storage
├── context/      sesión de autenticación
├── hooks/        lógica con estado reutilizable
├── services/     AsyncStorage y APIs del dispositivo
├── stores/       estado global con Zustand
└── utils/        helpers puros
__tests__/        Jest + React Native Testing Library
```

El comportamiento y el modelo de datos están especificados en `SPEC.md`. El
sistema visual está en `DESIGN.md`.

## Video DEMO

<!-- TODO: reemplazar por el enlace de YouTube antes de la entrega -->
[PENDIENTE: enlace al video DEMO en YouTube]

## Tecnologías

React Native · Expo SDK 57 · Expo Router · TypeScript · Zustand · AsyncStorage ·
expo-notifications · expo-image-picker · expo-location · expo-contacts ·
expo-calendar · expo-file-system · Jest + React Native Testing Library
