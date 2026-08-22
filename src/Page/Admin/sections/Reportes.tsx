import { useState } from "react";
import {
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Printer,
  BarChart3,
  PieChart,
  Filter,
} from "lucide-react";

const REPORTS = [
  {
    id: 1,
    title: "Asistencia mensual",
    description: "Reporte completo de asistencia del mes actual por curso",
    icon: Calendar,
    date: "Agosto 2026",
    size: "245 KB",
    format: "PDF",
  },
  {
    id: 2,
    title: "Alumnos con inasistencias recurrentes",
    description: "Listado de alumnos con 3+ inasistencias en el trimestre",
    icon: Users,
    date: "Trimestre 2",
    size: "128 KB",
    format: "PDF",
  },
  {
    id: 3,
    title: "Tardanzas por curso",
    description: "Análisis de tardanzas frecuentes por sección",
    icon: TrendingUp,
    date: "Julio 2026",
    size: "89 KB",
    format: "CSV",
  },
  {
    id: 4,
    title: "Resumen anual de asistencia",
    description: "Estadísticas anuales comparativas de todos los cursos",
    icon: BarChart3,
    date: "2025",
    size: "1.2 MB",
    format: "PDF",
  },
  {
    id: 5,
    title: "Distribución de estados",
    description: "Gráfico de distribución de presentes, ausentes y tardanzas",
    icon: PieChart,
    date: "Agosto 2026",
    size: "67 KB",
    format: "PNG",
  },
  {
    id: 6,
    title: "Justificaciones pendientes",
    description: "Listado de justificaciones que requieren revisión",
    icon: FileText,
    date: "Esta semana",
    size: "45 KB",
    format: "PDF",
  },
];

const PERIODS = ["Esta semana", "Este mes", "Este trimestre", "Este año", "Personalizado"];

export default function Reportes() {
  const [period, setPeriod] = useState("Este mes");
  const [search, setSearch] = useState("");

  const filtered = REPORTS.filter(
    (r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Reportes</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Generar y exportar reportes de asistencia</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 text-sm font-bold text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)]">
            <Printer size={16} /> Imprimir
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent-text)] shadow-lg shadow-[0_4px_14px_var(--accent-glow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]">
            <Download size={16} /> Exportar todo
          </button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
              period === p ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <FileText size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Reportes generados</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">47</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">+8 este mes</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Download size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Descargas totales</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">182</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">+23 este mes</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <BarChart3 size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Asistencia promedio</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">89.3%</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">+2.1% vs. trimestre anterior</p>
        </div>
      </div>

      {/* Reports list */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <Filter size={16} className="text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar reporte..."
            className="flex-1 bg-transparent text-sm text-[var(--text-secondary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--bg-input)]/30"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-[var(--accent-text)] shadow-md">
                <r.icon size={19} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--text-primary)]">{r.title}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{r.description}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-[var(--text-muted)]">{r.date}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{r.size} · {r.format}</p>
              </div>
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
