import { Monitor, Cog, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

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
    text: "text-sky-600",
    bg: "bg-sky-600",
    bgSoft: "bg-sky-50",
    border: "border-sky-200",
    ring: "group-hover:border-sky-300",
    chip: "bg-sky-50 text-sky-700 border-sky-100",
    gradFrom: "from-sky-500",
    gradTo: "to-sky-700",
    glow: "shadow-sky-500/25",
  },
  cyan: {
    text: "text-cyan-600",
    bg: "bg-cyan-600",
    bgSoft: "bg-cyan-50",
    border: "border-cyan-200",
    ring: "group-hover:border-cyan-300",
    chip: "bg-cyan-50 text-cyan-700 border-cyan-100",
    gradFrom: "from-cyan-500",
    gradTo: "to-cyan-700",
    glow: "shadow-cyan-500/25",
  },
} as const;

export default function Especialidades() {
  return (
    <section id="especialidades" className="relative w-full bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-600">
            <Sparkles size={13} strokeWidth={2.5} />
            Oferta educativa
          </span>
          <h2
            className="mt-5 font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Nuestras especialidades
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Dos tecnicaturas orientadas a formar profesionales con salida laboral
            real y posibilidad de continuar estudios superiores.
          </p>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {SPECIALTIES.map((s) => {
            const a = ACCENTS[s.accent as keyof typeof ACCENTS];
            return (
              <article
                key={s.title}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${a.ring} sm:p-9`}
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${a.gradFrom} ${a.gradTo} opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-20`}
                />

                <div className="relative flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${a.gradFrom} ${a.gradTo} text-white shadow-lg ${a.glow}`}
                  >
                    <s.icon size={28} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                      {s.title}
                    </h3>
                    <p className={`text-sm font-semibold ${a.text}`}>
                      Título secundario con salida laboral
                    </p>
                  </div>
                </div>

                <p className="relative mt-6 text-sm leading-relaxed text-slate-600">
                  {s.description}
                </p>

                <div className="relative mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Materias clave
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.subjects.map((subj) => (
                      <span
                        key={subj}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${a.chip}`}
                      >
                        <CheckCircle2 size={13} strokeWidth={2.5} />
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative mt-7 rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Perfil del egresado
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {s.perfil}
                  </p>
                </div>

                <button
                  className={`relative mt-6 inline-flex items-center gap-2 text-sm font-bold ${a.text} transition-all hover:gap-3`}
                >
                  Más información
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
