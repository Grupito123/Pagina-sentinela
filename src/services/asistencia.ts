/**
 * Asistencias — espejo web de `src/services/firestore/attendance.js` de
 * App-Sentinela, sobre la misma colección `asistencias` del proyecto
 * `centinela-2b390`.
 *
 * El `alumnoId` SIEMPRE sale del perfil del usuario autenticado
 * (`usuarios/{UID}.alumnoId`). Nunca de un campo que el usuario pueda escribir
 * a mano: las reglas de Firestore vuelven a exigir
 * `alumnoId == perfil().data.alumnoId`.
 *
 * Los estados son los del modelo compartido (`helpers.js`):
 * presente · ausente · tarde · justificado.
 */
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { COLLECTIONS } from "../Firebase/collections";

export const ESTADOS = {
  PRESENTE: "presente",
  AUSENTE: "ausente",
  TARDE: "tarde",
  JUSTIFICADO: "justificado",
} as const;

export type EstadoAsistencia = (typeof ESTADOS)[keyof typeof ESTADOS];

export const METODOS = {
  QR: "qr",
  MANUAL: "manual",
} as const;

export interface Asistencia {
  id: string;
  alumnoId: string;
  cursoId: string;
  materiaId: string | null;
  horarioId: string | null;
  fechaKey: string;
  hora: Timestamp | null;
  estado: EstadoAsistencia;
  observaciones: string;
  registradoPor: string;
  metodoRegistro: string;
  sesionQRId: string | null;
}

export function toDateKey(fecha: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
}

function inicioDelDia(fecha: Date): Date {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * ID determinista, idéntico al del móvil: `{alumnoId}_{fechaKey}_{materiaId|general}`.
 * Como el mismo alumno + misma materia + mismo día produce siempre el mismo ID,
 * un segundo escaneo actualiza el documento en lugar de duplicarlo.
 */
export function asistenciaDocId(params: {
  alumnoId: string;
  fecha: Date;
  materiaId?: string | null;
}): string {
  const clave = toDateKey(params.fecha);
  return `${params.alumnoId}_${clave}_${params.materiaId ?? "general"}`;
}

export interface RegistrarDesdeAlumnoInput {
  /** Viene del perfil (`useAuth().perfil.alumnoId`), no de la interfaz. */
  alumnoId: string;
  /** Curso del alumno, resuelto desde `alumnos/{alumnoId}`. */
  cursoId: string;
  uid: string;
  sesionQRId: string;
  estado?: EstadoAsistencia;
  materiaId?: string | null;
  observaciones?: string;
}

/**
 * Registra la asistencia propia del alumno a partir de una sesión QR activa.
 * Espeja `registrarDesdeAlumno` de `attendance.js:243`.
 *
 * Create y update van separados a propósito. Con `setDoc(..., { merge: true })`
 * en los dos casos, cada reescaneo reescribía `creadoEn` con un
 * `serverTimestamp()` nuevo (la marca de creación original se perdía) y las
 * reglas tenían que admitir ese campo como modificable. Con este split el
 * documento ya creado solo recibe `hora`, `estado` y `actualizadoEn`, que es
 * exactamente lo que `camposActualizablesAlumno()` permite.
 *
 * Lanza `permission-denied` si las reglas todavía no habilitan el alta por
 * parte del alumno: es el comportamiento esperado hasta que se desplieguen
 * las reglas de `asistencias`.
 */
export async function registrarDesdeAlumno(input: RegistrarDesdeAlumnoInput): Promise<string> {
  const ahora = new Date();
  const clave = toDateKey(ahora);
  const id = asistenciaDocId({
    alumnoId: input.alumnoId,
    fecha: ahora,
    materiaId: input.materiaId,
  });
  const ref = doc(db, COLLECTIONS.ATTENDANCE, id);

  try {
    await setDoc(ref, {
      alumnoId: input.alumnoId,
      cursoId: input.cursoId,
      materiaId: input.materiaId ?? null,
      horarioId: null,
      fecha: Timestamp.fromDate(inicioDelDia(ahora)),
      fechaKey: clave,
      hora: Timestamp.fromDate(ahora),
      estado: input.estado ?? ESTADOS.PRESENTE,
      observaciones: input.observaciones ?? "",
      registradoPor: input.uid,
      metodoRegistro: METODOS.QR,
      sesionQRId: input.sesionQRId,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    });
  } catch (err) {
    // El SDK web mapea ALREADY_EXISTS a 'aborted'. Si ya existe la marca de
    // hoy para esta materia, solo se actualiza lo que el alumno puede mover.
    if (!yaExiste(err)) throw err;
    await updateDoc(ref, {
      hora: Timestamp.fromDate(ahora),
      estado: input.estado ?? ESTADOS.PRESENTE,
      actualizadoEn: serverTimestamp(),
    });
  }

  return id;
}

/** `setDoc` sin merge sobre un documento existente. */
function yaExiste(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  return e?.code === "aborted" || /already exists/i.test(e?.message ?? "");
}

/** Asistencias del alumno en el día, para pintar el estado en la interfaz. */
export async function obtenerMisAsistenciasHoy(alumnoId: string, fecha = new Date()): Promise<Asistencia[]> {
  const inicio = inicioDelDia(fecha);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.ATTENDANCE),
      where("alumnoId", "==", alumnoId),
      where("fecha", ">=", Timestamp.fromDate(inicio)),
      where("fecha", "<", Timestamp.fromDate(fin)),
    ),
  );

  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Asistencia, "id">) }));
}

/**
 * Asistencias del día para un curso. Es la vista del docente, que las reglas
 * habilitan con `puedeOperarCurso`.
 */
export async function obtenerAsistenciasPorCurso(cursoId: string, fecha = new Date()): Promise<Asistencia[]> {
  const inicio = inicioDelDia(fecha);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.ATTENDANCE),
      where("cursoId", "==", cursoId),
      where("fecha", ">=", Timestamp.fromDate(inicio)),
      where("fecha", "<", Timestamp.fromDate(fin)),
    ),
  );

  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Asistencia, "id">) }));
}

export function formatTime(ts: Timestamp | null): string {
  if (!ts) return "—";
  const d = ts.toDate();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
