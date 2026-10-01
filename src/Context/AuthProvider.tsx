import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { obtenerPerfil } from "../Firebase/services/usuarios";
import { obtenerAlumno } from "../Firebase/services/alumnos";
import { obtenerPadre } from "../Firebase/services/padres";
import { ROLES } from "../Firebase/roles";
import { AuthContext, type UsuarioPerfil } from "./AuthContext";

function getInitials(name: string): string {
  const partes = name.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function getDisplayName(user: User | null, perfil: UsuarioPerfil | null): string {
  if (!user) return "";
  const nombreAuth = user.displayName?.trim();
  if (nombreAuth) return nombreAuth;
  const nombrePerfil = perfil ? `${perfil.nombre ?? ""} ${perfil.apellido ?? ""}`.trim() : "";
  if (nombrePerfil) return nombrePerfil;
  return user.email ?? "Usuario";
}

/**
 * Resuelve el perfil de la cuenta autenticada en la colección donde vive.
 *
 * El modelo de la web separa los perfiles por tipo (Opción B), así que el perfil
 * ya NO está siempre en `usuarios/{uid}`. Se resuelve en este orden:
 *
 *   1. `usuarios/{uid}`   -> staff y cuentas antiguas. El rol es el ALMACENADO
 *                            en el documento.
 *   2. `alumnos/{uid}`    -> alumno del registro público. Rol LÓGICO "alumno",
 *                            deducido de la colección; no se escribe en el doc.
 *   3. `padres/{uid}`     -> padre/madre del registro público. Rol LÓGICO
 *                            "padre", deducido de la colección.
 *
 * El orden importa: `usuarios` gana siempre, para que las cuentas antiguas y el
 * personal sigan funcionando tal cual.
 *
 * Si no hay ningún perfil se devuelve `null`. NO se crea nada: una cuenta de
 * Authentication sin perfil no tiene ningún permiso (las reglas fallan cerradas),
 * y la UI muestra "Acceso restringido" en vez de inventar un perfil.
 */
async function resolverPerfil(uid: string): Promise<UsuarioPerfil | null> {
  const deUsuarios = await obtenerPerfil(uid);
  if (deUsuarios) return deUsuarios;

  const deAlumnos = await obtenerAlumno(uid);
  if (deAlumnos) {
    return {
      uid,
      nombre: deAlumnos.nombre,
      apellido: deAlumnos.apellido,
      email: deAlumnos.email,
      dni: deAlumnos.dni,
      // Rol deducido de la colección: `alumnos/{uid}` ES un alumno.
      rol: ROLES.ALUMNO,
      telefono: deAlumnos.telefono,
      activo: deAlumnos.activo,
      // El ID del documento es el propio uid, asi que la ficha es el propio perfil.
      alumnoId: uid,
      dniVinculado: null,
      hijoAlumnoId: null,
    };
  }

  const dePadres = await obtenerPadre(uid);
  if (dePadres) {
    return {
      uid,
      nombre: dePadres.nombre,
      apellido: dePadres.apellido,
      email: dePadres.email,
      dni: dePadres.dni,
      // Rol deducido de la colección: `padres/{uid}` ES un padre/madre.
      rol: ROLES.PADRE,
      telefono: dePadres.telefono,
      activo: dePadres.activo,
      alumnoId: null,
      // El DNI del hijo se conserva como dato; no habilita ningun permiso por si solo.
      dniVinculado: dePadres.dniHijo || null,
      hijoAlumnoId: dePadres.hijoAlumnoId,
    };
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      const nextPerfil = nextUser ? await resolverPerfil(nextUser.uid) : null;
      if (cancelled) return;
      setUser(nextUser);
      setPerfil(nextPerfil);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) {
      setUser(null);
      setPerfil(null);
      return;
    }
    await current.reload();
    setUser(auth.currentUser);
    setPerfil(await resolverPerfil(current.uid));
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const displayName = useMemo(() => getDisplayName(user, perfil), [user, perfil]);
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const photoURL = user?.photoURL ?? null;

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, displayName, initials, photoURL, signOutUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
