import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link2,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserCheck,
  IdCard,
  Mail,
  Loader2,
  RefreshCw,
  GraduationCap,
  BookMarked,
} from "lucide-react";
import { useAuth } from "../../../Context/useAuth";
import { ROLES } from "../../../Firebase/roles";
import { obtenerAlumnosSinVincular, type UsuarioAlumno } from "../../../Firebase/services/usuarios";
import {
  obtenerAlumnosDisponibles,
  vincularAlumnoCuenta,
  type Alumno,
} from "../../../Firebase/services/alumnos";

/**
 * Vinculaciones — DISEÑO A.
 *
 * Flujo real contra Firestore, sin datos mock ni localStorage:
 *
 *   1. La institution ya creo `usuarios/{uid}` (rol alumno, alumnoId null)
 *      y `alumnos/{alumnoId}` (con cursoId, sin usuarioId).
 *   2. El administrador elige una cuenta y una ficha.
 *   3. `vincularAlumnoCuenta` escribe los DOS lados en un solo `writeBatch`:
 *        usuarios/{uid}.alumnoId      = alumnoId
 *        alumnos/{alumnoId}.usuarioId = uid
 *
 * El curso se muestra, pero no se elige: sale siempre de `alumnos/{alumnoId}`.
 * La autorización real la ponen las reglas de Firestore (`esAdmin()`); este
 * componente solo evita que alguien llegue hasta acá.
 */

type Aviso = { tipo: "ok" | "error"; texto: string } | null;

function filtrar<T>(lista: T[], texto: string, campos: (item: T) => string[]): T[] {
  const term = texto.trim().toLowerCase();
  if (!term) return lista;
  return lista.filter((item) => campos(item).join(" ").toLowerCase().includes(term));
}

function iniciales(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || "?";
}

/** Traduce un error de Firestore a algo que el administrador pueda actuar. */
function describirError(error: unknown): string {
  const base = error instanceof Error ? error.message : "No se pudieron leer los datos de Firestore.";
  return `${base} — Si sos administrador y esto falla, revisá que tu perfil tenga rol "administrador" y que las reglas de Firestore estén desplegadas.`;
}

