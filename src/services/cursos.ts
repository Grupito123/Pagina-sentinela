/**
 * Cursos — espejo web de `src/services/firestore/courses.js` de App-Sentinela.
 * Solo lectura: el alta y la edición de cursos las hace el cuerpo docente
 * desde la app móvil.
 */
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { COLLECTIONS } from "../Firebase/collections";
import { ROLES, type Rol } from "../Firebase/roles";

export interface Curso {
  id: string;
  nombre: string;
  anio: number | null;
  turno: string | null;
  preceptorIds: string[];
  docenteIds: string[];
  materiaIds: string[];
  activo: boolean;
}

function mapDoc(item: { id: string; data: () => Record<string, unknown> }): Curso {
  const d = item.data();
  return {
    id: item.id,
    nombre: String(d.nombre ?? item.id),
    anio: typeof d.anio === "number" ? d.anio : null,
    turno: typeof d.turno === "string" ? d.turno : null,
    preceptorIds: Array.isArray(d.preceptorIds) ? (d.preceptorIds as string[]) : [],
    docenteIds: Array.isArray(d.docenteIds) ? (d.docenteIds as string[]) : [],
    materiaIds: Array.isArray(d.materiaIds) ? (d.materiaIds as string[]) : [],
    activo: d.activo !== false,
  };
}

/**
 * Cursos que el usuario puede operar, replicando `esPreceptorDelCurso` y
 * `esDocenteDelCurso` de `firestore.rules`. Los roles de gestión ven todos.
 */
export async function obtenerCursosOperables(uid: string, rol: Rol): Promise<Curso[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.COURSES), where("activo", "==", true)),
  );
  const cursos = snapshot.docs.map(mapDoc);

  if (rol === ROLES.ADMIN || rol === ROLES.DIRECTIVO) return cursos;

  return cursos.filter((c) => c.preceptorIds.includes(uid) || c.docenteIds.includes(uid));
}

/** Curso del alumno, para validar que su marca corresponde a la sesión abierta. */
export async function obtenerCursoDeAlumno(alumnoId: string): Promise<string | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.STUDENTS, alumnoId));
  if (!snapshot.exists()) return null;
  const cursoId = snapshot.data().cursoId;
  return typeof cursoId === "string" ? cursoId : null;
}
