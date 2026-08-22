import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  User,
  BookOpen,
  GraduationCap,
  Baby,
  Crown,
  Eye,
  Trash2,
  X,
  AlertTriangle,
  CalendarDays,
  Pencil,
} from "lucide-react";

type Role = "directivo" | "docente" | "preceptor" | "alumno" | "padre";
type AuthStatus = "pending" | "approved" | "denied" | "expired";

interface AuthRequest {
  id: number;
  title: string;
  description: string;
  requester: string;
  role: Role;
  target?: string;
  status: AuthStatus;
  date: string;
  expires?: string;
  priority: "high" | "medium" | "low";
}

interface RolePermission {
  role: Role;
  label: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  permissions: string[];
  users: number;
  activeAuths: number;
}

const ROLES: RolePermission[] = [
  {
    role: "directivo",
    label: "Directivos",
    icon: Crown,
    color: "text-[var(--error)]",
    bgColor: "bg-[var(--error-bg)] border-[var(--error-bg)]",
    permissions: [
      "Gestión completa del sistema",
      "Aprobación de autorizaciones especiales",
      "Configuración institucional",
      "Reportes ejecutivos",
      "Gestión de usuarios y roles",
    ],
    users: 3,
    activeAuths: 5,
  },
  {
    role: "docente",
    label: "Docentes",
    icon: BookOpen,
    color: "text-[var(--info)]",
    bgColor: "bg-[var(--info-bg)] border-[var(--info-bg)]",
    permissions: [
      "Registro de asistencia de sus cursos",
      "Calificación de alumnos",
      "Envío de notificaciones a padres",
      "Generación de reportes de curso",
      "Solicitud de autorizaciones especiales",
    ],
    users: 24,
    activeAuths: 12,
  },
  {
    role: "preceptor",
    label: "Preceptores",
    icon: ShieldCheck,
    color: "text-[var(--warning)]",
    bgColor: "bg-[var(--warning-bg)] border-[var(--warning-bg)]",
    permissions: [
      "Control de asistencia general",
      "Gestión de turnos y horarios",
      "Autorización de ingreso/salida",
      "Supervisión de puntuales",
      "Reportes de disciplina",
    ],
    users: 8,
    activeAuths: 18,
  },
  {
    role: "alumno",
    label: "Alumnos",
    icon: GraduationCap,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-bg)] border-[var(--success-bg)]",
    permissions: [
      "Consulta de asistencia personal",
      "Visualización de horarios",
      "Solicitud de justificaciones",
      "Acceso a calificaciones",
      "Notificaciones importantes",
    ],
    users: 342,
    activeAuths: 45,
  },
  {
    role: "padre",
    label: "Padres",
    icon: Baby,
    color: "text-[var(--violet)]",
    bgColor: "bg-[var(--violet-bg)] border-[var(--violet-bg)]",
    permissions: [
      "Consulta de asistencia del hijo",
      "Recepción de notificaciones",
      "Justificación de inasistencias",
      "Comunicación con docentes",
      "Seguimiento de calificaciones",
    ],
    users: 287,
    activeAuths: 32,
  },
];

