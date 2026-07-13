import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  UserCheck,
  Users,
  X,
  Save,
  IdCard,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

type Role = "alumno" | "docente" | "preceptor" | "admin";
type Status = "validado" | "pendiente" | "suspendido";

interface UserRow {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  rol: Role;
  estado: Status;
  curso?: string;
}

const SEED: UserRow[] = [
  { id: 1, nombre: "Juan Pérez", email: "juan.perez@eestmerlo.gob.ar", telefono: "0220 123-4567", dni: "42.123.456", rol: "alumno", estado: "validado", curso: "4to A" },
  { id: 2, nombre: "María González", email: "maria.gonzalez@eestmerlo.gob.ar", telefono: "0220 987-6543", dni: "43.234.567", rol: "alumno", estado: "pendiente", curso: "1ro A" },
  { id: 3, nombre: "Prof. Carlos Sosa", email: "carlos.sosa@eestmerlo.gob.ar", telefono: "0220 555-1111", dni: "28.111.222", rol: "docente", estado: "validado" },
  { id: 4, nombre: "Ana Torres", email: "ana.torres@eestmerlo.gob.ar", telefono: "0220 444-3333", dni: "29.222.333", rol: "preceptor", estado: "validado" },
  { id: 5, nombre: "Lucas Díaz", email: "lucas.diaz@eestmerlo.gob.ar", telefono: "0220 777-8888", dni: "44.345.678", rol: "alumno", estado: "suspendido", curso: "3ro A" },
  { id: 6, nombre: "Prof. Laura Gómez", email: "laura.gomez@eestmerlo.gob.ar", telefono: "0220 666-2222", dni: "27.444.555", rol: "docente", estado: "pendiente" },
  { id: 7, nombre: "Sofía Ramírez", email: "sofia.ramirez@eestmerlo.gob.ar", telefono: "0220 333-9999", dni: "45.456.789", rol: "alumno", estado: "validado", curso: "5to A" },
  { id: 8, nombre: "Admin Root", email: "admin@eestmerlo.gob.ar", telefono: "0220 000-0000", dni: "20.000.000", rol: "admin", estado: "validado" },
];

const ROLE_LABEL: Record<Role, string> = {
  alumno: "Alumno",
  docente: "Docente",
  preceptor: "Preceptor",
  admin: "Admin",
};

const ROLE_STYLE: Record<Role, string> = {
  alumno: "bg-sky-50 text-sky-700",
  docente: "bg-cyan-50 text-cyan-700",
  preceptor: "bg-violet-50 text-violet-700",
  admin: "bg-slate-800 text-white",
};

