import { useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
} from "lucide-react";

type Status = "present" | "absent" | "late" | "justified";

interface AttendanceRecord {
  id: number;
  student: string;
  course: string;
  time: string;
  status: Status;
  note?: string;
}

const INITIAL: AttendanceRecord[] = [
  { id: 1, student: "Juan López", course: "5°A", time: "07:55", status: "present" },
  { id: 2, student: "Ana Martínez", course: "5°B", time: "08:00", status: "present" },
  { id: 3, student: "Carlos García", course: "4°A", time: "08:22", status: "late", note: "22 min tarde" },
  { id: 4, student: "Laura Díaz", course: "4°B", time: "08:45", status: "late", note: "45 min tarde" },
  { id: 5, student: "Pedro Ruiz", course: "3°A", time: "07:58", status: "present" },
  { id: 6, student: "Sofía Torres", course: "3°B", time: "—", status: "absent" },
  { id: 7, student: "Diego Fernández", course: "5°A", time: "—", status: "absent", note: "Injustificada" },
  { id: 8, student: "Lucía Romero", course: "5°B", time: "08:02", status: "present" },
  { id: 9, student: "Martín Sánchez", course: "4°A", time: "08:10", status: "justified", note: "Cita médica" },
  { id: 10, student: "Camila Herrera", course: "4°B", time: "07:50", status: "present" },
  { id: 11, student: "Fernando Castillo", course: "3°A", time: "—", status: "absent" },
  { id: 12, student: "Valentina Morales", course: "3°B", time: "08:05", status: "present" },
  { id: 13, student: "Nicolás Vargas", course: "5°A", time: "07:59", status: "present" },
  { id: 14, student: "Isabella Cruz", course: "5°B", time: "08:30", status: "late", note: "30 min tarde" },
  { id: 15, student: "Mateo Rodríguez", course: "4°A", time: "07:48", status: "present" },
];

const STATUS_CONFIG: Record<Status, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  present: { label: "Presente", icon: CheckCircle2, color: "text-[var(--success)]", bg: "bg-[var(--success-bg)] border-[var(--border)]" },
  absent: { label: "Ausente", icon: XCircle, color: "text-[var(--error)]", bg: "bg-[var(--error-bg)] border-[var(--border)]" },
  late: { label: "Tardanza", icon: AlertTriangle, color: "text-[var(--warning)]", bg: "bg-[var(--warning-bg)] border-[var(--border)]" },
  justified: { label: "Justificada", icon: Clock, color: "text-[var(--text-muted)]", bg: "bg-[var(--bg-tertiary)] border-[var(--border)]" },
};

const COURSES = ["5°A", "5°B", "4°A", "4°B", "3°A", "3°B"];

export default function Asistencia() {
  const [records, setRecords] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const filtered = records.filter((r) => {
    const matchSearch = r.student.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "all" || r.course === courseFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  const counts = {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    justified: records.filter((r) => r.status === "justified").length,
  };

  const toggleStatus = (id: number) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const order: Status[] = ["present", "late", "absent", "justified"];
        const next = order[(order.indexOf(r.status) + 1) % order.length];
        return { ...r, status: next, time: next === "absent" ? "—" : "08:00" };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Asistencia</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Registro diario de asistencia — {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["present", "late", "absent", "justified"] as const).map((s) => {
          const c = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                statusFilter === s ? `${c.bg} ring-1 ring-[var(--border-light)]` : "border-[var(--border)] bg-[var(--bg-card)]"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
                <c.icon size={16} className={c.color} />
              </div>
              <p className="mt-2 text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{counts[s]}</p>
              <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{c.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar alumno..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-xs font-bold outline-none focus:border-[var(--accent)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <option value="all">Todos los cursos</option>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-xs font-bold transition-colors hover:bg-[var(--bg-card-hover)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Alumno</th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Curso</th>
              <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider sm:table-cell" style={{ color: "var(--text-muted)" }}>Hora</th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Estado</th>
              <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider lg:table-cell" style={{ color: "var(--text-muted)" }}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const c = STATUS_CONFIG[r.status];
              return (
                <tr key={r.id} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-card-hover)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                        style={{
                          backgroundImage: "linear-gradient(to bottom right, var(--gradient-start), var(--gradient-end))",
                          color: "var(--accent-text)",
                        }}
                      >
                        {r.student.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{r.student}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>{r.course}</td>
                  <td className="hidden px-5 py-4 text-sm sm:table-cell" style={{ color: "var(--text-muted)" }}>{r.time}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStatus(r.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-all hover:scale-105 ${c.bg} ${c.color}`}
                    >
                      <c.icon size={12} />
                      {c.label}
                    </button>
                  </td>
                  <td className="hidden px-5 py-4 text-xs lg:table-cell" style={{ color: "var(--text-muted)" }}>{r.note || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>No hay registros con esos filtros</div>
        )}
      </div>
    </div>
  );
}