const INITIAL_REQUESTS: AuthRequest[] = [
  {
    id: 1,
    title: "Permiso de salida anticipada",
    description: "El alumno solicita salida a las 12:00 por cita médica",
    requester: "María López (Madre)",
    role: "padre",
    target: "Juan López - 5°A",
    status: "pending",
    date: "2026-08-20",
    expires: "2026-08-20",
    priority: "high",
  },
  {
    id: 2,
    title: "Autorización de viaje educativo",
    description: "Solicitud de permiso para excursión a la planta de Treats",
    requester: "Prof. Carlos Ruiz",
    role: "docente",
    target: "Curso 4°A - 38 alumnos",
    status: "pending",
    date: "2026-08-19",
    expires: "2026-08-25",
    priority: "medium",
  },
  {
    id: 3,
    title: "Acceso al sistema de reportes",
    description: "Solicitud de acceso completo a módulo de reportes estadísticos",
    requester: "Ing. Roberto Martínez",
    role: "directivo",
    status: "approved",
    date: "2026-08-18",
    priority: "low",
  },
  {
    id: 4,
    title: "Registro de asistencia externa",
    description: "Autorización para registrar asistencia en jornada de puertas abiertas",
    requester: "Preceptora Ana García",
    role: "preceptor",
    target: "Jornada puertas abiertas - 15/09",
    status: "pending",
    date: "2026-08-17",
    expires: "2026-09-15",
    priority: "medium",
  },
  {
    id: 5,
    title: "Justificación de inasistencia",
    description: "Presenta certificado médico por 3 días de inasistencia",
    requester: "Pedro Sánchez (Padre)",
    role: "padre",
    target: "Camila Sánchez - 3°B",
    status: "approved",
    date: "2026-08-16",
    priority: "low",
  },
  {
    id: 6,
    title: "Acceso a calificaciones anticipadas",
    description: "Solicitud de acceso anticipado a notas del primer trimestre",
    requester: "Lucía Fernández",
    role: "alumno",
    status: "denied",
    date: "2026-08-15",
    priority: "low",
  },
  {
    id: 7,
    title: "Autorización de uso de laboratorio",
    description: "Uso del laboratorio de informática para proyecto especial",
    requester: "Prof. Diego Morales",
    role: "docente",
    target: "Laboratorio Info - 08/09",
    status: "pending",
    date: "2026-08-14",
    expires: "2026-09-08",
    priority: "high",
  },
  {
    id: 8,
    title: "Permiso de permanencia after-school",
    description: "Autorización para quedarse después del horario habitual",
    requester: "Martín López",
    role: "alumno",
    target: "Club de Robótica - Martes y Jueves",
    status: "approved",
    date: "2026-08-13",
    priority: "low",
  },
  {
    id: 9,
    title: "Control de acceso a zona restringida",
    description: "Acceso al depósito de materiales para inventario anual",
    requester: "Preceptor Juan Díaz",
    role: "preceptor",
    target: "Depósito - Solo personal autorizado",
    status: "pending",
    date: "2026-08-12",
    priority: "high",
  },
  {
    id: 10,
    title: "Autorización de récord de asistencia",
    description: "Solicitud para modificar récord de asistencia del alumno (error de carga)",
    requester: "Ing. Roberto Martínez",
    role: "directivo",
    target: "Sistema de registros - Año 2025",
    status: "approved",
    date: "2026-08-11",
    priority: "medium",
  },
];

const ROLE_FILTERS: { key: Role | "all"; label: string; icon: typeof Shield }[] = [
  { key: "all", label: "Todos", icon: Shield },
  { key: "directivo", label: "Directivos", icon: Crown },
  { key: "docente", label: "Docentes", icon: BookOpen },
  { key: "preceptor", label: "Preceptores", icon: ShieldCheck },
  { key: "alumno", label: "Alumnos", icon: GraduationCap },
  { key: "padre", label: "Padres", icon: Baby },
];

const STATUS_CONFIG: Record<AuthStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  pending: { label: "Pendiente", icon: Clock, color: "text-[var(--warning)]", bg: "bg-[var(--warning-bg)] border-[var(--warning-bg)]" },
  approved: { label: "Aprobada", icon: CheckCircle2, color: "text-[var(--success)]", bg: "bg-[var(--success-bg)] border-[var(--success-bg)]" },
  denied: { label: "Denegada", icon: XCircle, color: "text-[var(--error)]", bg: "bg-[var(--error-bg)] border-[var(--error-bg)]" },
  expired: { label: "Expirada", icon: AlertTriangle, color: "text-[var(--text-muted)]", bg: "bg-[var(--bg-card-hover)] border-[var(--border-light)]" },
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-bg)]",
  medium: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-bg)]",
  low: "bg-[var(--bg-card-hover)] text-[var(--text-muted)] border-[var(--border-light)]",
};

const ROLE_ICONS: Record<Role, typeof Shield> = {
  directivo: Crown,
  docente: BookOpen,
  preceptor: ShieldCheck,
  alumno: GraduationCap,
  padre: Baby,
};

const ROLE_COLORS_BADGE: Record<Role, string> = {
  directivo: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-bg)]",
  docente: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info-bg)]",
  preceptor: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-bg)]",
  alumno: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-bg)]",
  padre: "bg-[var(--violet-bg)] text-[var(--violet)] border-[var(--violet-bg)]",
};

