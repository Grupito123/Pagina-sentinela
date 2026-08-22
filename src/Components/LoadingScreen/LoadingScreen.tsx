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
      style={{
        background:
          "linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 45%, var(--bg-primary) 100%)",
      }}
      aria-live="polite"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ backgroundColor: "var(--accent-glow)" }} />
        <div className="absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ backgroundColor: "var(--accent-glow)" }} />
        <div
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--accent-glow)", animation: "var(--animate-float-slow)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 39px, var(--accent-dark) 39px, var(--accent-dark) 40px), repeating-linear-gradient(0deg, transparent, transparent 39px, var(--accent-dark) 39px, var(--accent-dark) 40px)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full border-[5px]"
            style={{ borderColor: "var(--accent-glow)" }}
            aria-hidden
          />
          <span
            className="absolute inset-0 rounded-full border-[5px] border-transparent"
            style={{ borderTopColor: "var(--accent)", borderRightColor: "var(--accent-light)", animation: "spin 0.9s linear infinite" }}
            aria-hidden
          />
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              color: "var(--accent-text)",
              boxShadow: "0 20px 25px -5px var(--accent-glow), 0 8px 10px -6px var(--accent-glow)",
              animation: "var(--animate-pulse-soft)",
            }}
          >
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
        </div>

        <h1
          className="mt-7 font-extrabold tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--text-primary)" }}
        >
          Sentinel
        </h1>
        <p className="mt-1 text-sm font-medium" style={{ color: "var(--accent-light)" }}>
          E.E.S.T. Nro. 3 · Padua
        </p>

        <div className="mt-8 w-56 max-w-[70vw]">
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            <div
              className="h-full rounded-full transition-[width] duration-150 ease-out"
              style={{
                width: `${progress}%`,
                backgroundImage: "linear-gradient(to right, var(--accent-dark), var(--accent))",
              }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
            <span>Cargando</span>
            <span className="tabular-nums" style={{ color: "var(--accent)" }}>{progress}%</span>
          </div>
        </div>

        <div className="mt-5 flex items-end gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--accent-dark), var(--accent))",
                animation: "bounce-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          Sistema de Asistencia Inteligente
        </p>
      </div>
    </div>
  );
}