const STATUS_STYLE: Record<Status, { label: string; cls: string; dot: string }> = {
  validado: { label: "Validado", cls: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  pendiente: { label: "Pendiente", cls: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  suspendido: { label: "Suspendido", cls: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
};

const ROLE_ICONS: Record<Role, typeof Users> = {
  alumno: GraduationCap,
  docente: Users,
  preceptor: UserCheck,
  admin: ShieldCheck,
};

export default function Usuarios() {
  const [users, setUsers] = useState<UserRow[]>(SEED);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "todos">("todos");
  const [statusFilter, setStatusFilter] = useState<Status | "todos">("todos");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; user: UserRow | null }>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = query.toLowerCase();
      const matchQ = !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.dni.includes(q);
      const matchR = roleFilter === "todos" || u.rol === roleFilter;
      const matchS = statusFilter === "todos" || u.estado === statusFilter;
      return matchQ && matchR && matchS;
    });
  }, [users, query, roleFilter, statusFilter]);

  const updateStatus = (id: number, estado: Status) => {
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, estado } : u)));
    setMenuId(null);
  };

  const deleteUser = (id: number) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    setMenuId(null);
  };

  const saveUser = (u: UserRow) => {
    setUsers((p) => {
      const exists = p.some((x) => x.id === u.id);
      if (exists) return p.map((x) => (x.id === u.id ? u : x));
      return [...p, { ...u, id: Math.max(0, ...p.map((x) => x.id)) + 1 }];
    });
    setModal(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Gestión de usuarios</h1>
          <p className="mt-1 text-sm text-slate-500">
            Validá, editá y administrá las cuentas del sistema
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", user: null })}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:bg-sky-700"
        >
          <Plus size={16} strokeWidth={2.5} /> Nuevo usuario
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email o DNI..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "todos")}
          className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400 focus:bg-white"
        >
          <option value="todos">Todos los roles</option>
          <option value="alumno">Alumnos</option>
          <option value="docente">Docentes</option>
          <option value="preceptor">Preceptores</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "todos")}
          className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400 focus:bg-white"
        >
          <option value="todos">Todos los estados</option>
          <option value="validado">Validados</option>
          <option value="pendiente">Pendientes</option>
          <option value="suspendido">Suspendidos</option>
        </select>

        <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-slate-400">
          <Filter size={15} /> {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Usuario</th>
                <th className="px-5 py-3.5">Rol</th>
                <th className="hidden px-5 py-3.5 md:table-cell">Contacto</th>
                <th className="hidden px-5 py-3.5 lg:table-cell">Curso</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const st = STATUS_STYLE[u.estado];
                const RoleIcon = ROLE_ICONS[u.rol];
                return (
                  <tr key={u.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                          {u.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-800">{u.nombre}</p>
                          <p className="truncate text-xs text-slate-400">DNI {u.dni}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${ROLE_STYLE[u.rol]}`}>
                        <RoleIcon size={12} strokeWidth={2.5} />
                        {ROLE_LABEL[u.rol]}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {u.email}</span>
                        <span className="flex items-center gap-1.5"><Phone size={12} /> {u.telefono}</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 lg:table-cell">
                      {u.curso ? (
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{u.curso}</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${st.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuId(menuId === u.id ? null : u.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreVertical size={17} />
                        </button>
                        {menuId === u.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                            <div className="absolute right-0 top-9 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10 animate-[fade-in_0.15s_ease-out_both]">
                              {u.estado !== "validado" && (
                                <button
                                  onClick={() => updateStatus(u.id, "validado")}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                                >
                                  <CheckCircle2 size={15} /> Validar
                                </button>
                              )}
                              {u.estado !== "suspendido" && (
                                <button
                                  onClick={() => updateStatus(u.id, "suspendido")}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                                >
                                  <XCircle size={15} /> Suspender
                                </button>
                              )}
                              <button
                                onClick={() => { setModal({ mode: "edit", user: u }); setMenuId(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                              >
                                <Edit size={15} /> Editar
                              </button>
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 size={15} /> Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Users size={32} className="mx-auto text-slate-200" />
                    <p className="mt-3 text-sm font-semibold text-slate-400">No se encontraron usuarios</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={() => setModal(null)}
          onSave={saveUser}
        />
      )}
    </div>
  );
}

function UserModal({
  mode,
  user,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  user: UserRow | null;
  onClose: () => void;
  onSave: (u: UserRow) => void;
}) {
  const [form, setForm] = useState<UserRow>(
    user ?? {
      id: 0,
      nombre: "",
      email: "",
      telefono: "",
      dni: "",
      rol: "alumno",
      estado: "pendiente",
      curso: "",
    }
  );

  const set = (k: keyof UserRow, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-[fade-up_0.25s_ease-out_both]">
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-extrabold text-slate-900">
            {mode === "add" ? "Nuevo usuario" : "Editar usuario"}
          </h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="max-h-[70vh] overflow-y-auto p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nombre completo</Label>
              <Input icon={<UserCheck size={16} />} value={form.nombre} onChange={(v) => set("nombre", v)} placeholder="Juan Pérez" required />
            </div>
            <div>
              <Label>DNI</Label>
              <Input icon={<IdCard size={16} />} value={form.dni} onChange={(v) => set("dni", v)} placeholder="42.123.456" required />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input icon={<Phone size={16} />} value={form.telefono} onChange={(v) => set("telefono", v)} placeholder="0220 000-0000" />
            </div>
            <div className="sm:col-span-2">
              <Label>Correo electrónico</Label>
              <Input icon={<Mail size={16} />} type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="usuario@eestmerlo.gob.ar" required />
            </div>
            <div>
              <Label>Rol</Label>
              <Select value={form.rol} onChange={(v) => set("rol", v)} options={[
                { value: "alumno", label: "Alumno" },
                { value: "docente", label: "Docente" },
                { value: "preceptor", label: "Preceptor" },
                { value: "admin", label: "Admin" },
              ]} />
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={form.estado} onChange={(v) => set("estado", v)} options={[
                { value: "pendiente", label: "Pendiente" },
                { value: "validado", label: "Validado" },
                { value: "suspendido", label: "Suspendido" },
              ]} />
            </div>
            {form.rol === "alumno" && (
              <div className="sm:col-span-2">
                <Label>Curso</Label>
                <Input icon={<GraduationCap size={16} />} value={form.curso ?? ""} onChange={(v) => set("curso", v)} placeholder="Ej: 4to A" />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:bg-sky-700">
              <Save size={16} strokeWidth={2.5} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">{children}</label>;
}
function Input({ icon, type = "text", value, onChange, placeholder, required }: { icon: React.ReactNode; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10" />
    </div>
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm text-slate-900 outline-none transition-all focus:border-sky-400 focus:bg-white">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
    </div>
  );
}
