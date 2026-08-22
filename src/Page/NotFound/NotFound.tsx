import { Link } from "react-router-dom";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-24 top-10 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--accent-glow)" }}
        />
        <div
          className="absolute -right-24 bottom-10 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--accent-glow)", opacity: 0.75 }}
        />
      </div>

      <div className="relative z-10">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            color: "var(--accent-text)",
            boxShadow: "0 10px 15px -3px var(--accent-glow)",
          }}
        >
          <Compass size={30} strokeWidth={2.2} />
        </div>

        <p
          className="mt-6 font-extrabold tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 12vw, 7rem)",
            color: "var(--text-primary)",
          }}
        >
          4
          <span
            style={{
              backgroundImage: "linear-gradient(to right, var(--gradient-start), var(--accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            0
          </span>
          4
        </p>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Página no encontrada
        </h1>
        <p className="mt-3 max-w-sm text-sm" style={{ color: "var(--text-secondary)" }}>
          La página que buscás no existe o fue movida. Volvé al inicio para
          continuar navegando.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
          style={{ color: "var(--accent-text)", boxShadow: "0 10px 15px -3px var(--accent-glow)" }}
        >
          <Home size={16} strokeWidth={2.5} />
          Volver al inicio
        </Link>
        <Link
          to="/especialidades"
          className="mt-3 ml-2 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-3 text-sm font-bold text-[var(--text-secondary)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Ver especialidades
        </Link>
      </div>
    </div>
  );
}
