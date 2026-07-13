import { Link } from "react-router-dom";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-600/30">
          <Compass size={30} strokeWidth={2.2} />
        </div>

        <p
          className="mt-6 font-extrabold tracking-tight text-slate-900"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 7rem)" }}
        >
          4<span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">0</span>4
        </p>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
          Página no encontrada
        </h1>
        <p className="mt-3 max-w-sm text-sm text-slate-500">
          La página que buscás no existe o fue movida. Volvé al inicio para
          continuar navegando.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:bg-sky-700"
        >
          <Home size={16} strokeWidth={2.5} />
          Volver al inicio
        </Link>
        <Link
          to="/especialidades"
          className="mt-3 ml-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-sky-300"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Ver especialidades
        </Link>
      </div>
    </div>
  );
}
