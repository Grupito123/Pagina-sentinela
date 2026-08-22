import { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Shield,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  X,
  Check,
} from "lucide-react";

type Role = "admin" | "docente" | "alumno";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  course?: string;
  phone?: string;
  status: "active" | "inactive";
}

const INITIAL: User[] = [
  { id: 1, name: "Admin Principal", email: "admin@eestmerlo.gob.ar", role: "admin", phone: "11-5555-0001", status: "active" },
  { id: 2, name: "María González", email: "mgonzalez@eestmerlo.gob.ar", role: "docente", phone: "11-5555-0010", status: "active" },
  { id: 3, name: "Carlos Pérez", email: "cperoz@eestmerlo.gob.ar", role: "docente", phone: "11-5555-0011", status: "active" },
  { id: 4, name: "Juan López", email: "jlopez@alumnos.eestmerlo.gob.ar", role: "alumno", course: "5°A", status: "active" },
  { id: 5, name: "Ana Martínez", email: "amartinez@alumnos.eestmerlo.gob.ar", role: "alumno", course: "5°B", status: "active" },
  { id: 6, name: "Pedro García", email: "pgarcia@alumnos.eestmerlo.gob.ar", role: "alumno", course: "4°A", status: "active" },
  { id: 7, name: "Laura Díaz", email: "ldiaz@alumnos.eestmerlo.gob.ar", role: "alumno", course: "4°B", status: "active" },
  { id: 8, name: "Sofía Torres", email: "storres@alumnos.eestmerlo.gob.ar", role: "alumno", course: "3°A", status: "inactive" },
  { id: 9, name: "Diego Fernández", email: "dfernandez@alumnos.eestmerlo.gob.ar", role: "alumno", course: "3°B", status: "active" },
  { id: 10, name: "Lucía Romero", email: "lromero@eestmerlo.gob.ar", role: "docente", phone: "11-5555-0012", status: "active" },
];

const ROLE_COLORS: Record<Role, string> = {
  admin: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-bg)]",
  docente: "bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-light)]",
  alumno: "bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border)]",
};

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  docente: "Docente",
  alumno: "Alumno",
};

export default function Usuarios() {
  const [users, setUsers] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Role | "all">("all");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  const deleteUser = (id: number) => setUsers((prev) => prev.filter((u) => u.id !== id));
  const toggleStatus = (id: number) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Usuarios</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Gestionar administradores, docentes y alumnos</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent-text)] shadow-lg shadow-[0_4px_14px_var(--accent-glow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
        >
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-secondary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "admin", "docente", "alumno"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                filter === r ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {r === "all" ? "Todos" : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Usuario</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Rol</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] md:table-cell">Curso</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] lg:table-cell">Contacto</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Estado</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-[var(--border)]/50 transition-colors hover:bg-[var(--bg-input)]/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-xs font-bold text-[var(--accent-text)]">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{u.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${ROLE_COLORS[u.role]}`}>
                      {u.role === "admin" && <Shield size={12} />}
                      {u.role === "docente" && <BookOpen size={12} />}
                      {u.role === "alumno" && <GraduationCap size={12} />}
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <span className="text-sm text-[var(--text-muted)]">{u.course || "—"}</span>
                  </td>
                  <td className="hidden px-5 py-4 lg:table-cell">
                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      {u.phone ? <><Phone size={12} /> {u.phone}</> : <Mail size={12} />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      u.status === "active" ? "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-bg)]" : "bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border)]"
                    }`}>
                      {u.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setMenuId(menuId === u.id ? null : u.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuId === u.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                          <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-input)] shadow-xl shadow-black/40">
                            <button
                              onClick={() => { setEditUser(u); setMenuId(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"
                            >
                              <Pencil size={14} /> Editar
                            </button>
                            <button
                              onClick={() => { toggleStatus(u.id); setMenuId(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"
                            >
                              {u.status === "active" ? <><X size={14} /> Desactivar</> : <><Check size={14} /> Activar</>}
                            </button>
                            <button
                              onClick={() => { deleteUser(u.id); setMenuId(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-bg)]"
                            >
                              <Trash2 size={14} /> Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--text-muted)]">No se encontraron usuarios</div>
        )}
      </div>

      {/* Simple new/edit modal */}
      {(showNew || editUser) && (
        <UserModal
          user={editUser}
          onClose={() => { setShowNew(false); setEditUser(null); }}
          onSave={(u) => {
            if (editUser) setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
            else setUsers((prev) => [...prev, { ...u, id: Date.now() }]);
            setShowNew(false);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSave }: { user: User | null; onClose: () => void; onSave: (u: User) => void }) {
  const [form, setForm] = useState<User>(user || { id: 0, name: "", email: "", role: "alumno", course: "", phone: "", status: "active" });
  return (
    <>
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[201] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl shadow-black/60">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{user ? "Editar usuario" : "Nuevo usuario"}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">NOMBRE</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">EMAIL</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">ROL</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]">
                <option value="admin">Administrador</option>
                <option value="docente">Docente</option>
                <option value="alumno">Alumno</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">CURSO</label>
              <input value={form.course || ""} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="Ej: 5°A" className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">TELÉFONO</label>
            <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)]">Cancelar</button>
          <button onClick={() => onSave(form)} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent-text)] shadow-lg shadow-[0_4px_14px_var(--accent-glow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]">Guardar</button>
        </div>
      </div>
    </>
  );
}
