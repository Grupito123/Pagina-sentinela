import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLeaving(true), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={[
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden transition-all duration-700",
        leaving ? "pointer-events-none opacity-0 scale-105" : "opacity-100",
      ].join(" ")}
      style={{ background: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 45%, #ecfeff 100%)" }}
      aria-live="polite"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-cyan-300/30 blur-3xl" />
        <div
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl"
          style={{ animation: "var(--animate-float-slow)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 39px, #0284c7 39px, #0284c7 40px), repeating-linear-gradient(0deg, transparent, transparent 39px, #0284c7 39px, #0284c7 40px)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo con anillo giratorio */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full border-[5px] border-sky-100"
            aria-hidden
          />
          <span
            className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-sky-600 border-r-cyan-500"
            style={{ animation: "spin 0.9s linear infinite" }}
            aria-hidden
          />
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-xl shadow-sky-600/30"
            style={{ animation: "var(--animate-pulse-soft)" }}
          >
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Marca */}
        <h1
          className="mt-7 font-extrabold tracking-tight text-slate-900"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}
        >
          Sentinel
        </h1>
        <p className="mt-1 text-sm font-medium text-sky-600">
          E.E.S.T. Nro. 3 · Padua
        </p>

        {/* Barra de progreso */}
        <div className="mt-8 w-56 max-w-[70vw]">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Cargando</span>
            <span className="tabular-nums text-sky-600">{progress}%</span>
          </div>
        </div>

        {/* Dots animados */}
        <div className="mt-5 flex items-end gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500"
              style={{
                animation: "bounce-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer de la pantalla */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[11px] font-medium text-slate-400">
          Sistema de Asistencia Inteligente
        </p>
      </div>
    </div>
  );
}
