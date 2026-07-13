# 03 — Estructura de Archivos

## 3.1 Árbol completo del repositorio

```
Sistema-de-asistencias-inteligente-master/
│
├── .gitignore
├── .hintrc
├── README.md
├── PROYECTO.MD
├── Carpeta de Campo/                ← esta documentación
├── eslint.config.js
├── index.html
├── main.tsx                         ← Bootstrap de React
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── vite-env.d.ts
    │
    ├── App/
    │   └── App.tsx
    │
    ├── assets/
    │   ├── vite.svg
    │   ├── react.svg
    │   └── hero.png                 ← sin usar (Hero usa mockup CSS)
    │
    ├── Components/
    │   ├── Navbar/
    │   │   └── Navbar.tsx
    │   └── Hero/
    │       └── Hero.tsx
    │
    ├── Css/
    │   └── index.css               ← import de Tailwind + keyframes
    │
    ├── Page/
    │   ├── Auth/
    │   │   ├── Auth.tsx             ← página de auth activa (login/registro)
    │   │   └── Auth.css
    │   ├── Especialidades/
    │   │   └── Especialidades.tsx
    │   ├── HomePage/
    │   │   └── HomePage.tsx
    │   ├── Login/
    │   │   └── Login.tsx            ← prototipo NO enrutado
    │   └── Register/
    │       └── Register.tsx         ← prototipo NO enrutado
    │
    └── Routes/
        └── app.routes.tsx
```

**Total de archivos** (excluyendo `node_modules` y la Carpeta de Campo): 23
**Archivos de código fuente** (.tsx/.ts/.css/.html/.js/.json relevantes): 12

## 3.2 Descripción por archivo

### Configuración y raíz

| Archivo              | Propósito                                                                  |
|----------------------|----------------------------------------------------------------------------|
| `package.json`       | Manifest NPM del proyecto `sentinel-segurity-web`; lista dependencias y scripts |
| `package-lock.json`  | Lockfile autogenerado de dependencias                                      |
| `index.html`         | Shell HTML del SPA (carga `./main.tsx`, monta `#root`, favicon `/favicon.svg`) |
| `main.tsx`           | Punto de entrada; renderiza `<App/>` dentro de `<StrictMode>` en `#root`  |
| `vite.config.ts`     | Config Vite con plugins `react()` y `tailwindcss()`                        |
| `tsconfig.json`      | Root con project references a `tsconfig.app.json` y `tsconfig.node.json`  |
| `tsconfig.app.json`  | Config TS para el código de la app (ES2022, react-jsx, estricto)           |
| `tsconfig.node.json` | Config TS para `vite.config.ts` (ES2023, types: node)                      |
| `eslint.config.js`   | ESLint flat config (recommended + react-hooks + react-refresh)            |
| `.hintrc`            | Config de webhint (relicto; webhint no está instalado)                    |
| `.gitignore`         | Ignora `node_modules`, `dist`, logs, archivos de editor y de SO          |
| `README.md`          | Boilerplate por defecto del template Vite React+TS (no personalizado)    |
| `PROYECTO.MD`        | Especificación oficial del proyecto en español                            |

### `public/`

| Archivo        | Propósito                                  |
|----------------|--------------------------------------------|
| `favicon.svg`  | Favicon del sitio (referenciado por `index.html`) |
| `icons.svg`    | Sprite de iconos SVG                        |

### `src/`

| Archivo            | Propósito                                        |
|--------------------|--------------------------------------------------|
| `vite-env.d.ts`    | Tipos de cliente Vite + declaraciones de módulos CSS |

### `src/App/`

| Archivo     | Propósito                                                                 |
|-------------|---------------------------------------------------------------------------|
| `App.tsx`   | Componente raíz; envuelve `<AppRoutes/>`. Lógica mínima (sólo routing)    |

### `src/Routes/`

| Archivo           | Propósito                                                       |
|-------------------|-----------------------------------------------------------------|
| `app.routes.tsx`  | Define las rutas con `BrowserRouter` de React Router 7          |

### `src/Components/`

| Archivo            | Propósito                                                      |
|--------------------|----------------------------------------------------------------|
| `Navbar/Navbar.tsx`| Barra de navegación superior de la landing (con menú mobile)   |
| `Hero/Hero.tsx`    | Banner hero con mockup de la app móvil y badges de tiendas     |

### `src/Page/`

| Archivo                          | Propósito                                                        | Estado        |
|----------------------------------|------------------------------------------------------------------|---------------|
| `HomePage/HomePage.tsx`          | Composición de la landing (`Navbar` + `Hero` + `Especialidades`) | En uso         |
| `Auth/Auth.tsx`                  | Página de login/registro con diseño deslizante                     | En uso         |
| `Auth/Auth.css`                  | Estilos del contenedor de Auth (`.container`)                     | En uso         |
| `Especialidades/Especialidades.tsx` | Página con las dos especialidades de la escuela               | En uso         |
| `Login/Login.tsx`               | Prototipo de login (no enrutado, reemplazado por Auth)            | **Orphan**     |
| `Register/Register.tsx`         | Prototipo de registro (no enrutado, reemplazado por Auth)        | **Orphan**     |

### `src/Css/`

| Archivo        | Propósito                                                              |
|----------------|------------------------------------------------------------------------|
| `index.css`    | Global: `@import "tailwindcss";` + `@keyframes spin` (degradado cónico) |

### `src/assets/`

| Archivo       | Propósito                                   | Uso                |
|---------------|---------------------------------------------|--------------------|
| `vite.svg`    | Logo Vite por defecto                        | Template (sin uso) |
| `react.svg`   | Logo React por defecto                       | Template (sin uso) |
| `hero.png`    | Imagen hero original del template            | **Sin usar**       |

## 3.3 Observaciones sobre la estructura

- **No existe** `src/services/`, `src/hooks/`, `src/types/`, `src/models/`,
  `src/context/`, `src/utils/` ni `src/store/`. La arquitectura se reducirá al
  añadir estas capas al integrar Firebase y los roles.
- **Componentes huérfanos**: `Login.tsx` y `Register.tsx` quedaron como
  prototipos no enrutados; conviene eliminarlos o documentarlos como referencia.
- **`assets/hero.png`** existe pero ningún archivo lo referencia (el componente
  `Hero` construye un mockup con CSS/SVG).
- **`README.md`** sigue siendo el boilerplate del template; debería
  reescribirse para describir el proyecto real.