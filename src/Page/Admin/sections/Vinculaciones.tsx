import { useState } from "react";
import {
  Link2,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  IdCard,
  Mail,
} from "lucide-react";

// Alumnos "inscriptos" — el mismo set que Asistencia, con DNI.
// Cuando se conecte Firebase esto sale de la colección usuarios.
const ALUMNOS = [
  { dni: "42123456", nombre: "Juan López", curso: "5°A" },
  { dni: "43001122", nombre: "Ana Martínez", curso: "5°B" },
  { dni: "43555666", nombre: "Carlos García", curso: "4°A" },
  { dni: "44111223", nombre: "Laura Díaz", curso: "4°B" },
  { dni: "45222334", nombre: "Pedro Ruiz", curso: "3°A" },
  { dni: "45333445", nombre: "Sofía Torres", curso: "3°B" },
  { dni: "42444556", nombre: "Diego Fernández", curso: "5°A" },
  { dni: "43555678", nombre: "Lucía Romero", curso: "5°B" },
  { dni: "44666789", nombre: "Martín Sánchez", curso: "4°A" },
  { dni: "44777890", nombre: "Camila Herrera", curso: "4°B" },
];

interface Solicitud {
  id: number;
  padre: string;
  email: string;
  dniHijo: string;
  fecha: string;
  estado: "pendiente" | "aprobada" | "rechazada";
}

const INITIAL: Solicitud[] = [
  { id: 1, padre: "Rosa López", email: "rosa.lopez@gmail.com", dniHijo: "42123456", fecha: "2026-08-20", estado: "pendiente" },
  { id: 2, padre: "Hugo Martínez", email: "hugo.martinez@gmail.com", dniHijo: "43001122", fecha: "2026-08-21", estado: "pendiente" },
  { id: 3, padre: "Elena Díaz", email: "elena.diaz@gmail.com", dniHijo: "44111223", fecha: "2026-08-18", estado: "aprobada" },
  { id: 4, padre: "Marta Suárez", email: "marta.suarez@gmail.com", dniHijo: "99999999", fecha: "2026-08-19", estado: "pendiente" },
];

function buscarAlumno(dni: string) {
  return ALUMNOS.find((a) => a.dni === dni) || null;
}

export default function Vinculaciones() {
  const [solicitudes, setSolicitudes] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"todas" | Solicitud["estado"]>("pendiente");

  const responder = (id: number, estado: Solicitud["estado"]) => {
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s)));
    console.log(`Vinculación ${id} → ${estado}`);
  };

  const counts = {
    pendiente: solicitudes.filter((s) => s.estado === "pendiente").length,
    aprobada: solicitudes.filter((s) => s.estado === "aprobada").length,
    rechazada: solicitudes.filter((s) => s.estado === "rechazada").length,
    todas: solicitudes.length,
  };

  const filtradas = solicitudes.filter((s) => {
    const matchEstado = filtro === "todas" || s.estado === filtro;
    const q = search.toLowerCase();
    const matchSearch =
      s.padre.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.dniHijo.includes(q);
    return matchEstado && matchSearch;
  });

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Vinculaciones</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Solicitudes de padres que quieren seguir la asistencia de sus hijos
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border px-4 py-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
          <Clock size={16} style={{ color: "var(--warning)" }} />
          <span className="text-sm font-bold text-[var(--text-primary)]">{counts.pendiente} pendientes</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--bg-input)" }}>
          {(["pendiente", "aprobada", "rechazada", "todas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors"
              style={
                filtro === f
                  ? { backgroundColor: "var(--accent)", color: "var(--accent-text)" }
                  : { color: "var(--text-muted)" }
              }
            >
              {f === "pendiente" ? "Pendientes" : f === "aprobada" ? "Aprobadas" : f === "rechazada" ? "Rechazadas" : "Todas"} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por padre, email o DNI..."
            className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      {/* Lista */}
      <div className="mt-6 flex flex-col gap-4">
        {filtradas.map((s) => {
          const alumno = buscarAlumno(s.dniHijo);
          return (
            <div
              key={s.id}
              className="rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                boxShadow: "0 10px 25px -5px var(--overlay)",
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Datos del padre */}
                <div className="min-w-[200px] flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                      style={{ background: "linear-gradient(135deg, var(--violet), var(--accent-dark))" }}
                    >
                      <UserCheck size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{s.padre}</h3>
                      <p className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Mail size={12} /> {s.email}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 pl-14 text-[11px] text-[var(--text-muted)]">
                    Solicitud del {new Date(s.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Verificación DNI */}
                <div
                  className="min-w-[220px] flex-1 rounded-xl border px-4 py-3"
                  style={{
                    borderColor: alumno ? "var(--success-bg)" : "var(--error-bg)",
                    backgroundColor: alumno ? "var(--success-bg)" : "var(--error-bg)",
                  }}
                >
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    <IdCard size={12} /> DNI {s.dniHijo}
                  </p>
                  {alumno ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--success)" }}>
                      <CheckCircle2 size={15} /> {alumno.nombre} · {alumno.curso}
                    </p>
                  ) : (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--error)" }}>
                      <XCircle size={15} /> Alumno no encontrado
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  {s.estado === "pendiente" ? (
                    <>
                      <button
                        onClick={() => responder(s.id, "aprobada")}
                        disabled={!alumno}
                        title={alumno ? "Aprobar vinculación" : "No se puede aprobar sin alumno"}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                        style={{ backgroundColor: "var(--success)", color: "#ffffff" }}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} /> Aprobar
                      </button>
                      <button
                        onClick={() => responder(s.id, "rechazada")}
                        className="rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors hover:opacity-80"
                        style={{ borderColor: "var(--error-bg)", backgroundColor: "var(--error-bg)", color: "var(--error)" }}
                      >
                        <XCircle size={16} strokeWidth={2.5} />
                      </button>
                    </>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold"
                      style={
                        s.estado === "aprobada"
                          ? { borderColor: "var(--success-bg)", backgroundColor: "var(--success-bg)", color: "var(--success)" }
                          : { borderColor: "var(--error-bg)", backgroundColor: "var(--error-bg)", color: "var(--error)" }
                      }
                    >
                      {s.estado === "aprobada" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {s.estado === "aprobada" ? "Vinculado" : "Rechazada"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtradas.length === 0 && (
          <div className="rounded-2xl border border-dashed py-16 text-center" style={{ borderColor: "var(--border)" }}>
            <Link2 size={32} className="mx-auto mb-3 opacity-40" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
              No hay solicitudes {filtro !== "todas" ? filtro + "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
