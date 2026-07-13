# 09 — Estado de Implementación y TODOs

## 9.1 Resumen de avance

| Área                             | Estado        | Comentario                                            |
|----------------------------------|---------------|--------------------------------------------------------|
| Landing pública (Navbar/Hero)    | ✅ Implementado | UI estática funcional                                 |
| Página de especialidades         | ✅ Implementado | Datos hardcodeados                                    |
| Pantalla de login/registro (Auth)| ⚠️ UI sólo     | Sin backend, `console.log` únicamente                  |
| Prototipos Login/Register        | ⚠️ Huérfanos   | No enrutados                                          |
| Routing                          | ⚠️ Parcial      | Faltan 3 rutas del navbar + ruta 404                  |
| Autenticación real               | ❌ No existe    | Sin Firebase Auth                                     |
| Firestore / datos                | ❌ No existe    | Sin servicios ni SDK                                   |
| Roles (admin/docente/preceptor/alumno) | ❌ No existe | Sin lógica de roles                              |
| Rutas protegidas                 | ❌ No existe    | Sin wrapper de auth                                   |
| Escaneo QR / código de barras    | ❌ No existe    | Núcleo del sistema, no iniciado                       |
| Determinación presente/tarde/ausente | ❌ No existe | Sin lógica de horarios                                |
| Dashboard alumno                 | ❌ No existe    | Hero simula una vista, sin datos reales              |
| Dashboard docente                | ❌ No existe    | —                                                     |
| Dashboard preceptor              | ❌ No existe    | —                                                     |
| Dashboard admin                  | ❌ No existe    | —                                                     |
| Calificaciones                   | ❌ No existe    | —                                                     |
| Horarios                         | ❌ No existe    | —                                                     |
| Reportes                         | ❌ No existe    | —                                                     |
| Comunicados                      | ❌ No existe    | Hero simula uno, sin persistencia                     |
| Tests                            | ❌ No existe    | Sin runner ni archivos de test                        |
| CI/CD                            | ❌ No existe    | Sin pipeline                                          |
| Variables de entorno (.env)      | ❌ No existe    | Necesarias para Firebase                              |

## 9.2 Lista de TODOs detallada

### Backend / Firebase (prioridad crítica)

- [ ] Instalar `firebase` (`npm install firebase`).
- [ ] Crear `src/services/firebase.ts` con `initializeApp` desde variables de entorno.
- [ ] Crear `.env.example` con `VITE_FIREBASE_*` keys.
- [ ] Implementar `AuthContext` / `AuthProvider` con `onAuthStateChanged`.
- [ ] Implementar servicios de Firestore por colección (`users`, `courses`,
      `attendance`, `grades`, `schedules`, `communications`).
- [ ] Configurar **Security Rules** por rol.
- [ ] Conectar `Auth.tsx` a Firebase Auth (reemplazar `console.log`).

### Roles y permisos (prioridad alta)

- [ ] Definir tipos compartidos (`src/types/`): `Role`, `User`,
      `AttendanceStatus`, `Course`, etc.
- [ ] Crear wrapper `<ProtectedRoute requiredRoles={[...]} />`.
- [ ] Agregar selector de rol en el registro (o rol por defecto `alumno` y
      promoción a otros roles vía admin).
- [ ] Persistir rol en Firestore y validarlo en reglas.
- [ ] Redirigir post-login al dashboard según rol.

### Dashboards por rol (prioridad alta)

- [ ] `/app/alumno`: asistencias, notas, horarios, reportes, comunicados.
- [ ] `/app/docente`: asistencia diaria del curso, carga de calificaciones.
- [ ] `/app/preceptor`: control general de todos los cursos, registro de
      asistencia manual/escaneo.
- [ ] `/app/admin`: gestión y validación de usuarios, alta de cursos, reportes globales.

### Núcleo: asistencia (prioridad crítica)

- [ ] Diseñar credencial del alumno (QR / código de barras) generada por el sistema.
- [ ] Vista de punto de acceso (página web receptora del lector HID).
- [ ] Lógica de cálculo de estado (presente/tarde/ausente) según horario.
- [ ] Persistencia en `attendance/{id}` con `scanTime` y `entryPoint`.
- [ ] Soporte de **múltiples puntos de acceso** simultáneos.

### Rutas faltantes (prioridad alta)

- [ ] `/inscripcion` (link visible en Navbar).
- [ ] `/institucional` (link visible en Navbar).
- [ ] `/contacto` (link visible en Navbar).
- [ ] Ruta 404 catch-all.
- [ ] `/recuperar-contrasena`.

### Limpieza / consistencia (prioridad media)

- [ ] Eliminar o reubicar `Login.tsx` y `Register.tsx` (prototipos huérfanos).
- [ ] Eliminar `src/assets/hero.png` (sin usar) o usarlo realmente.
- [ ] Unificar branding: `package.json`/`index.html` usan `sentinel-segurity-web`
      (typo), la UI usa “Sentinel” / “E.E.S.T. Nro. 3”.
- [ ] Cambiar `index.html` a `lang="es"` y título descriptivo en español.
- [ ] Reescribir `README.md` con información real del proyecto.
- [ ] Eliminar `.hintrc` (webhint no instalado) o añadir webhint a devDependencies.

### Diseño (prioridad media)

- [ ] Cargar la fuente **Barlow** (Google Fonts / `@fontsource/barlow`).
- [ ] Centralizar colores en `@theme` de Tailwind v4 (design tokens).
- [ ] Agregar estados de error/éxito accesibles en formularios.
- [ ] Reemplazar `console.log` por validación visible en la UI.

### Calidad / DevOps (prioridad media)

- [ ] Configurar tests (Vitest + Testing Library).
- [ ] Agregar pipeline CI (GitHub Actions: lint, typecheck, build, test).
- [ ] Añadir `AGENTS.md` o documentación interna del repo.
- [ ] Considerar alias de ruta en `vite.config.ts` y `tsconfig.app.json`
      (`@/components`, `@/pages`, etc.) para imports más limpios.

## 9.3 KPIs de avance sugeridos

- **Front-end público:** 100% (landing + auth UI).
- **Front-end de roles:** 0%.
- **Backend (Firebase):** 0%.
- **Núcleo funcional (asistencia):** 0%.
- **Infraestructura / DevOps:** 0%.

**Avance global estimado respecto del `PROYECTO.MD`: ~10-15%** (sólo escenificaciones publicitativas y de autenticación visual).