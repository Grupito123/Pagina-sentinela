import {
  Users,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  School,
  Download,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  {
    label: "Alumnos activos",
    value: "486",
    delta: "+12",
    trend: "up",
    icon: GraduationCap,
    color: "sky",
  },
  {
    label: "Docentes",
    value: "34",
    delta: "+2",
    trend: "up",
    icon: Users,
    color: "cyan",
  },
  {
    label: "Asistencia hoy",
    value: "94,2%",
    delta: "+1,8%",
    trend: "up",
    icon: ClipboardCheck,
    color: "emerald",
  },
  {
    label: "Llegadas tarde",
    value: "23",
    delta: "-5",
    trend: "down",
    icon: Clock,
    color: "amber",
  },
];

const WEEK = [
  { d: "Lun", pct: 92 },
  { d: "Mar", pct: 95 },
  { d: "Mié", pct: 88 },
  { d: "Jue", pct: 94 },
  { d: "Vie", pct: 91 },
  { d: "Sáb", pct: 78 },
];

const COURSES = [
  { curso: "1ro A", presentes: 28, ausentes: 2, tarde: 1, total: 31 },
  { curso: "1ro B", presentes: 29, ausentes: 1, tarde: 0, total: 30 },
  { curso: "3ro A", presentes: 25, ausentes: 4, tarde: 2, total: 31 },
  { curso: "4to A", presentes: 27, ausentes: 1, tarde: 3, total: 31 },
  { curso: "5to A", presentes: 26, ausentes: 2, tarde: 1, total: 29 },
  { curso: "6to A", presentes: 24, ausentes: 3, tarde: 0, total: 27 },
];

const ACTIVITY = [
  { icon: UserCheck, color: "emerald", text: "María González validó su cuenta", time: "Hace 5 min" },
  { icon: AlertCircle, color: "amber", text: "3 alumnos llegaron tarde en 4to A", time: "Hace 22 min" },
  { icon: CheckCircle2, color: "sky", text: "Asistencia de 1ro A registrada", time: "Hace 1 h" },
  { icon: UserCheck, color: "emerald", text: "Prof. Pérez completó su registro", time: "Hace 2 h" },
  { icon: AlertCircle, color: "rose", text: "Ausencias múltiples en 3ro A", time: "Hace 3 h" },
];

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  sky: { bg: "bg-sky-50", text: "text-sky-600", ring: "hover:border-sky-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", ring: "hover:border-cyan-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "hover:border-emerald-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "hover:border-amber-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "hover:border-rose-200" },
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Resumen general del sistema · Hoy{" "}
            {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:bg-sky-700">
          <Download size={16} strokeWidth={2.5} /> Exportar resumen
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => {
          const c = COLOR_MAP[s.color];
          const up = s.trend === "up";
          return (
            <div
              key={s.label}
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${c.ring}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                  <s.icon size={21} strokeWidth={2.2} />
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{s.value}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Asistencia semanal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Asistencia semanal</h2>
              <p className="text-sm text-slate-500">Promedio de presentes por día</p>
            </div>
            <School size={20} className="text-slate-300" />
          </div>
          <div className="mt-6 flex h-52 items-end justify-between gap-3 sm:gap-5">
            {WEEK.map((w) => (
              <div key={w.d} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-700">{w.pct}%</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-cyan-400 transition-all hover:from-sky-600 hover:to-cyan-500"
                    style={{ height: `${w.pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-400">{w.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Actividad reciente</h2>
          <p className="text-sm text-slate-500">Últimas novedades</p>
          <ul className="mt-5 flex flex-col gap-4">
            {ACTIVITY.map((a, i) => {
              const c = COLOR_MAP[a.color];
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
                    <a.icon size={15} strokeWidth={2.3} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug text-slate-700">{a.text}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Estado por curso */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Estado por curso</h2>
            <p className="text-sm text-slate-500">Asistencia de hoy por división</p>
          </div>
          <Link
            to="/admin/asistencia"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 transition-all hover:gap-2.5"
          >
            Ver todo <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3">Curso</th>
                <th className="px-6 py-3">Presentes</th>
                <th className="px-6 py-3">Ausentes</th>
                <th className="px-6 py-3">Tarde</th>
                <th className="px-6 py-3">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map((c) => {
                const pct = Math.round((c.presentes / c.total) * 100);
                return (
                  <tr key={c.curso} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 font-bold text-slate-800">{c.curso}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-emerald-600">{c.presentes}</span>
                      <span className="text-slate-300">/{c.total}</span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-rose-600">{c.ausentes}</td>
                    <td className="px-6 py-3.5 font-semibold text-amber-600">{c.tarde}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={[
                              "h-full rounded-full",
                              pct >= 90 ? "bg-emerald-500" : pct >= 80 ? "bg-amber-500" : "bg-rose-500",
                            ].join(" ")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
