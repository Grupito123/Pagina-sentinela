import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Shield,
  GraduationCap,
  BookOpen,
  UserCog,
  Briefcase,
  Baby,
  Mail,
  Phone,
  Link2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  IdCard,
  Pencil,
  UserPlus,
  Power,
  Trash2,
  X,
  KeyRound,
} from "lucide-react";
import {
  obtenerCuentas,
  editarCuenta,
  crearCuentaAdmin,
  cambiarEstadoCuenta,
  eliminarPerfil,
  type UsuarioCuenta,
  type EditarCuentaInput,
} from "../../../Firebase/services/usuarios";
import { obtenerAlumnosDisponibles, type Alumno } from "../../../Firebase/services/alumnos";
import { CATEGORIAS_CUENTAS, ETIQUETAS_ROL, ROLES, type Rol } from "../../../Firebase/roles";

/**
 * Usuarios / Administración — cuentas separadas por rol.
 *
 * Cada categoría es exactamente "documentos de `usuarios` cuyo campo `rol` vale
 * ese valor". La clasificación NO se infiere de la existencia de una ficha en
 * `alumnos/`: una cuenta con `rol: "alumno"` y `alumnoId: null` aparece igual en
 * Alumnos, esperando a que la institución la vincule.
 *
 * El listado anterior era un array hardcodeado de 10 personas con roles
 * inventados (`admin`, `docente`) mezclados en una sola tabla, sin leer nada de
 * Firestore. Ahora todo lo que se muestra y se edita es real.
 *
 * Leer otros perfiles y modificarlos lo permite únicamente `esAdmin()` en
 * `firestore.rules`, por eso la ruta está restringida a administradores.
 */

const ICONOS: Record<Rol, typeof Shield> = {
  [ROLES.ADMIN]: Shield,
  [ROLES.DIRECTIVO]: Briefcase,
  [ROLES.PRECEPTOR]: UserCog,
  [ROLES.PROFESOR]: BookOpen,
  [ROLES.ALUMNO]: GraduationCap,
  [ROLES.PADRE]: Baby,
};

const ESTILOS_ROL: Record<Rol, string> = {
  [ROLES.ADMIN]: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-bg)]",
  [ROLES.DIRECTIVO]: "bg-[var(--violet-bg)] text-[var(--violet)] border-[var(--violet-bg)]",
  [ROLES.PRECEPTOR]: "bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-light)]",
  [ROLES.PROFESOR]: "bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-light)]",
  [ROLES.ALUMNO]: "bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border)]",
  [ROLES.PADRE]: "bg-[var(--violet-bg)] text-[var(--violet)] border-[var(--violet-bg)]",
};

const ROLES_EDITABLES: Rol[] = [
  ROLES.ADMIN,
  ROLES.DIRECTIVO,
  ROLES.PRECEPTOR,
  ROLES.PROFESOR,
  ROLES.ALUMNO,
  ROLES.PADRE,
];

function iniciales(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || "?";
}

function fechaCorta(valor: unknown): string {
  if (!valor) return "—";
  const fecha = valor as { toDate?: () => Date };
  const date = typeof fecha.toDate === "function" ? fecha.toDate() : new Date(String(valor));
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

const CAMPO =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]";
const ETIQUETA = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]";

type Formulario = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: string;
  telefono: string;
  dniVinculado: string;
  rol: Rol;
  alumnoId: string;
  hijoAlumnoId: string;
};

const FORMULARIO_VACIO: Formulario = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  dni: "",
  telefono: "",
  dniVinculado: "",
  rol: ROLES.ALUMNO,
  alumnoId: "",
  hijoAlumnoId: "",
};

