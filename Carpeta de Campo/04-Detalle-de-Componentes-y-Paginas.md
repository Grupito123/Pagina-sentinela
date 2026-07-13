# 04 — Detalle de Componentes y Páginas

## 4.1 `src/App/App.tsx`

- **Tipo:** Componente raíz (wrapper).
- **Importa:** `AppRoutes` de `../Routes/app.routes`.
- **Exporta:** `App` por defecto, que sólo devuelve `<AppRoutes />`.
- **Responsabilidad:** Punto de montaje del árbol de routing. Sin lógica propia.

## 4.2 `src/Routes/app.routes.tsx`

- **Tipo:** Definición central de rutas.
- **Importa:** `BrowserRouter`, `Routes`, `Route` de `react-router-dom`;
  `HomePage`, `Auth`, `Especialidades`.
- **Exporta:** `AppRoutes` por defecto.
- **Rutas:**

  | Path              | Elemento               |
  |-------------------|------------------------|
  | `/`               | `<HomePage/>`          |
  | `/login`          | `<Auth/>` (modo login) |
  | `/registro`       | `<Auth/>` (modo registro) |
  | `/especialidades` | `<Especialidades/>`    |

- **Observación:** `/login` y `/registro` renderizan el mismo `Auth`, que usa
  `useLocation().pathname` para elegir el modo. No hay ruta 404 catch-all.

## 4.3 `src/Components/Navbar/Navbar.tsx`

- **Tipo:** Presentational component.
- **Importa:** `useState` de React; `useNavigate` de `react-router-dom`;
  iconos `Menu, X, Bell, LogIn, UserPlus` de `lucide-react`.
- **Exporta:** `Navbar` por defecto.
- **Links de navegación (`NAV_LINKS`):**

  | Label           | Ruta            | Estado de la ruta |
  |-----------------|-----------------|-------------------|
  | Inicio          | `/`             | Existente          |
  | Especialidades  | `/especialidades` | Existente        |
  | Inscripción     | `/inscripcion`  | **Falta ruta**     |
  | Institucional   | `/institucional`| **Falta ruta**     |
  | Contacto        | `/contacto`     | **Falta ruta**     |

- **Estado:** `mobileOpen` (toggle menú mobile) y `active` (link actual, init `/`).
- **Comportamiento:**
  - Barra sticky oscura `#1A1A1A` con acento naranja.
  - Logo con anillo naranja/verde y “E.E.S.T. Nro. 3 — Padua · Prov. de Buenos Aires”.
  - Links desktop con underline activo y hover por `onMouseEnter`/`onMouseLeave`.
  - Campana de notificaciones con punto verde indicador.
  - Botones “Iniciar sesión” (`navigate("/login")`) y “Registrarse”
    (`navigate("/registro")`).
  - Menú móvil hamburguesa con dropdown.
- **Usado por:** `HomePage`.

## 4.4 `src/Components/Hero/Hero.tsx`

- **Tipo:** Presentational component (sin props, sin estado).
- **Importa:** nada externo.
- **Exporta:** `Hero` por defecto.
- **Responsabilidad:** Banner de la landing mostrando la app móvil.
- **Elementos visuales:**
  - Sección oscura con anillos decorativos y líneas naranja/verde.
  - **Columna izquierda:**
    - Badge “E.E.S.T. Nro. 3 · Padua · Disponible en iOS y Android”.
    - Título “Descargá nuestra **aplicación**” (la palabra “aplicación” en naranja).
    - Lista de características: asistencia en tiempo real, boletín y libreta
      digital, comunicaciones.
    - Badges de App Store y Google Play (`href="#"`).
  - **Columna derecha (mockup de teléfono):**
    - Status bar 9:41 — encabezado escolar — saludo “¡Hola, Juan! 👋”.
    - Tarjetas de estadísticas: Promedio 8.4, Asistencia 94%.
    - Comunicado sobre evento del 25 de Mayo.
    - Lista de calificaciones de ejemplo: Matemática 7, Física 9, Inglés 8.
    - Badges flotantes: ⭐ 4.8 (+2k reviews) y +5.000 descargas.
  - **Barra inferior:** Gratuita · iOS y Android · Sin publicidad · Actualizaciones.
- **Observación:** Totalmente estático; no realiza fetch ni interactúa con
  datos reales.

## 4.5 `src/Page/HomePage/HomePage.tsx`

- **Tipo:** Página compuesta.
- **Importa:** `Navbar`, `Hero`, `Especialidades`.
- **Exporta:** `HomePage` por defecto.
- **Render:** `<> <Navbar/> <Hero/> <Especialidades/> </>`.
- **Responsabilidad:** Componer la landing pública completa.

## 4.6 `src/Page/Auth/Auth.tsx`

