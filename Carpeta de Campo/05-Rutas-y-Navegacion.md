# 05 — Rutas y Navegación

## 5.1 Mapa de rutas definidas

Definidas en `src/Routes/app.routes.tsx` con `BrowserRouter` de React Router 7:

| Path              | Componente rendered         | Modo / Nota                  | Estado     |
|-------------------|-----------------------------|------------------------------|------------|
| `/`               | `HomePage`                  | Landing pública              | Funciona   |
| `/login`          | `Auth`                      | Modo login                   | Funciona (mock) |
| `/registro`       | `Auth`                      | Modo registro                | Funciona (mock) |
| `/especialidades` | `Especialidades`            | Página standalone            | Funciona   |

## 5.2 Enlaces de nuestra en la UI

### Navbar (`src/Components/Navbar/Navbar.tsx`)

| Etiqueta          | `href`           | Existe ruta? | Acción al click             |
|-------------------|------------------|--------------|------------------------------|
| Inicio            | `/`              | Sí           | Navega a la landing          |
| Especialidades    | `/especialidades`| Sí           | Navega a Especialidades      |
| Inscripción       | `/inscripcion`   | **No**       | `navigate` pero no hay `Route` |
| Institucional     | `/institucional` | **No**       | `navigate` pero no hay `Route` |
| Contacto          | `/contacto`      | **No**       | `navigate` pero no hay `Route` |
| Iniciar sesión    | — (botón)        | Sí           | `navigate("/login")`         |
| Registrarse       | — (botón)        | Sí           | `navigate("/registro")`      |

> **Problema:** 3 de los 5 links del menú (`Inscripción`, `Institucional`,
> `Contacto`) apuntan a rutas inexistentes. Hacer click no renderiza nada (no
> hay catch-all) y deja la página en blanco.

### Enlaces dentro de páginas

| Origen                | Destino       | Existe ruta? |
|-----------------------|---------------|--------------|
| `Auth.tsx` “← Volver” | `/`           | Sí           |
| `Login.tsx`           | `/registro`   | Sí (Auth)    |
| `Login.tsx` “← Volver”| `/`           | Sí           |
| `Register.tsx`        | `/login`      | Sí (Auth)    |
| `Register.tsx` “← Volver” | `/`        | Sí           |
| `Especialidades.tsx` “← Volver” | `/`  | Sí           |
| `Hero.tsx` App Store / Google Play | `href="#"` | (placeholder) |

> Login.tsx y Register.tsx son prototipos no enrutados; sus enlaces sólo
> aplican si se reinstauran.

## 5.3 Rutas faltantes / pendientes

| Ruta planificada      | Componente sugerido      | Prioridad |
|-----------------------|--------------------------|-----------|
| `/inscripcion`        | `Inscripcion`            | Alta (link visible) |
| `/institucional`      | `Institucional`          | Alta (link visible) |
| `/contacto`           | `Contacto`               | Alta (link visible) |
| `/app/alumno`          | `AlumnoDashboard`         | Alta (rol alumno) |
| `/app/docente`         | `DocenteDashboard`        | Alta (rol docente) |
| `/app/preceptor`       | `PreceptorDashboard`     | Alta (rol preceptor) |
| `/app/admin`           | `AdminDashboard`         | Alta (rol admin) |
| `/app/asistencia`      | `Asistencia` (escaneo QR)| Crítica (núcleo del sistema) |
| `*` (catch-all 404)   | `NotFound`               | Media       |
| `/recuperar-contrasena`| `ForgotPassword`         | Media       |

## 5.4 Observaciones de navegación

- **No hay rutas protegidas.** No existe un wrapper `<ProtectedRoute/>` ni
  verificación de sesión antes de renderizar una ruta.
- **No existe ruta 404.** Cualquier URL no definida renderiza una página en
  blanco.
- **`/login` y `/registro` comparten componente:** `Auth.tsx` discrimina el
  modo con `useLocation().pathname`, no con parámetros de ruta. Cambiar de
  login a registro dentro de la página usa estado interno (`active`), no
  navegación.
- **No hay redirección post-login** porque no hay autenticación real.