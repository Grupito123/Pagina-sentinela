import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ClipboardCheck,
  GraduationCap,
  Megaphone,
  ShieldCheck,
  Smartphone,
  Star,
  Download,
  TrendingUp,
} from "lucide-react";
import MagneticButton from "../Microinteractions/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: ClipboardCheck, text: "Asistencia en tiempo real" },
  { icon: GraduationCap, text: "Calificaciones y boletín digital" },
  { icon: Megaphone, text: "Comunicados y avisos oficiales" },
];

const TRUST = [
  { label: "Gratuita", dot: "var(--success)" },
  { label: "iOS & Android", dot: "var(--error)" },
  { label: "Sin publicidad", dot: "var(--accent-dark)" },
  { label: "Actualizaciones constantes", dot: "var(--success)" },
];

const GRADES = [
  { materia: "Matemática", nota: "8" },
  { materia: "Física", nota: "9" },
  { materia: "Inglés", nota: "7" },
  { materia: "Programación", nota: "10" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;
    const els = textRef.current.querySelectorAll("[data-hero-reveal]");
    gsap.set(els, { opacity: 0, y: 50, rotateX: -15 });
    const tl = gsap.timeline({ delay: 3.4 });
    tl.to(els, { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });
    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full blur-[120px]" style={{ backgroundColor: "var(--accent-glow)" }} />
        <div className="absolute -bottom-32 -left-32 h-[24rem] w-[24rem] rounded-full blur-[100px]" style={{ backgroundColor: "var(--accent-glow)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 md:pt-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-12">
          {/* Text */}
          <div ref={textRef} className="w-full flex-1">
            <div data-hero-reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--overlay)",
                  color: "var(--accent-light)",
                }}
              >
                <span className="h-1.5 w-1.5 animate-[pulse-soft_2.8s_ease-in-out_infinite] rounded-full" style={{ backgroundColor: "var(--success)" }} />
                E.E.S.T. Nro. 3 · Padua · Disponible en iOS y Android
              </span>
            </div>

            <h1
              data-hero-reveal
              className="mt-6 font-extrabold leading-[0.95] tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.75rem, 6vw, 4.5rem)", color: "var(--text-primary)" }}
            >
              La escuela,
              <br />
              en la palma de
              <br />
              <span
                className="bg-gradient-to-r bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right, var(--gradient-start), var(--accent-light))" }}
              >
                tu mano
              </span>
            </h1>

            <p data-hero-reveal className="mt-6 max-w-md text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Notas, asistencia, comunicados y más — todo desde tu celular.
              El portal estudiantil oficial de la E.E.S.T. Nro. 3, pensado para
              alumnos, docentes y preceptores.
            </p>

            <div data-hero-reveal className="mt-8 flex flex-col gap-3">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--accent-light)" }}
                  >
                    <f.icon size={18} strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{f.text}</span>
                </div>
              ))}
            </div>

            <div data-hero-reveal className="mt-9 flex flex-wrap gap-3">
              <MagneticButton
                strength={0.25}
                className="inline-flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg transition-all"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)", boxShadow: "0 20px 25px -5px var(--accent-glow), 0 8px 10px -6px var(--accent-glow)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.15 1.26-2.13 3.75.03 2.99 2.62 3.99 2.64 4-.03.07-.41 1.4-1.36 2.87M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)", opacity: 0.65 }}>Disponible en</div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </MagneticButton>

              <MagneticButton
                strength={0.25}
                className="inline-flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-lg transition-all"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.3.17.65.2.97.08L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335" />
                  <path d="M20.65 10.43l-2.72-1.57-4.5 3.14 4.5 3.14 2.75-1.59a1.75 1.75 0 000-3.12z" fill="#FBBC04" />
                  <path d="M3.18.24a1.74 1.74 0 00-.18.78v22c0 .28.06.54.18.78L14.86 12 3.18.24z" fill="#4285F4" />
                  <path d="M14.86 12L3.18 23.76c.32.12.67.09.97-.08l12.73-7.35L14.86 12z" fill="#34A853" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Disponible en</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </MagneticButton>
            </div>
          </div>

          {/* Phone mockup — draggable */}
          <div data-hero-reveal className="relative w-full max-w-md flex-shrink-0 justify-self-center" style={{ perspective: 1000 }}>
            <motion.div
              initial={{ opacity: 0, y: 80, rotateY: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
              transition={{ delay: 3.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              drag
              dragConstraints={{ left: -60, right: 60, top: -40, bottom: 40 }}
              dragElastic={0.15}
              whileDrag={{ scale: 1.04, rotateZ: 1, zIndex: 50 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative mx-auto cursor-grab active:cursor-grabbing"
              style={{ width: 280 }}
            >
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent-glow)" }} />

              <div
                className="relative mx-auto overflow-hidden rounded-[2.5rem] border-[8px] shadow-2xl"
                style={{
                  width: 264,
                  height: 540,
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-tertiary)",
                  boxShadow: "0 25px 50px -12px var(--overlay), 0 0 80px var(--accent-glow)",
                }}
              >
                <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-2xl" style={{ backgroundColor: "var(--border)" }} />

                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, var(--accent-dark), var(--bg-tertiary))" }}>
                  <div className="flex items-center justify-between px-5 pt-7 pb-2" style={{ color: "var(--text-primary)" }}>
                    <span className="text-[11px] font-bold">9:41</span>
                    <span className="text-[9px] opacity-70">●●●</span>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 pb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur" style={{ backgroundColor: "var(--accent-glow)", color: "var(--text-primary)" }}>
                      <ShieldCheck size={18} strokeWidth={2.5} />
                    </div>
                    <div className="leading-tight">
                      <div className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>E.E.S.T. Nro. 3</div>
                      <div className="text-[9px]" style={{ color: "var(--accent-light)" }}>Padua</div>
                    </div>
                  </div>

                  <div className="rounded-t-3xl px-3.5 pt-4" style={{ backgroundColor: "var(--bg-card)", height: "calc(100% - 96px)" }}>
                    <div className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>¡Hola, Juan! 👋</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>Lunes · 4to año "A"</div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl p-3" style={{ backgroundColor: "var(--error-bg)" }}>
                        <div className="flex items-center gap-1" style={{ color: "var(--error)" }}>
                          <TrendingUp size={11} strokeWidth={2.5} />
                          <span className="text-[8px] font-bold uppercase">Promedio</span>
                        </div>
                        <div className="mt-0.5 text-xl font-black leading-none" style={{ color: "var(--error)" }}>8.4</div>
                      </div>
                      <div className="rounded-2xl p-3" style={{ backgroundColor: "var(--success-bg)" }}>
                        <div className="flex items-center gap-1" style={{ color: "var(--success)" }}>
                          <ClipboardCheck size={11} strokeWidth={2.5} />
                          <span className="text-[8px] font-bold uppercase">Asistencia</span>
                        </div>
                        <div className="mt-0.5 text-xl font-black leading-none" style={{ color: "var(--success)" }}>94%</div>
                      </div>
                    </div>

                    <div className="mt-2 rounded-2xl border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--error-bg)" }}>
                      <div className="flex items-center gap-1" style={{ color: "var(--error)" }}>
                        <Megaphone size={11} strokeWidth={2.5} />
                        <span className="text-[8px] font-bold uppercase">Comunicado</span>
                      </div>
                      <p className="mt-1 text-[9px] font-medium leading-tight" style={{ color: "var(--error)", opacity: 0.75 }}>
                        Acto del 25 de Mayo · Lunes 8 hs en el patio central
                      </p>
                    </div>

                    <div className="mt-2 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-light)" }}>
                      {GRADES.map((m, i) => (
                        <div
                          key={m.materia}
                          className="flex items-center justify-between px-3 py-2"
                          style={{
                            background: i % 2 === 0 ? "var(--bg-secondary)" : "transparent",
                            borderBottom: i < GRADES.length - 1 ? "1px solid var(--border-light)" : "none",
                          }}
                        >
                          <span className="text-[9px] font-medium" style={{ color: "var(--text-muted)" }}>{m.materia}</span>
                          <span className="text-[10px] font-black" style={{ color: "var(--accent-dark)" }}>{m.nota}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div
                className="absolute -right-8 top-24 flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 shadow-xl"
                style={{ animation: "var(--animate-float)", backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border)" }}
              >
                <span className="text-lg">⭐</span>
                <div>
                  <div className="text-[12px] font-black" style={{ color: "var(--text-primary)" }}>4.8</div>
                  <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>+2k reseñas</div>
                </div>
              </div>

              <div
                className="absolute -left-10 bottom-32 rounded-2xl px-3.5 py-2.5 shadow-xl"
                style={{
                  animation: "var(--animate-float-slow)",
                  backgroundImage: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  color: "var(--accent-text)",
                  boxShadow: "0 20px 25px -5px var(--accent-glow), 0 8px 10px -6px var(--accent-glow)",
                }}
              >
                <div className="flex items-center gap-1 text-[12px] font-black">
                  <Download size={12} strokeWidth={2.5} /> +5.000
                </div>
                <div className="text-[9px]" style={{ color: "var(--accent-text)", opacity: 0.75 }}>descargas</div>
              </div>

              <div
                className="absolute -left-6 top-1/2 flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-xl"
                style={{ animation: "var(--animate-float-slow)", animationDelay: "1s", backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border)" }}
              >
                <span className="text-base">🔒</span>
                <div>
                  <div className="text-[11px] font-black" style={{ color: "var(--text-primary)" }}>100%</div>
                  <div className="text-[8px]" style={{ color: "var(--text-muted)" }}>seguro</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t pt-6 sm:justify-start" style={{ borderTopColor: "var(--border)" }}>
          {TRUST.map((tag, i, arr) => (
            <div key={tag.label} className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tag.dot }} />
                {tag.label}
              </div>
              {i < arr.length - 1 && <div className="h-3.5 w-px" style={{ backgroundColor: "var(--border)" }} />}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Smartphone, value: "+5.000", label: "descargas" },
            { icon: Star, value: "4.8", label: "puntación media" },
            { icon: ClipboardCheck, value: "99,2%", label: "asistencia registrada" },
            { icon: GraduationCap, value: "12", label: "cursos activos" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border p-4 backdrop-blur transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
            >
              <s.icon size={18} strokeWidth={2.2} style={{ color: "var(--accent)" }} />
              <div className="mt-2 text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
