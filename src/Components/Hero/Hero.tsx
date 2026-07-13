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

const FEATURES = [
  { icon: ClipboardCheck, text: "Asistencia en tiempo real" },
  { icon: GraduationCap, text: "Calificaciones y boletín digital" },
  { icon: Megaphone, text: "Comunicados y avisos oficiales" },
];

const TRUST = [
  { label: "Gratuita", tone: "emerald" },
  { label: "iOS & Android", tone: "sky" },
  { label: "Sin publicidad", tone: "cyan" },
  { label: "Actualizaciones constantes", tone: "emerald" },
];

const GRADES = [
  { materia: "Matemática", nota: "8" },
  { materia: "Física", nota: "9" },
  { materia: "Inglés", nota: "7" },
  { materia: "Programación", nota: "10" },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50/60">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full bg-cyan-300/40 blur-3xl" />
        <div
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl"
          style={{ animation: "var(--animate-float-slow)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 md:pt-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-8">
          <div className="w-full flex-1 animate-[fade-up_0.6s_ease-out_both]">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-600 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 animate-[pulse-soft_2.8s_ease-in-out_infinite] rounded-full bg-emerald-500" />
              E.E.S.T. Nro. 3 · Padua · Disponible en iOS y Android
            </span>

            <h1 className="mt-6 font-extrabold leading-[0.95] tracking-tight text-slate-900"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.75rem, 6vw, 4.5rem)" }}
            >
              La escuela,
              <br />
              en la palma de
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                tu mano
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
              Notas, asistencia, comunicados y más — todo desde tu celular.
              El portal estudiantil oficial de la E.E.S.T. Nro. 3, pensado para
              alumnos, docentes y preceptores.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
                    <f.icon size={18} strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.15 1.26-2.13 3.75.03 2.99 2.62 3.99 2.64 4-.03.07-.41 1.4-1.36 2.87M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Disponible en
                  </div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-lg shadow-slate-900/5 transition-all hover:-translate-y-0.5 hover:border-slate-300"
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.3.17.65.2.97.08L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335" />
                  <path d="M20.65 10.43l-2.72-1.57-4.5 3.14 4.5 3.14 2.75-1.59a1.75 1.75 0 000-3.12z" fill="#FBBC04" />
                  <path d="M3.18.24a1.74 1.74 0 00-.18.78v22c0 .28.06.54.18.78L14.86 12 3.18.24z" fill="#4285F4" />
                  <path d="M14.86 12L3.18 23.76c.32.12.67.09.97-.08l12.73-7.35L14.86 12z" fill="#34A853" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Disponible en
                  </div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-sm animate-[fade-in_0.8s_ease-out_both] flex-shrink-0 justify-self-center">
            <div className="relative mx-auto" style={{ width: 232 }}>
              <div
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/30 blur-3xl"
              />

              <div
                className="relative mx-auto overflow-hidden rounded-[2.5rem] border-[7px] border-slate-800 bg-slate-900 shadow-2xl shadow-sky-900/30"
                style={{ width: 208, height: 430 }}
              >
                <div className="absolute left-1/2 top-0 z-20 h-6 w-20 -translate-x-1/2 rounded-b-2xl bg-slate-800" />

                <div className="absolute inset-0 bg-gradient-to-b from-sky-600 to-sky-800">
                  <div className="flex items-center justify-between px-5 pt-7 pb-2 text-white">
                    <span className="text-[10px] font-bold">9:41</span>
                    <span className="text-[8px] opacity-70">●●●</span>
                  </div>

                  <div className="flex items-center gap-2 px-4 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur">
                      <ShieldCheck size={16} strokeWidth={2.5} />
                    </div>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold text-white">E.E.S.T. Nro. 3</div>
                      <div className="text-[8px] text-sky-200">Padua</div>
                    </div>
                  </div>

                  <div className="rounded-t-3xl bg-white px-3 pt-4" style={{ height: "calc(100% - 92px)" }}>
                    <div className="text-[11px] font-bold text-slate-900">¡Hola, Juan! 👋</div>
                    <div className="text-[8px] text-slate-400">Lunes · 4to año "A"</div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-sky-50 p-2.5">
                        <div className="flex items-center gap-1 text-sky-600">
                          <TrendingUp size={10} strokeWidth={2.5} />
                          <span className="text-[7px] font-bold uppercase">Promedio</span>
                        </div>
                        <div className="mt-0.5 text-lg font-black leading-none text-sky-700">8.4</div>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 p-2.5">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <ClipboardCheck size={10} strokeWidth={2.5} />
                          <span className="text-[7px] font-bold uppercase">Asistencia</span>
                        </div>
                        <div className="mt-0.5 text-lg font-black leading-none text-emerald-700">94%</div>
                      </div>
                    </div>

                    <div className="mt-2 rounded-2xl border border-cyan-100 bg-cyan-50 p-2.5">
                      <div className="flex items-center gap-1 text-cyan-600">
                        <Megaphone size={10} strokeWidth={2.5} />
                        <span className="text-[7px] font-bold uppercase">Comunicado</span>
                      </div>
                      <p className="mt-1 text-[8px] font-medium leading-tight text-cyan-900/70">
                        Acto del 25 de Mayo · Lunes 8 hs en el patio central
                      </p>
                    </div>

                    <div className="mt-2 overflow-hidden rounded-2xl border border-slate-100">
                      {GRADES.map((m, i) => (
                        <div
                          key={m.materia}
                          className="flex items-center justify-between px-3 py-1.5"
                          style={{
                            background: i % 2 === 0 ? "bg-slate-50" : "transparent",
                            borderBottom: i < GRADES.length - 1 ? "1px solid #f1f5f9" : "none",
                          }}
                        >
                          <span className="text-[8px] font-medium text-slate-600">{m.materia}</span>
                          <span className="text-[9px] font-black text-sky-600">{m.nota}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-6 top-20 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl shadow-slate-900/10"
                style={{ animation: "var(--animate-float)" }}
              >
                <span className="text-base">⭐</span>
                <div>
                  <div className="text-[11px] font-black text-slate-900">4.8</div>
                  <div className="text-[8px] text-slate-400">+2k reseñas</div>
                </div>
              </div>

              <div
                className="absolute -left-8 bottom-28 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 px-3 py-2 text-white shadow-xl shadow-cyan-500/30"
                style={{ animation: "var(--animate-float-slow)" }}
              >
                <div className="flex items-center gap-1 text-[11px] font-black">
                  <Download size={11} strokeWidth={2.5} /> +5.000
                </div>
                <div className="text-[8px] text-white/80">descargas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-slate-200/70 pt-6 sm:justify-start">
          {TRUST.map((tag, i, arr) => (
            <div key={tag.label} className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    tag.tone === "emerald" && "bg-emerald-500",
                    tag.tone === "sky" && "bg-sky-500",
                    tag.tone === "cyan" && "bg-cyan-500",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                {tag.label}
              </div>
              {i < arr.length - 1 && <div className="h-3.5 w-px bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Smartphone, value: "+5.000", label: "descargas" },
            { icon: Star, value: "4.8", label: "puntación media" },
            { icon: ClipboardCheck, value: "99,2%", label: "asistencia registrada" },
            { icon: GraduationCap, value: "12", label: "cursos activos" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <s.icon size={18} className="text-sky-600" strokeWidth={2.2} />
              <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                {s.value}
              </div>
              <div className="text-xs font-medium text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