export default function Vinculaciones() {
  const { perfil } = useAuth();

  const [cuentas, setCuentas] = useState<UsuarioAlumno[]>([]);
  const [fichas, setFichas] = useState<Alumno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoVinculo, setCargandoVinculo] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [busquedaCuenta, setBusquedaCuenta] = useState("");
  const [busquedaFicha, setBusquedaFicha] = useState("");
  const [cuentaElegida, setCuentaElegida] = useState<UsuarioAlumno | null>(null);
  const [fichaElegida, setFichaElegida] = useState<Alumno | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [aviso, setAviso] = useState<Aviso>(null);

  const esAdmin = perfil?.rol === ROLES.ADMIN;

  /**
   * Fetch puro: no toca estado, solo trae los dos listados en paralelo
   * (cuentas sin vincular y fichas disponibles).
   */
  const pedirDatos = useCallback(async () => {
    const [sinVincular, disponibles] = await Promise.all([
      obtenerAlumnosSinVincular(),
      obtenerAlumnosDisponibles(),
    ]);
    return { cuentas: sinVincular, fichas: disponibles };
  }, []);

  // Carga inicial: el estado se actualiza adentro de las callbacks de la
  // promesa, nunca de forma sincrónica en el cuerpo del efecto.
  useEffect(() => {
    let vivo = true;
    pedirDatos()
      .then((datos) => {
        if (!vivo) return;
        setCuentas(datos.cuentas);
        setFichas(datos.fichas);
        setErrorCarga(null);
      })
      .catch((error: unknown) => {
        if (vivo) setErrorCarga(describirError(error));
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, [pedirDatos]);

  /** Recarga manual, disparada desde el botón "Actualizar". */
  const recargar = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const datos = await pedirDatos();
      setCuentas(datos.cuentas);
      setFichas(datos.fichas);
    } catch (error) {
      setErrorCarga(describirError(error));
    } finally {
      setCargando(false);
    }
  }, [pedirDatos]);

  const cuentasFiltradas = useMemo(
    () =>
      filtrar(cuentas, busquedaCuenta, (c) => [c.nombre, c.apellido, c.email, c.dni, c.uid]).sort(
        (a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto, "es"),
      ),
    [cuentas, busquedaCuenta],
  );

  const fichasFiltradas = useMemo(
    () =>
      filtrar(fichas, busquedaFicha, (f) => [f.nombre, f.apellido, f.dni, f.legajo, f.cursoId ?? ""]).sort(
        (a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto, "es"),
      ),
    [fichas, busquedaFicha],
  );

  const puedeVincular = Boolean(cuentaElegida && fichaElegida) && !cargandoVinculo;

  const reiniciar = () => {
    setConfirmando(false);
    setCuentaElegida(null);
    setFichaElegida(null);
  };

  const confirmarVinculacion = async () => {
    if (!cuentaElegida || !fichaElegida) return;

    setCargandoVinculo(true);
    setAviso(null);
    try {
      const resultado = await vincularAlumnoCuenta(cuentaElegida.uid, fichaElegida.id);
      setAviso({
        tipo: "ok",
        texto: `Vinculación guardada: ${resultado.cursoId ? `el alumno quedó en el curso ${resultado.cursoId}` : "la cuenta quedó asociada a la ficha"}.`,
      });
      reiniciar();
      await recargar();
    } catch (error) {
      setAviso({
        tipo: "error",
        texto: error instanceof Error ? error.message : "No se pudo completar la vinculación.",
      });
    } finally {
      setCargandoVinculo(false);
    }
  };

  if (!esAdmin) {
    return (
      <div
        className="mx-auto max-w-2xl rounded-2xl border p-8 text-center"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <XCircle size={32} className="mx-auto mb-3" style={{ color: "var(--error)" }} />
        <h1 className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
          Acceso restringido
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Vincular cuentas y fichas es una tarea exclusiva del administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Vinculaciones
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Asociá cada cuenta de alumno con su ficha. El curso sale de la ficha, no de la pantalla.
          </p>
        </div>
        <button
          onClick={() => void recargar()}
          disabled={cargando || cargandoVinculo}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-opacity disabled:opacity-40"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
        >
          {cargando ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Actualizar
        </button>
      </div>

      {/* Estado */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div
          className="flex items-center gap-3 rounded-2xl border px-4 py-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
        >
          <UserCheck size={18} style={{ color: "var(--accent)" }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Cuentas sin vincular
            </p>
            <p className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
              {cargando ? "—" : cuentas.length}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl border px-4 py-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
        >
          <GraduationCap size={18} style={{ color: "var(--success)" }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Fichas disponibles
            </p>
            <p className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
              {cargando ? "—" : fichas.length}
            </p>
          </div>
        </div>
      </div>

      {errorCarga && (
        <div
          className="mt-4 flex items-start gap-3 rounded-xl border px-4 py-3"
          style={{ borderColor: "var(--error-bg)", backgroundColor: "var(--error-bg)", color: "var(--error)" }}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm font-semibold">{errorCarga}</p>
        </div>
      )}

      {aviso && (
        <div
          className="mt-4 flex items-start gap-3 rounded-xl border px-4 py-3"
          style={
            aviso.tipo === "ok"
              ? { borderColor: "var(--success-bg)", backgroundColor: "var(--success-bg)", color: "var(--success)" }
              : { borderColor: "var(--error-bg)", backgroundColor: "var(--error-bg)", color: "var(--error)" }
          }
        >
          {aviso.tipo === "ok" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0" />}
          <p className="text-sm font-semibold">{aviso.texto}</p>
        </div>
      )}

      {/* Paneles de selección */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Cuentas */}
        <section
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
            1 · Elegí la cuenta
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Cuentas con rol <span className="font-bold">alumno</span> que todavía no tienen ficha.
          </p>

          <div className="relative mt-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              value={busquedaCuenta}
              onChange={(e) => {
                setBusquedaCuenta(e.target.value);
                setConfirmando(false);
              }}
              placeholder="Buscar por nombre, email o DNI..."
              className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
            />
          </div>

          <ul className="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto">
            {cuentasFiltradas.map((cuenta) => {
              const elegida = cuentaElegida?.uid === cuenta.uid;
              return (
                <li key={cuenta.uid}>
                  <button
                    onClick={() => {
                      setCuentaElegida(cuenta);
                      setConfirmando(false);
                      setAviso(null);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors"
                    style={{
                      borderColor: elegida ? "var(--accent)" : "var(--border)",
                      backgroundColor: elegida ? "var(--accent-glow)" : "var(--bg-input)",
                    }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                      style={{ background: "linear-gradient(135deg, var(--violet), var(--accent-dark))" }}
                    >
                      {iniciales(cuenta.nombre, cuenta.apellido)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {cuenta.nombreCompleto}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs" style={{ color: "var(--text-muted)" }}>
                        <Mail size={11} /> {cuenta.email || "sin email"}
                      </p>
                    </div>
                    {elegida && <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />}
                  </button>
                </li>
              );
            })}
          </ul>

          {!cargando && cuentasFiltradas.length === 0 && (
            <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
              No hay cuentas de alumno sin vincular{busquedaCuenta ? " para esa búsqueda" : ""}.
            </p>
          )}
        </section>

        {/* Fichas */}
        <section
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
            2 · Elegí la ficha
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Alumnos activos que todavía no tienen cuenta.
          </p>

          <div className="relative mt-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              value={busquedaFicha}
              onChange={(e) => {
                setBusquedaFicha(e.target.value);
                setConfirmando(false);
              }}
              placeholder="Buscar por nombre, DNI, legajo o curso..."
              className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
            />
          </div>

          <ul className="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto">
            {fichasFiltradas.map((ficha) => {
              const elegida = fichaElegida?.id === ficha.id;
              return (
                <li key={ficha.id}>
                  <button
                    onClick={() => {
                      setFichaElegida(ficha);
                      setConfirmando(false);
                      setAviso(null);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors"
                    style={{
                      borderColor: elegida ? "var(--accent)" : "var(--border)",
                      backgroundColor: elegida ? "var(--accent-glow)" : "var(--bg-input)",
                    }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ background: "linear-gradient(135deg, var(--success), var(--success-bg))" }}
                    >
                      <GraduationCap size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {ficha.nombreCompleto}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs" style={{ color: "var(--text-muted)" }}>
                        <IdCard size={11} /> {ficha.dni || "sin DNI"}
                        {ficha.legajo ? ` · legajo ${ficha.legajo}` : ""}
                      </p>
                    </div>
                    {elegida && <CheckCircle2 size={18} style={{ color: "var(--accent)" }} />}
                  </button>
                </li>
              );
            })}
          </ul>

          {!cargando && fichasFiltradas.length === 0 && (
            <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
              No hay fichas disponibles{busquedaFicha ? " para esa búsqueda" : ""}.
            </p>
          )}
        </section>
      </div>

      {/* Resumen + acción */}
      <section
        className="mt-6 rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <h2 className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
          3 · Confirmá la vinculación
        </h2>

        {!cuentaElegida || !fichaElegida ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Elegí una cuenta y una ficha para continuar.
          </p>
        ) : (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Cuenta
                </p>
                <p className="mt-0.5 truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {cuentaElegida.nombreCompleto}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  {cuentaElegida.email || cuentaElegida.uid}
                </p>
              </div>

              <div className="flex items-center justify-center" style={{ color: "var(--text-muted)" }}>
                <Link2 size={22} />
              </div>

              <div className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Ficha
                </p>
                <p className="mt-0.5 truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {fichaElegida.nombreCompleto}
                </p>
                <p className="flex items-center gap-1 truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  <BookMarked size={11} /> curso {fichaElegida.cursoId ?? "sin asignar"}
                </p>
              </div>
            </div>

            {!confirmando ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setConfirmando(true)}
                  disabled={!puedeVincular}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: "var(--success)" }}
                >
                  <Link2 size={16} strokeWidth={2.5} /> Vincular
                </button>
                <button
                  onClick={reiniciar}
                  className="rounded-xl border px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-80"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  Limpiar
                </button>
              </div>
            ) : (
              <div
                className="mt-4 rounded-xl border px-4 py-4"
                style={{ borderColor: "var(--accent)", backgroundColor: "var(--accent-glow)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  Se van a escribir dos documentos en una sola operación:
                </p>
                <ul className="mt-2 flex flex-col gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <li>
                    <code>usuarios/{cuentaElegida.uid}.alumnoId</code> →{" "}
                    <span className="font-bold">{fichaElegida.id}</span>
                  </li>
                  <li>
                    <code>alumnos/{fichaElegida.id}.usuarioId</code> →{" "}
                    <span className="font-bold">{cuentaElegida.uid}</span>
                  </li>
                </ul>
                <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  El curso <span className="font-bold">{fichaElegida.cursoId ?? "—"}</span> no se escribe: se
                  deriva de la ficha.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => void confirmarVinculacion()}
                    disabled={cargandoVinculo}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ backgroundColor: "var(--success)" }}
                  >
                    {cargandoVinculo ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
                    {cargandoVinculo ? "Vinculando..." : "Confirmar vinculación"}
                  </button>
                  <button
                    onClick={() => setConfirmando(false)}
                    disabled={cargandoVinculo}
                    className="rounded-xl border px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