export default function Usuarios() {
  const [cuentas, setCuentas] = useState<UsuarioCuenta[]>([]);
  const [categoria, setCategoria] = useState<Rol>(ROLES.ALUMNO);
  const [search, setSearch] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [modal, setModal] = useState<"crear" | "editar" | null>(null);
  const [editando, setEditando] = useState<UsuarioCuenta | null>(null);
  const [form, setForm] = useState<Formulario>(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setCuentas(await obtenerCuentas());
    } catch (err) {
      const base = err instanceof Error ? err.message : "No se pudieron leer las cuentas.";
      setError(
        `${base} — Solo un administrador puede leer las cuentas de los demás. Si sos administrador, revisá que tu perfil tenga rol "administrador".`,
      );
    } finally {
      setCargando(false);
    }
  }, []);

  // Se dispara desde la callback de la promesa para no setear estado de forma
  // sincrónica dentro del cuerpo del efecto.
  useEffect(() => {
    let vivo = true;
    obtenerCuentas()
      .then((datos) => {
        if (!vivo) return;
        setCuentas(datos);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!vivo) return;
        const base = err instanceof Error ? err.message : "No se pudieron leer las cuentas.";
        setError(
          `${base} — Solo un administrador puede leer las cuentas de los demás. Si sos administrador, revisá que tu perfil tenga rol "administrador".`,
        );
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  // Las fichas de alumnos se piden una sola vez: alimentan los selectores de
  // vinculación del formulario.
  useEffect(() => {
    if (modal === null) return;
    let vivo = true;
    obtenerAlumnosDisponibles()
      .then((datos) => {
        if (vivo) setAlumnos(datos);
      })
      .catch(() => {
        if (vivo) setAlumnos([]);
      });
    return () => {
      vivo = false;
    };
  }, [modal]);

  const porCategoria = useMemo(() => {
    const mapa = {} as Record<Rol, UsuarioCuenta[]>;
    for (const rol of CATEGORIAS_CUENTAS) mapa[rol] = [];
    for (const cuenta of cuentas) {
      if (mapa[cuenta.rol as Rol]) mapa[cuenta.rol as Rol].push(cuenta);
    }
    return mapa;
  }, [cuentas]);

  const visibles = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = porCategoria[categoria] ?? [];
    if (!term) return base;
    return base.filter((cuenta) =>
      [cuenta.nombre, cuenta.apellido, cuenta.email, cuenta.dni, cuenta.dniVinculado ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [porCategoria, categoria, search]);

  function abrirCrear() {
    setForm(FORMULARIO_VACIO);
    setEditando(null);
    setErrorForm(null);
    setModal("crear");
  }

  function abrirEditar(cuenta: UsuarioCuenta) {
    setForm({
      nombre: cuenta.nombre,
      apellido: cuenta.apellido,
      email: cuenta.email,
      password: "",
      dni: cuenta.dni,
      telefono: cuenta.telefono,
      dniVinculado: cuenta.dniVinculado ?? "",
      rol: cuenta.rol,
      alumnoId: cuenta.alumnoId ?? "",
      hijoAlumnoId: cuenta.hijoAlumnoId ?? "",
    });
    setEditando(cuenta);
    setErrorForm(null);
    setModal("editar");
  }

  function cerrarModal() {
    setModal(null);
    setEditando(null);
    setErrorForm(null);
  }

  function setCampo<K extends keyof Formulario>(campo: K, valor: Formulario[K]) {
    setForm((previo) => ({ ...previo, [campo]: valor }));
  }

  async function guardar() {
    setErrorForm(null);

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setErrorForm("Completá nombre y apellido.");
      return;
    }

    setGuardando(true);
    try {
      if (modal === "crear") {
        if (!form.email.trim()) {
          setErrorForm("Completá el correo.");
          return;
        }
        if (form.password.length < 6) {
          setErrorForm("La contraseña debe tener al menos 6 caracteres.");
          return;
        }
        await crearCuentaAdmin({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          rol: form.rol,
          dni: form.dni,
          telefono: form.telefono,
          alumnoId: form.rol === ROLES.ALUMNO ? form.alumnoId || null : null,
          hijoAlumnoId: form.rol === ROLES.PADRE ? form.hijoAlumnoId || null : null,
        });
      } else if (editando) {
        const cambios: EditarCuentaInput = {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          dni: form.dni,
          rol: form.rol,
        };
        if (form.rol === ROLES.PADRE) {
          cambios.dniVinculado = form.dniVinculado.trim() || null;
          cambios.hijoAlumnoId = form.hijoAlumnoId || null;
        } else {
          // Al cambiar de rol, se limpian los vinculos que ya no aplican: dejarlos
          // seria data muerta que ademas puede abrir permisos que no corresponden
          // (por ejemplo un hijoAlumnoId en una cuenta que ya no es de un padre).
          cambios.dniVinculado = null;
          cambios.hijoAlumnoId = null;
          cambios.alumnoId = form.alumnoId || null;
        }
        await editarCuenta(editando.uid, cambios);
      }

      cerrarModal();
      await cargar();
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : "No se pudo guardar la cuenta.");
    } finally {
      setGuardando(false);
    }
  }

  async function alternarActivo(cuenta: UsuarioCuenta) {
    try {
      await cambiarEstadoCuenta(cuenta.uid, !cuenta.activo);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el estado.");
    }
  }

  async function borrar(cuenta: UsuarioCuenta) {
    try {
      await eliminarPerfil(cuenta.uid);
      setConfirmandoBorrado(null);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el perfil.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Usuarios / Administración
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Cuentas separadas por rol. Cada categoría lee <code>usuarios/&#123;uid&#125;.rol</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent-text)] transition-opacity hover:opacity-80"
          >
            <UserPlus size={16} /> Nueva cuenta
          </button>
          <button
            onClick={() => void cargar()}
            disabled={cargando}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {cargando ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--error-bg)] bg-[var(--error-bg)] px-4 py-3 text-[var(--error)]">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Categorías por rol */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS_CUENTAS.map((rol) => {
          const IconoCat = ICONOS[rol];
          const activa = categoria === rol;
          const total = porCategoria[rol]?.length ?? 0;
          return (
            <button
              key={rol}
              onClick={() => setCategoria(rol)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                activa
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]"
                  : "border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <IconoCat size={16} />
              {ETIQUETAS_ROL[rol]}
              <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">{total}</span>
            </button>
          );
        })}
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Buscar en ${ETIQUETAS_ROL[categoria].toLowerCase()} por nombre, email o DNI...`}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-secondary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
        />
      </div>

      {/* Listado */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Cuenta
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Rol
                </th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] md:table-cell">
                  Contacto
                </th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] lg:table-cell">
                  Ficha
                </th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] sm:table-cell">
                  Alta
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Estado
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((cuenta) => (
                <tr
                  key={cuenta.uid}
                  className="border-b border-[var(--border)]/50 transition-colors hover:bg-[var(--bg-input)]/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-xs font-bold text-[var(--accent-text)]">
                        {iniciales(cuenta.nombre, cuenta.apellido)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--text-primary)]">{cuenta.nombreCompleto}</p>
                        <p className="truncate text-xs text-[var(--text-muted)]">{cuenta.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {(() => {
                      const IconoRol = ICONOS[cuenta.rol as Rol] ?? GraduationCap;
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${ESTILOS_ROL[cuenta.rol as Rol] ?? ESTILOS_ROL[ROLES.ALUMNO]}`}
                        >
                          <IconoRol size={12} />
                          {cuenta.rol}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <Mail size={11} /> {cuenta.email || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        {cuenta.telefono ? (
                          <>
                            <Phone size={11} /> {cuenta.telefono}
                          </>
                        ) : (
                          <>
                            <IdCard size={11} /> {cuenta.dni || "sin DNI"}
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 lg:table-cell">
                    {cuenta.rol === ROLES.ALUMNO ? (
                      cuenta.alumnoId ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--success)]">
                          <Link2 size={12} /> {cuenta.alumnoId}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">sin vincular</span>
                      )
                    ) : cuenta.rol === ROLES.PADRE ? (
                      cuenta.hijoAlumnoId ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--success)]">
                          <Link2 size={12} /> {cuenta.hijoAlumnoId}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">sin vincular hijo</span>
                      )
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="hidden px-5 py-4 text-xs text-[var(--text-muted)] sm:table-cell">
                    {fechaCorta(cuenta.fechaCreacion)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        cuenta.activo
                          ? "border border-[var(--success-bg)] bg-[var(--success-bg)] text-[var(--success)]"
                          : "border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)]"
                      }`}
                    >
                      {cuenta.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => abrirEditar(cuenta)}
                        title="Editar"
                        aria-label={`Editar ${cuenta.nombreCompleto}`}
                        className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-2 text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => void alternarActivo(cuenta)}
                        title={cuenta.activo ? "Desactivar" : "Activar"}
                        aria-label={cuenta.activo ? "Desactivar" : "Activar"}
                        className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-2 text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Power size={14} />
                      </button>
                      {confirmandoBorrado === cuenta.uid ? (
                        <span className="flex items-center gap-1.5">
                          <button
                            onClick={() => void borrar(cuenta)}
                            className="rounded-lg border border-[var(--error)] bg-[var(--error-bg)] px-2 py-1.5 text-xs font-bold text-[var(--error)]"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmandoBorrado(null)}
                            className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-2 text-[var(--text-muted)]"
                            aria-label="Cancelar"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmandoBorrado(cuenta.uid)}
                          title="Eliminar perfil"
                          aria-label={`Eliminar perfil de ${cuenta.nombreCompleto}`}
                          className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-2 text-[var(--text-muted)] transition-colors hover:border-[var(--error)] hover:text-[var(--error)]"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!cargando && visibles.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--text-muted)]">
            No hay cuentas en {ETIQUETAS_ROL[categoria].toLowerCase()}
            {search ? " para esa búsqueda" : ""}.
          </div>
        )}
        {cargando && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--text-muted)]">
            <Loader2 size={16} className="animate-spin" /> Cargando cuentas...
          </div>
        )}
      </div>

      {/* Modal de alta / edicion */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
                {modal === "crear" ? "Nueva cuenta" : `Editar ${editando?.nombreCompleto ?? ""}`}
              </h2>
              <button
                onClick={cerrarModal}
                className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)]"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {errorForm && (
                <div className="flex items-start gap-2 rounded-xl border border-[var(--error-bg)] bg-[var(--error-bg)] px-3 py-2.5 text-[var(--error)]">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold">{errorForm}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={ETIQUETA} htmlFor="f-nombre">
                    Nombre
                  </label>
                  <input
                    id="f-nombre"
                    className={CAMPO}
                    value={form.nombre}
                    onChange={(e) => setCampo("nombre", e.target.value)}
                  />
                </div>
                <div>
                  <label className={ETIQUETA} htmlFor="f-apellido">
                    Apellido
                  </label>
                  <input
                    id="f-apellido"
                    className={CAMPO}
                    value={form.apellido}
                    onChange={(e) => setCampo("apellido", e.target.value)}
                  />
                </div>
                <div>
                  <label className={ETIQUETA} htmlFor="f-email">
                    Correo
                  </label>
                  <input
                    id="f-email"
                    type="email"
                    className={CAMPO}
                    value={form.email}
                    disabled={modal === "editar"}
                    placeholder={modal === "editar" ? "No se puede cambiar" : "persona@escuela.edu"}
                    onChange={(e) => setCampo("email", e.target.value)}
                  />
                  {modal === "editar" && (
                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      El correo es la identidad en Authentication: cambiarlo acá solo desincroniza la base.
                    </p>
                  )}
                </div>
                {modal === "crear" && (
                  <div>
                    <label className={ETIQUETA} htmlFor="f-password">
                      Contraseña
                    </label>
                    <input
                      id="f-password"
                      type="password"
                      className={CAMPO}
                      value={form.password}
                      autoComplete="new-password"
                      onChange={(e) => setCampo("password", e.target.value)}
                    />
                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Se guarda en Authentication, nunca en Firestore. Mínimo 6 caracteres.
                    </p>
                  </div>
                )}
                <div>
                  <label className={ETIQUETA} htmlFor="f-dni">
                    DNI
                  </label>
                  <input
                    id="f-dni"
                    className={CAMPO}
                    value={form.dni}
                    onChange={(e) => setCampo("dni", e.target.value)}
                  />
                </div>
                <div>
                  <label className={ETIQUETA} htmlFor="f-telefono">
                    Teléfono
                  </label>
                  <input
                    id="f-telefono"
                    className={CAMPO}
                    value={form.telefono}
                    onChange={(e) => setCampo("telefono", e.target.value)}
                  />
                </div>
                <div>
                  <label className={ETIQUETA} htmlFor="f-rol">
                    Rol
                  </label>
                  <select
                    id="f-rol"
                    className={CAMPO}
                    value={form.rol}
                    onChange={(e) => setCampo("rol", e.target.value as Rol)}
                  >
                    {ROLES_EDITABLES.map((rol) => (
                      <option key={rol} value={rol}>
                        {ETIQUETAS_ROL[rol]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {form.rol === ROLES.ALUMNO && (
                <div>
                  <label className={ETIQUETA} htmlFor="f-alumno">
                    Ficha de alumno
                  </label>
                  <select
                    id="f-alumno"
                    className={CAMPO}
                    value={form.alumnoId}
                    onChange={(e) => setCampo("alumnoId", e.target.value)}
                  >
                    <option value="">— Sin vincular —</option>
                    {alumnos.map((alumno) => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombreCompleto} · {alumno.dni || alumno.legajo || alumno.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.rol === ROLES.PADRE && (
                <>
                  <div className="rounded-xl border border-[var(--violet-bg)] bg-[var(--violet-bg)] px-4 py-3">
                    <p className="text-sm font-bold text-[var(--violet)]">Hijo vinculado</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Esta ficha es la que le da al padre acceso a la asistencia de su hijo. El DNI es
                      solo informativo: las reglas no pueden convertir un DNI en una ficha, así que el
                      vínculo real lo establecés vos acá.
                    </p>
                  </div>
                  <div>
                    <label className={ETIQUETA} htmlFor="f-hijo">
                      Ficha del hijo/a
                    </label>
                    <select
                      id="f-hijo"
                      className={CAMPO}
                      value={form.hijoAlumnoId}
                      onChange={(e) => setCampo("hijoAlumnoId", e.target.value)}
                    >
                      <option value="">— Sin vincular —</option>
                      {alumnos.map((alumno) => (
                        <option key={alumno.id} value={alumno.id}>
                          {alumno.nombreCompleto} · {alumno.dni || alumno.legajo || alumno.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={ETIQUETA} htmlFor="f-dni-vinculado">
                      DNI del hijo/a (informativo)
                    </label>
                    <input
                      id="f-dni-vinculado"
                      className={CAMPO}
                      value={form.dniVinculado}
                      onChange={(e) => setCampo("dniVinculado", e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-4 py-3">
                <KeyRound size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {modal === "crear"
                    ? "La cuenta se crea en Firebase Authentication y el perfil en usuarios/. No se envía ningún correo."
                    : "Los cambios se guardan directo en usuarios/. Si el rol cambia, se limpian los vínculos que ya no corresponden."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border)] px-6 py-4">
              <button
                onClick={cerrarModal}
                disabled={guardando}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)] px-5 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                onClick={() => void guardar()}
                disabled={guardando}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-text)] transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {guardando && <Loader2 size={15} className="animate-spin" />}
                {modal === "crear" ? "Crear cuenta" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
