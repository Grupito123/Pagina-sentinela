# 07 — Backend y Firebase

## 7.1 Estado actual: NINGUNA integración

> ⚠️ La integración con Firebase **no existe** en el repositorio actual.

- `firebase` **no está** en `package.json` (ni en `dependencies` ni en
  `devDependencies`).
- No existe ningún archivo de inicialización (`firebase.ts`,
  `firebaseConfig.ts`, etc.).
- No hay llamadas a `firebase/auth`, `firebase/firestore`, `firebase/app`,
  `firebase/analytics` ni ninguna API de Firebase.
- No hay `.env` ni `.env.example` con claves de configuración.
- No hay `fetch`, `axios` ni ninguna capa de servicios.
- Todos los `onSubmit` de los formularios sólo hacen `console.log` de los
  valores ingresados.

## 7.2 Lo que la especificación requiere de Firebase (`PROYECTO.MD`)

- **Base de datos en la nube** (implícitamente Firestore) para guardar:
  - Usuarios (alumnos, docentes, preceptores, administradores).
  - Registros de asistencia (timestamp de ingreso + estado calculado).
  - Calificaciones.
  - Horarios.
  - Reportes.
  - Comunicados.
- **Acceso multi-dispositivo** (leer desde web, móvil, múltiples puntos de
  escaneo).
- **Sincronización en tiempo real** de los registros de ingreso.
- **Seguridad:** validación de usuarios, control por roles y credenciales
  protegidas (→ Firebase Authentication + Security Rules).

## 7.3 Modelo de datos planteado (propuesta para la carpeta de campo)

El siguiente modelo es una **propuesta** basada en la especificación; no está
implementado. Sirve como referencia para el próximo hito de desarrollo.

### Colecciones Firestore (propuesta)

```
users/{uid}
  ├─ name: string
  ├─ email: string
  ├─ role: 'admin' | 'docente' | 'preceptor' | 'alumno'
  ├─ dni: string
  ├─ courseIds: string[]          (sólo alumnos / docentes)
  ├─ specialty: string            (sólo alumnos)
  ├─ status: 'activo' | 'inactivo'
  ├─ createdAt: Timestamp
  └─ validatedBy: string | null   (admin que validó la cuenta)

courses/{courseId}
  ├─ name: string                 (ej. "5° A Informática")
  ├─ specialty: 'informatica' | 'electromecanica'
  ├─ year: number
  ├─ preceptorId: string
  └─ studentIds: string[]

schedules/{scheduleId}
  ├─ courseId: string
  ├─ day: 'Lunes' | 'Martes' | ...
  ├─ startTime: Timestamp / HH:mm
  ├─ endTime: Timestamp / HH:mm
  ├─ subjectId: string
  └─ teacherId: string

attendance/{attendanceId}
  ├─ studentId: string
  ├─ courseId: string
  ├─ date: Timestamp              (día)
  ├─ scanTime: Timestamp          (momento del escaneo)
  ├─ status: 'presente' | 'tarde' | 'ausente'
  ├─ entryPoint: string           (punto de acceso usado)
  ├─ method: 'qr' | 'barcode'
  └─ calculatedBy: 'system'摒弃
  │
grades/{gradeId}
  ├─ studentId: string
  ├─ courseId: string
  ├─ subjectId: string
  ├─ term: number                 (trimestre 1/2/3)
  ├─ value: number
  ├─ teacherId: string
  └─ createdAt: Timestamp

subjects/{subjectId}
  ├─ name: string
  └─ specialty: string

communications/{commId}
  ├─ title: string
  ├─ body: string
  ├─ targetCourseIds: string[] | 'all'
  ├─ createdAt: Timestamp
  └─ authorId: string

reportConfig / reports ...        (reportes agregados a definir)
```

> Notar: `attendance.calculatedBy` debe ser `'system'` (sustituir el typo por
> la cadena literal). El campo `entryPoint` soporta la premisa de “múltiples
> puntos de acceso”.

## 7.4 Reglas de seguridad (propuesta)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function isSignedIn() { return request.auth != null; }
    function role() { return get(/databases/$(db)/documents/users/$(request.auth.uid)).data.role; }
    function isAdmin()  { return isSignedIn() && role() == 'admin'; }
    function isPreceptor() { return isSignedIn() && role() == 'preceptor'; }
    function isDocente()   { return isSignedIn() && role() == 'docente'; }

    match /users/{uid} {
      allow read: if isSignedIn();
      allow create: if true;                  // registro abierto
      allow update, delete: if isAdmin() || request.auth.uid == uid;
    }

    match /attendance/{id} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();          // preceptor / admin / punto de acceso
      allow update, delete: if isAdmin() || isPreceptor();
    }

    match /grades/{id} {
      allow read: if isSignedIn();
      allow write: if isAdmin() || isDocente();
    }

    // ...extender según reglas por colección
  }
}
```

## 7.5 Suministros / hardware no cubiertos

El proyecto menciona **lectores de código de barras y QR** conectados a
computadoras. Esos lectores actúan como teclados (HID) y disparan el ingreso
escaneando un documento del alumno. Se debe definir:

- **Generación de credenciales** (QR / código de barras) por alumno.
- **Endpoints de escaneo** (una vista web por punto de acceso que recibe el
  código y registra `scanTime`).
- **Lógica de cálculo de estado** (presente/tarde/ausente) según el horario del
  curso correspondiente al alumno.

## 7.6 Pasos para integrar Firebase

1. `npm install firebase`.
2. Crear `src/services/firebase.ts` con `initializeApp` usando variables de
   `.env` (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, ...).
3. Crear `src/services/auth.ts` con `signInWithEmailAndPassword`,
   `createUserWithEmailAndPassword`, `signOut`, `onAuthStateChanged`.
4. Crear `src/context/AuthContext.tsx` con estado de sesión y rol.
5. Crear `src/services/firestore.ts` con helpers por colección.
6. Añadir archivo `.env.example` con las claves requeridas.
7. Configurar reglas de seguridad en la consola de Firebase.
8. Reemplazar los `console.log` de `Auth.tsx` con llamadas reales a los
   servicios y redirigir según rol.