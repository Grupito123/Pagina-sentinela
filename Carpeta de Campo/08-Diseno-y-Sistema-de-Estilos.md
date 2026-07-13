# 08 — Diseño y Sistema de Estilos

## 8.1 Enfoque de estilos

- **Tailwind CSS v4** habilitado con `@import "tailwindcss";` en
  `src/Css/index.css` (sin `tailwind.config.js`).
- **Híbrido:** Tailwind utility classes + estilos `inline` (objetos `style`)
  +少量 CSSpersonalizado (`Auth.css` y un `@keyframes spin` global).
- No existe **design token** central ni tema de Tailwind extendido; los
  colores de marca se repiten como valores arbitrarios en línea.

## 8.2 Paleta de colores

| Token / uso                  | Hex            | Uso principal                            |
|------------------------------|----------------|------------------------------------------|
| Fondo oscuro principal        | `#1A1A1A`      | Secciones, navbar, auth                  |
| Fondo oscuro profundo         | `#0A0A0A`      | Detalles / contraste                      |
| Naranja (primario)            | `#FF6B00`      | “Informática”, underline activo, focos     |
| Verde (secundario)            | `#00FF00`      | “Electromecánica”, indicator campana      |
| Verde (apagado)               | `#00CC00`      | Detalles verdes                           |
| Magenta / rosa               | `#FF0080`      | Final de gradiente naranja→rosa (login)    |
| Púrpura                      | `#7C3AED`      | Inicio de gradiente registro              |
| Verde menta                  | `#00FF88`      | Final de gradiente registro               |
| Blanco                       | `#FFFFFF`      | Textos sobre fondos blancos (Login prototipo) |
| Borde sutil                  | `rgba(255,255,255,.06)` | Bordes de tarjetas            |
| Borde enfocado (login)       | `#FF6B00`      | `focus:border-[#FF6B00]`                  |

## 8.3 Gradientes

| Nombre                | Valor `linear-gradient`                              | Uso                  |
|-----------------------|------------------------------------------------------|----------------------|
| Login / Primario       | `linear-gradient(135deg, #FF6B00, #FF0080)`          | Botones de login     |
| Registro / Secundario  | `linear-gradient(135deg, #7C3AED, #00FF88)`          | Botones de registro  |
| Decorativo radial      | `radial-gradient(circle, #FF6B0011, transparent 60%)` | Blurs decorativos    |
| Degradado cónico (rotación) | `conic-gradient(...)` con `@keyframes spin`     | Cuadrado decorativo (Login/Auth) |

## 8.4 Tipografías

- **Familia referenciada:** `Barlow` / `Barlow Condensed` (vista en `Hero.tsx`
  en el font stack).
- **No importada:** no hay `@import url(...)` ni `@font-face` que cargue
  Barlow, por lo que actualmente se resuelve a la sans-serif por defecto del
  sistema. **TODO:** añadir la carga de la fuente (Google Fonts o
  `@fontsource/barlow`) para respetar el diseño.

## 8.5 Radios y formas

- `rounded-2xl` (16px) para tarjetas medianas.
- `rounded-[40px]` para contenedor de Auth (900×600).
- `border-radius: 40px` explícito en `Auth.css`.
- Anillos decorativos y líneas finas (naranja/verde) en Hero.

## 8.6 Iconografía

- **Librería:** `lucide-react` v1.14.0.
- **Iconos usados:**
  - Navbar: `Menu`, `X`, `Bell`, `LogIn`, `UserPlus`.
  - Auth / Login / Register: `Eye`, `EyeOff`, `Mail`, `Lock`, `User`, `School`.
  - Especialidades: `Monitor` (Informática), `Cog` (Electromecánica).

## 8.7 Componentes UI recurrentes

| Componente             | Apariencia                                                              |
|------------------------|-------------------------------------------------------------------------|
| Botón primario          | Gradiente naranja→rosa, texto blanco, hover leve                        |
| Botón secundario        | Gradiente púrpura→verde menta                                            |
| Tarjeta                | Fondo `#1A1A1A`, borde `rgba(255,255,255,.06)`, `rounded-2xl`, padding interno |
| Input                  | Borde sutil, foco `#FF6B00`, icono a la izquierda                        |
| Link “Volver”          | Pequeño, arriba a la izquierda, con flecha “←”                          |
| Mockup teléfono         | Marco border, status bar 9:41, tarjetas internas simulando la app móvil  |

## 8.8 Animaciones

| Nombre         | Definición                                           | Uso                         |
|----------------|------------------------------------------------------|-----------------------------|
| `spin` (keyframe) | Rotación 0° → 360°                                    | Cuadrado de degradado cónico en Auth/Login |

## 8.9 Guía visual resumida (para diseño)

- **Fondo:** oscuro `#1A1A1A` (sea landing, navbar y auth).
- **Acento por especialidad:** Informática → naranja; Electromecánica → verde.
- **Acciones primarias:** gradiente naranja→rosa.
- **Acciones de creación/registro:** gradiente púrpura→verde menta.
- **Textos:** blanco sobre oscuro, gris-oscuro sobre blanco.
- **Tarjetas:** redondeadas, bordes sutiles, fondo casi negro.
- **Iconografía:** lucide-react, lineal, monocromática según contexto.

## 8.10 TODOs de diseño

- Cargar la fuente **Barlow** (Google Fonts o `@fontsource`).
- Unificar tokens en un tema Tailwind extendido (`@theme` de Tailwind v4) en
  lugar de repetir hex inline.
- Corregir branding: `index.html` usa `lang="en"` y título técnico.
- Agregar estados de error / éxito accesibles en formularios (no sólo consola).
- Definir estilos para futuros dashboards por rol (alumno/docente/preceptor/admin).