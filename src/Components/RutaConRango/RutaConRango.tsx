import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import { useSesion, tieneRango, type Rango } from "../../services/sesion";

/** Muestra el contenido solo a quien tenga el rango pedido; al resto, un aviso de acceso restringido. */
export default function RutaConRango({ rango, children }: { rango: Rango; children: ReactNode }) {
  const sesion = useSesion();
  const navigate = useNavigate();

  if (tieneRango(sesion, rango)) return <>{children}</>;

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
            {sesion
              ? <>Tu cuenta (<span className="font-bold">{sesion.nombre}</span>) no tiene el rango <span className="font-bold uppercase">{rango}</span> necesario para esta sección.</>
              : <>Esta sección es solo para cuentas con rango <span className="font-bold uppercase">{rango}</span>. Iniciá sesión para continuar.</>}
          </p>
          {!sesion && (
            <button
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)", boxShadow: "0 4px 14px var(--accent-glow)" }}
            >
              <LogIn size={16} /> Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
