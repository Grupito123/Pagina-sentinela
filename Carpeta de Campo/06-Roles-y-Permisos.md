# 06 — Roles y Permisos

## 6.1 Modelo de roles previsto (según `PROYECTO.MD`)

La especificación describe un sistema multi-rol con control de accesos por
rol. Los cuatro roles planificados son:

| Rol          | Nombre       | Capacidades previstas (PROYECTO.MD)                                      |
|--------------|--------------|--------------------------------------------------------------------------|
| `admin`      | Administrador| Acceso total; validación y gestión de usuarios                            |
| `docente`    | Docente      | Cargar calificaciones; observar la asistencia diaria                     |
| `preceptor`  | Preceptor    | Control general de todos los cursos                                      |
| `alumno`     | Alumno       | Visualizar sus asistencias, notas, horarios y reportes (desde la app)     |

## 6.2 Matriz de permisos prevista (detalle ampliado)

Esta matriz se infiere de la especificación y de los mocks visibles en la UI
(el Hero simula datos que vería un **alumno** — Promedio, Asistencia,
Comunicados, Calificaciones).

| Funcionalidad                         | Admin | Preceptor | Docente | Alumno |
|---------------------------------------|:-----:|:---------:|:-------:|:------:|
| Iniciar sesión / Registrarse          | Sí    | Sí        | Sí      | Sí     |
| Validar y gestionar usuarios           | Sí    | —         | —       | —      |
| Asignar / revocar roles               | Sí    | —         | —       | —      |
| Gestión de cursos y horarios          | Sí    | Sí        | —       | —      |
| Control de asistencia de todos los cursos | Sí | Sí        | Lectura | —      |
| Registro de asistencia (escaneo QR)   | Sí (punto de acceso) | Sí | — | — || Ver asistencia diaria de su curso      | Sí    | Sí        | Sí      | —      |
| Ver propia asistencia                 | Sí    | Sí        | Sí      | Sí     |
| Cargar calificaciones                 | Sí    | —         | Sí      | —      |
| Ver calificaciones / boletín          | Sí    | Sí        | Sí (su curso) | Sí (propias) |
| Ver horarios                          | Sí    | Sí        | Sí      | Sí     |
| Ver reportes                          | Sí    | Sí        | Sí (su curso) | Sí (propios) |
| Recibir comunicados                   | Sí    | Sí        | Sí      | Sí     |

## 6.3 Estados de asistencia planificados

| Estado     | Código / etiqueta | Condición (según horario)             |
|------------|-------------------|----------------------------------------|
| Presente   | `presente`        | Ingreso dentro del horario permitido    |
| Tarde      | `tarde`           | Ingreso pasado el horario permitido     |
| Ausente    | `ausente`         | Sin registro de ingreso                  |

## 6.4 Estado de implementación

> ⚠️ **Roles NO implementados en el código.**

- No existe tipo/unión de roles (`'admin' | 'docente' | ...`).
- No existe `AuthProvider` / `AuthContext` ni hook `useAuth`.
- No existen rutas protegidas ni redirección según rol.
- No hay dashboard para ningún rol (alumno, docente, preceptor, admin).
- El formulario de registro de `Register.tsx` incluye un campo `school`
  (institución) pero **no un selector de rol**.
- El Hero simula una vista de alumno (“¡Hola, Juan!”, Promedio, Asistencia,
  Calificaciones) pero esos datos están hardcodeados y no reflejan un rol
  real.

## 6.5 Recomendaciones de implementación

1. **Definir tipos compartidos** en `src/types/`:
   ```ts
   export type Role = 'admin' | 'docente' | 'preceptor' | 'alumno';
   export interface User { uid: string; name: string; email: string; role: Role; ... }
   export type AttendanceStatus = 'presente' | 'tarde' | 'ausente';
   ```
2. **Crear un `AuthContext`** (o usar Firebase Auth + `onAuthStateChanged`)
   que exponga `{ user, role, signIn, signOut, signUp }`.
3. **Crear un wrapper `<ProtectedRoute requiredRoles={[...]}>`** que
   redirija según el rol del usuario autenticado.
4. **Distinguir dashboards por rol**:
   - `/app/alumno` para `alumno`.
   - `/app/docente` para `docente`.
   - `/app/preceptor` para `preceptor`.
   - `/app/admin` para `admin`.
5. **Persistir el rol en Firestore** (campo `role` en el documento del
   usuario) y validarlo con **Firebase Security Rules** (no confiar sólo en
   el cliente).