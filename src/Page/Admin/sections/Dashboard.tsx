import {
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Activity,
} from "lucide-react";

const STATS = [
  { label: "Alumnos activos", value: "342", change: "+12", up: true, icon: Users, color: "from-[var(--accent)] to-[var(--accent-dark)]" },
  { label: "Asistencia hoy", value: "87%", change: "+3%", up: true, icon: ClipboardCheck, color: "from-[var(--accent)] to-[var(--accent-dark)]" },
  { label: "Promedio general", value: "7.4", change: "+0.2", up: true, icon: TrendingUp, color: "from-[var(--accent)] to-[var(--accent-dark)]" },
  { label: "Inasistencias", value: "23", change: "-5", up: false, icon: AlertTriangle, color: "from-[var(--accent)] to-[var(--accent-dark)]" },
];

const RECENT_ACTIVITY = [
  { time: "08:15", action: "Entrada registrada", who: "Juan Pérez (5°A)", type: "success" },
  { time: "08:18", action: "Entrada registrada", who: "María López (3°B)", type: "success" },
  { time: "08:22", action: "Tardanza", who: "Carlos García (4°A)", type: "warning" },
  { time: "08:30", action: "Inasistencia justificada", who: "Ana Martínez (5°B)", type: "info" },
  { time: "08:45", action: "Entrada registrada", who: "Pedro Ruiz (3°A)", type: "success" },
  { time: "09:00", action: "Tardanza", who: "Laura Díaz (4°B)", type: "warning" },
  { time: "09:15", action: "Inasistencia injustificada", who: "Diego Fernández (5°A)", type: "error" },
  { time: "09:30", action: "Entrada registrada", who: "Sofía Torres (3°B)", type: "success" },
];

const WEEKLY = [
  { day: "Lun", presentes: 312, ausentes: 30 },
  { day: "Mar", presentes: 298, ausentes: 44 },
  { day: "Mié", presentes: 325, ausentes: 17 },
  { day: "Jue", presentes: 308, ausentes: 34 },
  { day: "Vie", presentes: 318, ausentes: 24 },
];

const CLASSES = [
  { name: "5°A", asistencia: 92, alumnos: 36 },
  { name: "5°B", asistencia: 88, alumnos: 34 },
  { name: "4°A", asistencia: 85, alumnos: 38 },
  { name: "4°B", asistencia: 91, alumnos: 35 },
  { name: "3°A", asistencia: 94, alumnos: 40 },
  { name: "3°B", asistencia: 89, alumnos: 37 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Resumen general del sistema de asistencias</p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
          >
            <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${s.color} opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.12]`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{s.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">{s.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-[var(--accent-text)] shadow-md`}>
                <s.icon size={19} />
              </div>
            </div>
            <div className="relative mt-3 flex items-center gap-1.5">
              {s.up ? (
                <ArrowUpRight size={14} className="text-[var(--success)]" />
              ) : (
                <ArrowDownRight size={14} className="text-[var(--success)]" />
              )}
              <span className="text-xs font-bold text-[var(--success)]">{s.change}</span>
              <span className="text-xs text-[var(--text-muted)]">vs. semana anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly bar chart */}
        <div className="col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Asistencia semanal</h2>
              <p className="text-xs text-[var(--text-muted)]">Presentes vs. ausentes por día</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Presentes</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--border-light)]" /> Ausentes</span>
            </div>
          </div>
          <div className="flex items-end gap-4 h-48">
            {WEEKLY.map((d) => {
              const total = d.presentes + d.ausentes;
              const hP = (d.presentes / total) * 100;
              return (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-col gap-1" style={{ height: "140px" }}>
                    <div className="flex-1 flex items-end">
                      <div className="w-full rounded-t-lg bg-[var(--accent)] opacity-80 transition-all" style={{ height: `${hP}%` }} />
                    </div>
                    <div className="flex-1 flex items-end">
                      <div className="w-full rounded-b-lg bg-[var(--bg-card-hover)] transition-all" style={{ height: `${100 - hP}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* By class */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Por curso</h2>
          <p className="text-xs text-[var(--text-muted)]">Porcentaje de asistencia</p>
          <div className="mt-5 space-y-4">
            {CLASSES.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">{c.name}</span>
                  <span className="text-xs font-bold text-[var(--accent)]">{c.asistencia}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-card-hover)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] transition-all"
                    style={{ width: `${c.asistencia}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[var(--accent)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Actividad reciente</h2>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
            <CalendarDays size={13} />
            Hoy
          </div>
        </div>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-[var(--border)]/50 bg-[var(--bg-input)]/30 px-4 py-3 transition-colors hover:bg-[var(--bg-input)]/60"
            >
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Clock size={13} />
                {a.time}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-secondary)]">{a.action}</p>
                <p className="text-xs text-[var(--text-muted)]">{a.who}</p>
              </div>
              {a.type === "success" && <CheckCircle2 size={16} className="text-[var(--success)]" />}
              {a.type === "warning" && <AlertTriangle size={16} className="text-[var(--warning)]" />}
              {a.type === "error" && <XCircle size={16} className="text-[var(--error)]" />}
              {a.type === "info" && <MinusCircle size={16} className="text-[var(--text-muted)]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
