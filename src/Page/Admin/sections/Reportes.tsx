import {
  FileText,
  Download,
  CalendarDays,
  BarChart3,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";

const REPORTS = [
  {
    title: "Asistencia general",
    desc: "Resumen mensual de asistencia por curso y división.",
    icon: CalendarDays,
    color: "sky",
    period: "Mensual",
  },
  {
    title: "Rendimiento académico",
    desc: "Promedios y calificaciones por materia y alumno.",
    icon: Award,
    color: "cyan",
    period: "Trimestral",
  },
  {
    title: "Usuarios registrados",
    desc: "Listado completo de alumnos, docentes y preceptores.",
    icon: Users,
    color: "emerald",
    period: "Actual",
  },
  {
    title: "Inasistencias reiteradas",
    desc: "Alumnos con más de 5 ausencias en el período.",
    icon: TrendingDown,
    color: "amber",
    period: "Mensual",
  },
  {
    title: "Llegadas tarde",
    desc: "Registro de tardanzas por alumno y curso.",
    icon: TrendingUp,
    color: "rose",
    period: "Semanal",
  },
  {
    title: "Boletines digitales",
    desc: "Generación masiva de boletines en PDF.",
    icon: FileText,
    color: "sky",
    period: "Trimestral",
  },
];

const TOP_CURSOS = [
  { curso: "1ro B", pct: 96, trend: "up" },
  { curso: "4to A", pct: 94, trend: "up" },
  { curso: "1ro A", pct: 93, trend: "up" },
  { curso: "5to A", pct: 91, trend: "down" },
  { curso: "6to A", pct: 89, trend: "down" },
  { curso: "3ro A", pct: 84, trend: "down" },
];

const COLOR: Record<string, { bg: string; text: string; btn: string }> = {
  sky: { bg: "bg-sky-50", text: "text-sky-600", btn: "hover:border-sky-300 hover:bg-sky-50" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", btn: "hover:border-cyan-300 hover:bg-cyan-50" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", btn: "hover:border-emerald-300 hover:bg-emerald-50" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", btn: "hover:border-amber-300 hover:bg-amber-50" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", btn: "hover:border-rose-300 hover:bg-rose-50" },
};

export default function Reportes() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Reportes</h1>
        <p className="mt-1 text-sm text-slate-500">Generá y descargá informes del sistema</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Asistencia media", value: "92,4%", icon: CheckCircle2, color: "emerald" },
          { label: "Alumnos evaluados", value: "486", icon: GraduationCap, color: "sky" },
          { label: "Materias activas", value: "28", icon: BarChart3, color: "cyan" },
          { label: "Reportes generados", value: "17", icon: FileText, color: "amber" },
        ].map((s) => {
          const c = COLOR[s.color];
          return (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                <s.icon size={20} strokeWidth={2.2} />
              </div>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">{s.value}</p>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report cards */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-base font-extrabold text-slate-900">Informes disponibles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {REPORTS.map((r) => {
              const c = COLOR[r.color];
              return (
                <div
                  key={r.title}
                  className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${c.btn}`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                      <r.icon size={21} strokeWidth={2.2} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      {r.period}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{r.desc}</p>
                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-600 transition-all hover:gap-3">
                    <Download size={15} strokeWidth={2.5} /> Descargar PDF
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top cursos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Asistencia por curso</h2>
          <p className="text-sm text-slate-500">Ranking del período actual</p>
          <ul className="mt-5 flex flex-col gap-4">
            {TOP_CURSOS.map((c, i) => (
              <li key={c.curso}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {i + 1}
                    </span>
                    {c.curso}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                    {c.pct}%
                    {c.trend === "up"
                      ? <TrendingUp size={14} className="text-emerald-500" />
                      : <TrendingDown size={14} className="text-rose-500" />}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={[
                      "h-full rounded-full",
                      c.pct >= 90 ? "bg-emerald-500" : c.pct >= 85 ? "bg-amber-500" : "bg-rose-500",
                    ].join(" ")}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