- **Tipo:** Página de autenticación dual (login/registro con slider).
- **Importa:** `useState` de React; `Link`, `useLocation` de
  `react-router-dom`; iconos `Eye, EyeOff, Mail, Lock, User` de
  `lucide-react`; `./Auth.css`.
- **Exporta:** `Auth` por defecto.
- **Estado:** `active: "register" | "login"` (init según pathname actual),
  `showLogin`/`showRegister` (ver visibilidad de passwords),y valores de
  formulario (`loginEmail`, `loginPass`, `regName`, `regEmail`, `regPass`).
- **Comportamiento:**
  - Contenedor fijo de **900×600** con imagen de fondo (`picsum.photos`) y
    `border-radius: 40px`.
  - Dos “vistas” que se desplazan horizontalmente según `active`:
    - **Vista 1:** CTA de Registro (izquierda) + Form de Login (derecha).
    - **Vista 2:** Form de Registro (izquierda) + CTA de Login (derecha).
  - Botones que cambian `active` entre “login” y “register”.
  - Ambos formularios sólo `console.log(...)` los valores — **no envían datos a
    ningún backend**.
  - Marca “Sentinel”, gradientes naranja/rosa y púrpura/verde, tema oscuro `#1A1A1A`.
  - Link “← Volver” a `/`.
- **Usado por:** Rutas `/login` y `/registro`.

## 4.7 `src/Page/Auth/Auth.css`

- **Tipo:** Hoja de estilos complementaria.
- **Contenido:** `.container` fixed centrado, 900×600, fondo transparente,
  `border-radius: 40px`. Complementa los estilos inline de `Auth.tsx`.

## 4.8 `src/Page/Especialidades/Especialidades.tsx`

- **Tipo:** Página informativa.
- **Importa:** `Link` de `react-router-dom`; iconos `Monitor, Cog` de
  `lucide-react`.
- **Exporta:** `Especialidades` por defecto.
- **Datos (`specialties` array):**

  | # | Especialidad                | Color     | Icono  |
  |---|-----------------------------|-----------|--------|
  | 1 | Técnico en Informática      | `#FF6B00` | Monitor |
  | 2 | Técnico en Electromecánica  | `#00FF00` | Cog     |

  **Informática:** Programación (Python/Java/JS), Bases de datos
  (MySQL/SQL Server), Redes, Soporte, Sistemas operativos, Desarrollo web.
  **Electromecánica:** Electrotécnica, Mecánica, Automatización,
  Neumática/Hidráulica, Soldadura, Dibujo técnico/CAD.
- **Comportamiento:** Tema oscuro con gradientes radiales difuminados; cada
  especialidad se renderiza como tarjeta con icono, descripción, lista de
  materias y salida laboral. Footer: 7 años de duración (3 básicos + 4
  superiores), título de Técnico. Link “← Volver” a `/`.
- **Usado por:** `HomePage` (embebido) y ruta `/especialidades` (standalone).

## 4.9 `src/Page/Login/Login.tsx` (Prototipo huérfano)

- **Tipo:** Página de login (prototipo anterior; **NO enrutada**).
- **Importa:** `useState`; `Link`; iconos `Eye, EyeOff, Mail, Lock`.
- **Exporta:** `Login` por defecto.
- **Estado:** `show`, `email`, `password`.
- **Comportamiento:** Tarjeta blanca 900×600 sobre fondo negro; panel de marca
  con lista de features y formulario con “Recordarme” y “¿Olvidaste tu
  contraseña?”. `onSubmit` imprime por consola. Links a `/registro` y `/`.
- **Observación:** Reemplazado por `Auth.tsx`. Conserva un cuadrado con
  degradado cónico en rotación (keyframe `spin`). Se puede eliminar.

## 4.10 `src/Page/Register/Register.tsx` (Prototipo huérfano)

- **Tipo:** Página de registro (prototipo anterior; **NO enrutada**).
- **Importa:** `useState`; `Link`; iconos `Eye, EyeOff, Mail, Lock, User, School`.
- **Exporta:** `Register` por defecto.
- **Estado:** `show`, `name`, `email`, `school`, `password`.
- **Comportamiento:** Mismo marco visual que `Login`. Campos: Nombre, Email,
  Institución (placeholder “E.E.S.T. Nro. 3”), Contraseña, checkbox de
  Términos. `onSubmit` imprime por consola. Links a `/login` y `/`.
- **Observación:** Reemplazado por `Auth.tsx`. Se puede eliminar.

## 4.11 `src/Css/index.css`

- **Tipo:** Estilos globales.
- **Contenido:** `@import "tailwindcss";` + `@keyframes spin` (rotación del
  degradado cónico usado en Auth/Login/Register).

## 4.12 `src/vite-env.d.ts`

- **Tipo:** Declaraciones de tipos.
- **Contenido:** `/// <reference types="vite/client" />` y declaraciones de
  módulos para `*.css`/`*.scss`/`*.sass`.