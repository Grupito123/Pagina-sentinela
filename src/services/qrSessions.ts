/**
 * Sesiones QR — espejo web de `src/services/firestore/qrSessions.js` de
 * App-Sentinela, sobre la misma colección `sesionesQR` del proyecto
 * `centinela-2b390`.
 *
 * El código del QR NO es un secreto embebido en el frontend: es un valor
 * aleatorio que vive en el documento de la sesión. Quien puede usar el QR
 * es el usuario autenticado que cumple las reglas de Firestore.
 */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { COLLECTIONS } from "../Firebase/collections";

/** Alfabeto sin caracteres ambiguos (sin I, O, 0, 1). Mismo criterio que helpers.js:167. */
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function randomCode(length = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return code;
}

export interface SesionQR {
  id: string;
  cursoId: string;
  materiaId: string | null;
  creadoPor: string;
  fecha: Timestamp;
  fechaKey: string;
  horaInicio: Timestamp;
  horaFin: Timestamp | null;
  codigo: string;
  activo: boolean;
  ubicacion: { aula: string; lat: number; lng: number; radio: number } | null;
  creadoEn?: Timestamp;
  cerradoEn?: Timestamp;
}

/** "YYYY-MM-DD" en hora local, igual que `toDateKey` del móvil. */
export function toDateKey(fecha: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
}

function mapDoc(item: { id: string; data: () => Record<string, unknown> }): SesionQR {
  return { id: item.id, ...(item.data() as Omit<SesionQR, "id">) };
}

export interface CrearSesionQRInput {
  cursoId: string;
  materiaId?: string | null;
  creadoPor: string;
  horaInicio?: Date;
  duracionMinutos?: number;
  ubicacion?: SesionQR["ubicacion"];
  activo?: boolean;
  codigo?: string;
}

/** Crea `sesionesQR/{id}`. Requiere rol docente con permiso sobre el curso. */
export async function crearSesionQr(input: CrearSesionQRInput): Promise<SesionQR> {
  const inicio = input.horaInicio ?? new Date();
  const duracion = input.duracionMinutos ?? 15;
  const fin = new Date(inicio.getTime() + duracion * 60 * 1000);
  const inicioDia = new Date(inicio);
  inicioDia.setHours(0, 0, 0, 0);
  const codigo = (input.codigo ?? randomCode()).toUpperCase();

  const ref = await addDoc(collection(db, COLLECTIONS.QR_SESSIONS), {
    cursoId: input.cursoId,
    materiaId: input.materiaId ?? null,
    creadoPor: input.creadoPor,
    fecha: Timestamp.fromDate(inicioDia),
    fechaKey: toDateKey(inicio),
    horaInicio: Timestamp.fromDate(inicio),
    horaFin: Timestamp.fromDate(fin),
    codigo,
    activo: input.activo ?? true,
    ubicacion: input.ubicacion ?? null,
    creadoEn: serverTimestamp(),
  });

  return {
    id: ref.id,
    cursoId: input.cursoId,
    materiaId: input.materiaId ?? null,
    creadoPor: input.creadoPor,
    fecha: Timestamp.fromDate(inicioDia),
    fechaKey: toDateKey(inicio),
    horaInicio: Timestamp.fromDate(inicio),
    horaFin: Timestamp.fromDate(fin),
    codigo,
    activo: input.activo ?? true,
    ubicacion: input.ubicacion ?? null,
  };
}

/**
 * Rota el código de una sesión existente, conservando su `id`.
 * Las reglas limitan este cambio a quien ya opera esa sesión.
 */
export async function rotarCodigoSesion(sesionId: string): Promise<string> {
  const codigo = randomCode();
  await updateDoc(doc(db, COLLECTIONS.QR_SESSIONS, sesionId), {
    codigo,
    actualizadoEn: serverTimestamp(),
  });
  return codigo;
}

export async function obtenerSesionQr(sesionId: string): Promise<SesionQR | null> {
  if (!sesionId) return null;
  const snapshot = await getDoc(doc(db, COLLECTIONS.QR_SESSIONS, sesionId));
  return snapshot.exists() ? mapDoc(snapshot) : null;
}

export async function obtenerSesionPorCodigo(codigo: string): Promise<SesionQR | null> {
  if (!codigo) return null;
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.QR_SESSIONS),
      where("codigo", "==", String(codigo).toUpperCase()),
      limit(1),
    ),
  );
  return snapshot.empty ? null : mapDoc(snapshot.docs[0]);
}

export async function obtenerSesionesActivas(cursoId?: string): Promise<SesionQR[]> {
  const filtros = [where("activo", "==", true)];
  if (cursoId) filtros.push(where("cursoId", "==", cursoId));
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.QR_SESSIONS), ...filtros, where("horaInicio", "<=", Timestamp.now()), limit(25)),
  );
  return snapshot.docs.map(mapDoc);
}

export function cerrarSesionQr(sesionId: string): Promise<void> {
  return updateDoc(doc(db, COLLECTIONS.QR_SESSIONS, sesionId), {
    activo: false,
    cerradoEn: serverTimestamp(),
  });
}

/** Motivo por el que una sesión ya no acepta marcas. */
export type MotivoSesionCerrada = "inexistente" | "inactiva" | "vencida" | "fueraDeHorario";

/** Valida la sesión en el cliente; las reglas vuelven a validarla en el servidor. */
export function estadoSesion(sesion: SesionQR | null, ahora = Date.now()): MotivoSesionCerrada | null {
  if (!sesion) return "inexistente";
  if (!sesion.activo) return "inactiva";
  const inicio = sesion.horaInicio?.toMillis?.() ?? 0;
  const fin = sesion.horaFin?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
  if (ahora < inicio) return "fueraDeHorario";
  if (ahora > fin) return "vencida";
  return null;
}
