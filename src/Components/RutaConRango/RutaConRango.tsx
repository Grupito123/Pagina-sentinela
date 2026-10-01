import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import { useAuth } from "../../Context/useAuth";
import type { Rol } from "../../Firebase/roles";

/**
 * Muestra el contenido solo a quien tenga alguno de los roles indicados.
 *
 * La fuente de verdad es el perfil resuelto por `AuthProvider`, que lo busca en
 * `usuarios/{uid}`, y si no existe en `alumnos/{uid}` o `padres/{uid}` (registro
 * por coleccion). Esto evita mostrar secciones que no corresponden; la
 * autorización real la aplican las reglas de Firestore, no este componente.
 */
export default function RutaConRango({ roles, children }: { roles: Rol[]; children: ReactNode }) {
  const { user, perfil, loading, signOutUser } = useAuth();
  const navigate = useNavigate();

  // Mientras se resuelve la sesión todavía no se puede decidir: negar acá
  // mostraría un "Acceso restringido" antes de tiempo.
  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-5 py-16">
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          Verificando tu sesión...
        </p>
      </section>
    );
  }

  if (user && perfil && roles.includes(perfil.rol as Rol)) return <>{children}</>;

  const nombres = roles.join(" o ");
  const motivo = !user
    ? <>Esta sección es solo para cuentas con rol <span className="font-bold uppercase">{nombres}</span>. Iniciá sesión para continuar.</>
    : perfil
      ? <>Tu cuenta (<span className="font-bold">{`${perfil.nombre} ${perfil.apellido}`.trim() || perfil.email}</span>) tiene el rol <span className="font-bold uppercase">{perfil.rol || "sin asignar"}</span> y esta sección es solo para <span className="font-bold uppercase">{nombres}</span>.</>
      : <>Tu cuenta está autenticada, pero aún no tiene un perfil válido para acceder a esta sección (podría haberse creado recién por registro público). Cerrá sesión e iniciá sesión nuevamente, o contactá a la administración.</>;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-5 py-16" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border text-center shadow-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-hover))" }} />
        <div className="flex flex-col items-center p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
            <Lock size={30} strokeWidth={2.2} />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Acceso restringido
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {motivo}
          </p>
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)", boxShadow: "0 4px 14px var(--accent-glow)" }}
            >
              <LogIn size={16} /> Iniciar sesión
            </button>
          )}
          {user && !perfil && (
            <button
              onClick={() => void signOutUser()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)", boxShadow: "0 4px 14px var(--accent-glow)" }}
            >
              <LogIn size={16} /> Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