export default function Autorizaciones() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AuthStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"requests" | "roles">("requests");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [detailRequest, setDetailRequest] = useState<AuthRequest | null>(null);

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.requester.toLowerCase().includes(search.toLowerCase()) ||
      (r.target && r.target.toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleFilter === "all" || r.role === roleFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    denied: requests.filter((r) => r.status === "denied").length,
    expired: requests.filter((r) => r.status === "expired").length,
  };

  const updateStatus = (id: number, status: AuthStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setMenuId(null);
    setDetailRequest(null);
  };

  const deleteRequest = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setMenuId(null);
    setDetailRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Autorizaciones</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Gestionar permisos y autorizaciones por rol</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === "requests" ? "roles" : "requests")}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 text-sm font-bold text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)]"
          >
            <Eye size={16} />
            {view === "requests" ? "Ver roles" : "Ver solicitudes"}
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["pending", "approved", "denied", "expired"] as const).map((s) => {
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
              <p className="mt-2 text-2xl font-extrabold text-[var(--accent-text)]">{counts[s]}</p>
              <p className="text-xs font-semibold text-[var(--text-muted)]">{c.label}</p>
            </button>
          );
        })}
      </div>

      {view === "requests" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, solicitante o destino..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-secondary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {ROLE_FILTERS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRoleFilter(r.key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                    roleFilter === r.key ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <r.icon size={13} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Requests list */}
          <div className="space-y-3">
            {filtered.map((r) => {
              const s = STATUS_CONFIG[r.status];
              const RoleIcon = ROLE_ICONS[r.role];
              return (
                <div
                  key={r.id}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start gap-4">
                    {/* Role badge */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ROLE_COLORS_BADGE[r.role]}`}>
                      <RoleIcon size={18} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-[var(--text-primary)]">{r.title}</h3>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[r.priority]}`}>
                              {r.priority === "high" ? "Alta" : r.priority === "medium" ? "Media" : "Baja"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">{r.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="relative shrink-0">
                          <button
                            onClick={() => setMenuId(menuId === r.id ? null : r.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                          >
                            <ChevronDown size={16} />
                          </button>
                          {menuId === r.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                              <div className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-input)] shadow-xl shadow-black/40">
                                <button
                                  onClick={() => { setDetailRequest(r); setMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"
                                >
                                  <Eye size={14} /> Ver detalle
                                </button>
                                {r.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => updateStatus(r.id, "approved")}
                                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--success)] hover:bg-[var(--success-bg)]"
                                    >
                                      <CheckCircle2 size={14} /> Aprobar
                                    </button>
                                    <button
                                      onClick={() => updateStatus(r.id, "denied")}
                                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-bg)]"
                                    >
                                      <XCircle size={14} /> Denegar
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => deleteRequest(r.id)}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-bg)]"
                                >
                                  <Trash2 size={14} /> Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {r.requester}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} /> {r.date}
                        </span>
                        {r.target && (
                          <span className="rounded-lg bg-[var(--bg-card-hover)] px-2 py-0.5 text-[var(--text-muted)]">
                            {r.target}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.bg}`}>
                          <s.icon size={10} /> {s.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-[var(--text-muted)]">No hay autorizaciones con esos filtros</div>
            )}
          </div>
        </>
      ) : (
        /* Roles view */
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${r.bgColor.replace("border-", "to-")} opacity-[0.06] blur-2xl`} />

              <div className="relative flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${r.bgColor} shadow-md`}>
                  <r.icon size={22} className={r.color} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{r.label}</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {r.users} usuarios · {r.activeAuths} activas
                  </p>
                </div>
              </div>

              <div className="relative mt-5 space-y-2">
                {r.permissions.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${r.color}`} />
                    <span className="text-xs text-[var(--text-muted)]">{p}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 flex gap-2">
                <button
                  onClick={() => { setRoleFilter(r.role); setView("requests"); }}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-input)] py-2 text-xs font-bold text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                >
                  Ver solicitudes
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]">
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {detailRequest && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={() => setDetailRequest(null)} />
          <div className="fixed left-1/2 top-1/2 z-[201] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl shadow-black/60">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Detalle de autorización</h2>
              <button onClick={() => setDetailRequest(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const RoleIcon = ROLE_ICONS[detailRequest.role];
                  return (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ROLE_COLORS_BADGE[detailRequest.role]}`}>
                      <RoleIcon size={18} />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">{detailRequest.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{detailRequest.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Solicitante</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{detailRequest.requester}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Rol</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)] capitalize">{detailRequest.role}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Fecha</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{detailRequest.date}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Estado</p>
                  <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${STATUS_CONFIG[detailRequest.status].bg} ${STATUS_CONFIG[detailRequest.status].color}`}>
                    {STATUS_CONFIG[detailRequest.status].label}
                  </span>
                </div>
              </div>

              {detailRequest.target && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Destino / Alcance</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{detailRequest.target}</p>
                </div>
              )}

              {detailRequest.expires && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Vencimiento</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{detailRequest.expires}</p>
                </div>
              )}
            </div>

            {detailRequest.status === "pending" && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => updateStatus(detailRequest.id, "denied")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--error-bg)] bg-[var(--error-bg)] py-2.5 text-sm font-bold text-[var(--error)] transition-all hover:opacity-80"
                >
                  <XCircle size={16} /> Denegar
                </button>
                <button
                  onClick={() => updateStatus(detailRequest.id, "approved")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--success)] py-2.5 text-sm font-bold text-white shadow-lg  transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                  <CheckCircle2 size={16} /> Aprobar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
