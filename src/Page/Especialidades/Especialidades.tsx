import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Monitor, Cog, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import ScrollReveal from "../../Components/Immersive/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const SPECIALTIES = [
  {
    title: "Técnico en Informática",
    icon: Monitor,
    accent: "sky",
    description:
      "Formación integral en programación, redes, base de datos y soporte técnico. El egresado está capacitado para instalar, configurar y mantener sistemas informáticos, desarrollar software y administrar redes de datos.",
    subjects: [
      "Programación (Python, Java, JavaScript)",
      "Base de Datos (MySQL, SQL Server)",
      "Redes y Conectividad",
      "Soporte Técnico y Mantenimiento",
      "Sistemas Operativos",
      "Desarrollo Web",
    ],
    perfil:
      "Podrás trabajar en empresas de tecnología, áreas de sistemas, desarrollo de software freelance o continuar estudios superiores en ingeniería informática.",
  },
  {
    title: "Técnico en Electromecánica",
    icon: Cog,
    accent: "cyan",
    description:
      "Formación en sistemas electromecánicos, automatización industrial y mantenimiento. El egresado puede interpretar planos, instalar y mantener equipos eléctricos y mecánicos, y participar en proyectos de automatización.",
    subjects: [
      "Electrotecnia y Máquinas Eléctricas",
      "Mecánica Técnica",
      "Automatización y Control",
      "Neumática e Hidráulica",
      "Soldadura y Procesos de Fabricación",
      "Dibujo Técnico y CAD",
    ],
    perfil:
      "Podrás trabajar en industrias, plantas de producción, mantenimiento industrial, empresas de servicios eléctricos o continuar estudios superiores en ingeniería electromecánica.",
  },
];

const ACCENTS = {
  sky: {
    text: "var(--accent)",
    grad: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
    glow: "0 10px 15px -3px var(--accent-glow), 0 4px 6px -4px var(--accent-glow)",
    chipBg: "color-mix(in srgb, var(--accent) 12%, transparent)",
    chipBorder: "color-mix(in srgb, var(--accent) 30%, transparent)",
  },
  cyan: {
    text: "var(--accent)",
    grad: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
    glow: "0 10px 15px -3px var(--accent-glow), 0 4px 6px -4px var(--accent-glow)",
    chipBg: "color-mix(in srgb, var(--accent) 12%, transparent)",
    chipBorder: "color-mix(in srgb, var(--accent) 30%, transparent)",
  },
} as const;

export default function Especialidades() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = sectionRef.current;
    const bar = progressRef.current;
    if (!s || !bar) return;

    const trigger = ScrollTrigger.create({
      trigger: s,
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="especialidades"
      className="relative w-full py-20"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Scroll progress bar */}
      <div
        className="fixed left-0 top-0 z-[100] h-[3px] w-full origin-left"
        style={{ backgroundColor: "var(--border)" }}
      >
        <div
          ref={progressRef}
          className="h-full w-full"
          style={{
            transform: "scaleX(0)",
            background: "linear-gradient(to right, var(--gradient-start), var(--gradient-end))",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Sparkles size={13} strokeWidth={2.5} />
              Oferta educativa
            </span>
            <h2
              className="mt-5 font-extrabold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "var(--text-primary)",
              }}
            >
              Nuestras especialidades
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Dos tecnicaturas orientadas a formar profesionales con salida laboral
              real y posibilidad de continuar estudios superiores.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {SPECIALTIES.map((s, idx) => {
            const a = ACCENTS[s.accent as keyof typeof ACCENTS];
            return (
              <ScrollReveal key={s.title} direction={idx === 0 ? "left" : "right"} delay={idx * 0.15}>
                <article
                  className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl group-hover:border-[var(--accent-light)] sm:p-9"
                >
                  {/* Accent glow */}
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-20"
                    style={{ background: a.grad }}
                  />

                  {/* Subjects progress bar (scroll-driven) */}
                  <div
                    className="absolute bottom-0 left-0 h-1 w-full origin-left"
                    style={{ backgroundColor: "var(--border)" }}
                  >
                    <div
                      className="h-full opacity-30"
                      style={{
                        transform: "scaleX(0)",
                        transition: "transform 0.3s",
                        backgroundColor: "var(--accent)",
                      }}
                    />
                  </div>

                  <div className="relative flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                      style={{ background: a.grad, color: "var(--accent-text)", boxShadow: a.glow }}
                    >
                      <s.icon size={28} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {s.title}
                      </h3>
                      <p className="text-sm font-semibold" style={{ color: a.text }}>
                        Título secundario con salida laboral
                      </p>
                    </div>
                  </div>

                  <p className="relative mt-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {s.description}
                  </p>

                  <div className="relative mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Materias clave
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.subjects.map((subj, i) => (
                        <span
                          key={subj}
                          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
                          style={{
                            backgroundColor: a.chipBg,
                            borderColor: a.chipBorder,
                            color: a.text,
                            animationDelay: `${i * 80}ms`,
                          }}
                        >
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-7 rounded-2xl p-5" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Perfil del egresado
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {s.perfil}
                    </p>
                  </div>

                  <button
                    className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                    style={{ color: a.text }}
                  >
                    Más información
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
