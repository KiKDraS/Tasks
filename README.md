# Tasks — Gestor de tareas

## ¿Por qué existe este repositorio?

Proyecto desarrollado para el **Parcial 1 – Aplicaciones Móviles (ISTEA)**. Es
una app móvil en **React Native + Expo** que aplica los conceptos vistos en
clase: componentes y estilos, navegación con stack, almacenamiento local,
autenticación básica y notificaciones locales.

## Opción elegida

✅ **Gestor de tareas** — permite crear tareas con título, descripción y
recordatorio (15m, 30m, 1h, 2h o un tiempo personalizado).

## Cómo ejecutar la app

Requisitos: Node.js y pnpm.

```bash
pnpm install
pnpm start
```

Escaneá el QR con **Expo Go** o abrí un emulador (también podés usar
`pnpm android`, `pnpm ios` o `pnpm web`). Si algún componente nativo no se
renderiza, usá un development build (`pnpm dlx expo run:ios` /
`pnpm dlx expo run:android`).

Usuario de prueba (seed): `Ana` / `1234`, o creá una cuenta desde la pantalla de
registro.

```bash
pnpm test   # Jest + React Native Testing Library
pnpm lint
```

## Funcionalidades implementadas

- **Autenticación local**: registro de usuario, login validado contra los datos
  guardados y rutas protegidas.
- **Tareas**: crear, listar, editar y eliminar.
- **Recordatorios**: notificación local programada por tiempo o fecha, con badge
  en la tarea y cancelación al completarla o eliminarla.
- **Persistencia con AsyncStorage**: usuarios, sesión y tareas se mantienen al
  cerrar la app.
- **Navegación**: Expo Router (Stack + Tabs).
- **Tests**: 4 suites / 12 tests con Jest + React Native Testing Library.
- **UI**: componentes reutilizables (`FormButton`, `TextField`, `OptionChip`,
  `TaskCheckbox`) y tema centralizado de colores, tipografía y espaciado.

## Video DEMO

🎥
[Ver demo](https://drive.google.com/file/d/1THcxt3eE3Cy0kfMN5tDxMoz1hXcslQhd/view?usp=sharing).

## Tecnologías

React Native · Expo SDK 57 · Expo Router · AsyncStorage · expo-notifications ·
TypeScript · Jest + React Native Testing Library
