import { createContext } from "react";
import type { User } from "firebase/auth";

/**
 * Perfil de la cuenta autenticada, normalizado a una sola forma.
 *
 * El documento de origen depende del tipo de persona (Opción B):
 *   - `usuarios/{uid}` : staff y cuentas antiguas. `rol` es el almacenado.
 *   - `alumnos/{uid}`  : alumno del registro público. `rol` es "alumno".
 *   - `padres/{uid}`   : padre/madre del registro público. `rol` es "padre".
 *
 * `AuthProvider` lo resuelve en ese orden y siempre devuelve esta misma forma,
 * para que la UI y los guards no tengan que saber de qué colección viene.
 * Nunca incluye contraseñas: la contraseña vive únicamente en Firebase Auth.
 */
export interface UsuarioPerfil {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol: string;
  telefono: string;
  activo: boolean;
  alumnoId: string | null;
  /** DNI del hijo, cuando la cuenta es de un padre/madre. Dato informativo. */
  dniVinculado: string | null;
  /**
   * Ficha del hijo en `alumnos`, solo para padres/madres.
   * La escribe administración: es lo que autoriza a leer la asistencia del hijo.
   */
  hijoAlumnoId: string | null;
}

export interface AuthContextType {
  /** Usuario de Firebase Authentication, o null si la sesión está cerrada. */
  user: User | null;
  /** Perfil de Firestore, si las reglas permiten leerlo. Puede ser null. */
  perfil: UsuarioPerfil | null;
  /** true mientras se resuelve el estado inicial de sesión. */
  loading: boolean;
  /** Nombre a mostrar: displayName de Auth > perfil de Firestore > email. */
  displayName: string;
  /** Iniciales para el avatar, derivadas de displayName. */
  initials: string;
  /** Foto de Firebase Auth, o null si el usuario no tiene. */
  photoURL: string | null;
  signOutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  perfil: null,
  loading: true,
  displayName: "",
  initials: "",
  photoURL: null,
  signOutUser: async () => {},
  refreshUser: async () => {},
});
