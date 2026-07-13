# 02 — Arquitectura y Tecnologías

## 2.1 Stack tecnológico

| Capa              | Tecnología                              | Versión (segun `package.json`) | Estado   |
|-------------------|------------------------------------------|-------------------------------|----------|
| Framework UI      | React                                     | ^19.2.5                       | En uso  |
| Lenguaje          | TypeScript                                | ~6.0.2                        | En uso  |
| Build tool        | Vite                                      | ^8.0.10                       | En uso  |
| Plugin React      | `@vitejs/plugin-react` (Oxc)              | ^6.0.1                        | En uso  |
| Routing           | `react-router-dom`                        | ^7.14.2                       | En uso  |
| Estilos           | Tailwind CSS v4                           | ^4.2.4                        | En uso  |
| Plugin Tailwind   | `@tailwindcss/vite`                       | ^4.2.4                        | En uso  |
| Iconos            | `lucide-react`                            | ^1.14.0                       | En uso  |
| Linting           | ESLint + `typescript-eslint`              | ^10.2.1 / ^8.58.2             | En uso  |
| Backend           | Firebase (Auth + Firestore)              | —                             | **Pendiente** |
| Testing           | —                                         | —                             | **No configurado** |

> **Importante:** `firebase` **no está** listado en `package.json`. La
> integración con Firebase es una intención descrita en `PROYECTO.MD` pero
> aún no fue iniciada.

## 2.2 Diagrama de flujo de la aplicación

```
index.html
   │
   └── main.tsx        (bootstrap React en StrictMode)
         │
         └── src/App/App.tsx
               │
               └── src/Routes/app.routes.tsx   (BrowserRouter)
                     │
                     ├── "/"                → HomePage
                     │      ├── Navbar
                     │      ├── Hero
                     │      └── Especialidades
                     │
                     ├── "/login"          → Auth   (modo login)
                     ├── "/registro"       → Auth   (modo registro)
                     │
                     └── "/especialidades" → Especialidades
```

## 2.3 Decisiones de arquitectura

- **Estructura plana por páginas**: las páginas viven en `src/Page/<Nombre>/`,
  los componentes reutilizables en `src/Components/<Nombre>/`, y las rutas en
  `src/Routes/`. No existe capa de servicios,store, hooks compartidos ni
  modelos de dominio (`types/`, `models/`).
- **Sin biblioteca de estado global**: no se usa Redux, Zustand, Jotai ni
  Context. Cada componente maneja su estado local con `useState`.
- **Sin capa de datos**: no hay `fetch`, `axios`, ni SDK de Firebase. Los
  formularios sólo imprimen los valores por consola (`console.log`).
- **Tailwind v4 por CSS import**: la habilitación se hace con
  `@import "tailwindcss";` en `src/Css/index.css`, sin archivo
  `tailwind.config.js` (Tailwind v4 es configuración-por-CSS).
- **Diseño dark-first**: fondo oscuro `#1A1A1A`, acentos naranja y verde,
  tarjetas redondeadas con `border-radius` elevado.
- **`StrictMode` activo** en `main.tsx` (doble-render en desarrollo).

## 2.4 Configuración de compilación

- **`vite.config.ts`** habilita los plugins `react()` y `tailwindcss()`. No
  define alias de ruta, ni proxy, ni configuración de servidor personalizada.
- **`tsconfig.app.json`**:
  - `target: ES2022`, `lib: ["ES2022","DOM"]`.
  - `jsx: react-jsx` (no requiere importar React).
  - `moduleResolution: bundler`, `verbatimModuleSyntax: true`.
  - Lintado estricto: `noUnusedLocals`, `noUnusedParameters`,
    `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`.
- **`tsconfig.node.json`**:-target `es2023`, `types: ["node"]`, para
  `vite.config.ts`.

## 2.5 Scripts disponibles

| Script            | Comando             | Descripción                                  |
|-------------------|---------------------|----------------------------------------------|
| `npm run dev`     | `vite`              | Servidor de desarrollo con HMR                |
| `npm run build`   | `tsc -b && vite build` | Compila TS y empaqueta con Vite           |
| `npm run lint`    | `eslint .`          | Ejecuta ESLint sobre el proyecto              |
| `npm run preview` | `vite preview`      | Sirve el build de producción localmente       |

## 2.6 Observaciones técnicas

- **No existe archivo `.env`** ni ejemplo de variables de entorno. Cuando se
  integre Firebase se requerirá un `.env` con las claves de configuración.
- **No hay tests**: no se incluye Vitest, Jest, React Testing Library ni
  Playwright. No existe ningún archivo `*.test.*`.
- **No hay CI/CD**: no se incluye configuración de GitHub Actions u otro pipeline.
- **Brand naming inconsistente**: `package.json`/`index.html` usan
  `sentinel-segurity-web` (con error de tipeo en “segurity”), mientras que la UI
  muestra “Sentinel” y “E.E.S.T. Nro. 3”. Debería unificarse.
- **`index.html`**: tiene `lang="en"` y un título técnico; debería ser `lang="es"`
  con un título descriptivo del proyecto.