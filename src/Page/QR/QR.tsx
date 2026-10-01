import { Fragment, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Settings2,
  Users,
  Maximize2,
  Trash2,
  ExternalLink,
  Info,
  Coffee,
  RotateCcw,
} from "lucide-react";
import {
  ROTACION_MS,
  CONFIG_DEFAULT,
  msHastaProximoCambio,
  situacionActual,
  aperturaDe,
  finToleranciaDe,
  deMinutos,
  etiquetaHora,
  leerConfig,
  guardarConfig,
  configEsValida,
  hoy,
  type ConfigHorario,
  type HoraClase,
  type SituacionActual,
  type EstadoHorario,
} from "../../services/qrAsistencia";
import { useAuth } from "../../Context/useAuth";
import type { Rol } from "../../Firebase/roles";
import { obtenerCursosOperables, type Curso } from "../../services/cursos";
import {
  crearSesionQr,
  obtenerSesionesActivas,
  rotarCodigoSesion,
  cerrarSesionQr,
  type SesionQR,
} from "../../services/qrSessions";
import { ESTADOS, formatTime as formatHora, obtenerAsistenciasPorCurso, type Asistencia } from "../../services/asistencia";

const ESTILO: Record<EstadoHorario, { color: string; bg: string; icon: typeof Clock }> = {
  antes: { color: "var(--info)", bg: "var(--info-bg)", icon: Coffee },
  presente: { color: "var(--success)", bg: "var(--success-bg)", icon: CheckCircle2 },
  media_falta: { color: "var(--warning)", bg: "var(--warning-bg)", icon: AlertTriangle },
  bloqueado: { color: "var(--error)", bg: "var(--error-bg)", icon: Lock },
  cerrado: { color: "var(--error)", bg: "var(--error-bg)", icon: Lock },
};

function textos(sit: SituacionActual, config: ConfigHorario): { titulo: string; detalle: string } {
  switch (sit.estado) {
    case "presente":
      return { titulo: `PRESENTE · ${etiquetaHora(sit.hora!)}`, detalle: `Hasta las ${sit.hora!.inicio}, después media falta` };
    case "media_falta":
      return { titulo: `MEDIA FALTA · ${etiquetaHora(sit.hora!)}`, detalle: `Se bloquea a las ${sit.toleranciaHasta}` };
    case "bloqueado":
      return {
        titulo: "QR bloqueado",
        detalle: sit.proxima
          ? `Pasó la tolerancia de la ${sit.hora!.nombre}. Se desbloquea a las ${deMinutos(aperturaDe(config, sit.proxima))} para la ${etiquetaHora(sit.proxima)}`
          : `Pasó la tolerancia de la ${sit.hora!.nombre}. No hay más horas hoy`,
      };
    case "antes":
      return {
        titulo: "QR apagado",
        detalle: `Próxima: ${etiquetaHora(sit.proxima!)} · se prende a las ${deMinutos(aperturaDe(config, sit.proxima!))}`,
      };
    case "cerrado":
      return { titulo: "Terminaron las clases de hoy", detalle: "El QR vuelve mañana" };
  }
}

function useAhora(intervalo = 250) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), intervalo);
    return () => clearInterval(id);
  }, [intervalo]);
  return ahora;
}

export default function QR() {
  const ahora = useAhora();
  const { user, perfil } = useAuth();
  const [config, setConfig] = useState<ConfigHorario>(leerConfig);
  const [borrador, setBorrador] = useState<ConfigHorario>(config);
  const [editando, setEditando] = useState(false);
  const [marcas, setMarcas] = useState<Asistencia[]>([]);

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoId, setCursoId] = useState<string>("");
  const [sesion, setSesion] = useState<SesionQR | null>(null);
  const [codigo, setCodigo] = useState<string>("");
  const [aviso, setAviso] = useState<string | null>(null);

  const sesionActual = cursoId ? sesion : null;
  const url = sesionActual
    ? `${window.location.origin}/qr/marcar?s=${sesionActual.id}&c=${codigo}`
    : "";
  const restante = msHastaProximoCambio(ahora);
  const segundos = Math.ceil(restante / 1000);
  const sit = situacionActual(config, new Date(ahora));
  const abierto = sit.estado === "presente" || sit.estado === "media_falta";
  const estilo = ESTILO[sit.estado];
  const txt = textos(sit, config);
  const EstadoIcon = estilo.icon;

  const presentes = marcas.filter((m) => m.estado === ESTADOS.PRESENTE).length;
  const llegadaTarde = marcas.length - presentes;

  // Cursos que este usuario puede operar según su rol de `usuarios/{uid}`.
  useEffect(() => {
    let vivo = true;
    if (!user || !perfil) return;
    obtenerCursosOperables(user.uid, perfil.rol as Rol)
      .then((lista) => {
        if (!vivo) return;
        setCursos(lista);
        setCursoId((prev) => prev || lista[0]?.id || "");
      })
      .catch(() => setAviso("No pudimos leer los cursos. Revisá los permisos de tu cuenta."));
    return () => {
      vivo = false;
    };
  }, [user, perfil]);

  // Sesión QR abierta para el curso elegido: se reutiliza si sigue vigente.
  useEffect(() => {
    let vivo = true;
    if (!user || !cursoId) return;
    (async () => {
      try {
        const hoyKey = hoy();
        const [activas] = await Promise.all([obtenerSesionesActivas(cursoId)]);
        const reutilizable =
          activas.find((s) => s.fechaKey === hoyKey && (s.horaFin?.toMillis() ?? 0) > Date.now()) ?? null;
        const s = reutilizable ?? (await crearSesionQr({ cursoId, creadoPor: user.uid, duracionMinutos: 240 }));
        if (!vivo) return;
        setSesion(s);
        setCodigo(s.codigo);
      } catch {
        if (vivo) {
          setAviso("No pudimos abrir la sesión QR. Las reglas de la base pueden estar limitando esta acción.");
        }
      }
    })();
    return () => {
      vivo = false;
    };
  }, [user, cursoId]);

  // Rotación del código: el valor vive en `sesionesQR`, no en el navegador.
  useEffect(() => {
    const s = sesionActual;
    if (!s) return;
    const id = setInterval(() => {
      rotarCodigoSesion(s.id)
        .then((nuevo) => setCodigo(nuevo))
        .catch(() => undefined);
    }, ROTACION_MS);
    return () => clearInterval(id);
  }, [sesionActual]);

  // Marcas del día para el curso abierto.
  useEffect(() => {
    if (!cursoId) return;
    const cargar = () =>
      obtenerAsistenciasPorCurso(cursoId)
        .then(setMarcas)
        .catch(() => undefined);
    cargar();
    const id = setInterval(cargar, 15_000);
    return () => clearInterval(id);
  }, [cursoId]);

  const guardar = () => {
    if (!configEsValida(borrador)) return;
    guardarConfig(borrador);
    setConfig(borrador);
    setEditando(false);
  };

  const editarHora = (id: string, campo: "inicio" | "fin", valor: string) =>
    setBorrador((c) => ({ ...c, horas: c.horas.map((h) => (h.id === id ? { ...h, [campo]: valor } : h)) }));

  const pantallaCompleta = () => {
    const el = document.getElementById("qr-panel");
    if (el && !document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const modulos = [...new Set(config.horas.map((h) => h.modulo))];

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
        <div className="absolute -left-24 bottom-20 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest shadow-sm backdrop-blur" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--accent)" }}>
            <QrCode size={13} strokeWidth={2.5} />
            Asistencia por QR
          </span>
          <h1 className="mt-5 font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "var(--text-primary)" }}>
            Escaneá y quedás presente
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Apuntá la cámara de tu celular al código. La asistencia se toma por hora de clase: si entrás a la 2ª hora, quedás presente en la 2ª hora.
            El QR cambia cada {ROTACION_MS / 1000} segundos, así que una foto no sirve.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* QR */}
          <div id="qr-panel" className="flex flex-col overflow-hidden rounded-3xl border shadow-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", boxShadow: "0 10px 25px -5px var(--overlay)" }}>
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-hover))" }} />
            <div className="flex flex-1 flex-col items-center justify-center p-7 sm:p-9">
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-2xl px-3.5 py-1.5 text-sm font-bold" style={{ color: estilo.color, backgroundColor: estilo.bg }}>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <EstadoIcon size={16} strokeWidth={2.5} />
                    {txt.titulo}
                  </span>
                  <span className="font-medium opacity-80">{txt.detalle}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                    {new Date(ahora).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                  </span>
                  <button onClick={pantallaCompleta} className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors" style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }} aria-label="Pantalla completa" title="Pantalla completa">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              <div className="relative mt-8">
                <div className="rounded-3xl bg-white p-5 shadow-xl transition-all duration-500" style={{ filter: abierto ? "none" : "blur(10px)", opacity: abierto ? 1 : 0.35 }}>
                  <QRCodeSVG value={url} size={300} level="M" marginSize={0} className="h-auto w-[min(300px,70vw)]" />
                </div>
                {!abierto && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <EstadoIcon size={44} style={{ color: estilo.color }} />
                    <p className="mt-3 text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>{txt.titulo}</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{txt.detalle}</p>
                  </div>
                )}
              </div>

              {abierto && (
                <div className="mt-7 w-full max-w-xs">
                  <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    <div className="h-full rounded-full transition-[width] duration-200 ease-linear" style={{ width: `${(restante / ROTACION_MS) * 100}%`, background: segundos <= 5 ? "var(--warning)" : "linear-gradient(to right, var(--accent), var(--accent-hover))" }} />
                  </div>
                  <p className="mt-2 text-center text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                    El código cambia en <span className="tabular-nums" style={{ color: "var(--accent)" }}>{segundos}s</span>
                  </p>
                </div>
              )}

              {abierto && (
                <a href={url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-4 hover:underline" style={{ color: "var(--text-muted)" }}>
                  <ExternalLink size={12} /> Probar en esta computadora
                </a>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            {/* Horario */}
            <div className="rounded-3xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                  <Clock size={14} strokeWidth={2.5} /> Horario de clases
                </p>
                {!editando && (
                  <button onClick={() => { setBorrador(config); setEditando(true); }} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold" style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    <Settings2 size={13} /> Cambiar
                  </button>
                )}
              </div>

              {editando ? (
                <div className="mt-5 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <NumeroMin label="Tolerancia" valor={borrador.toleranciaMin} onChange={(v) => setBorrador((c) => ({ ...c, toleranciaMin: v }))} />
                    <NumeroMin label="Se prende antes" valor={borrador.abreAntesMin} onChange={(v) => setBorrador((c) => ({ ...c, abreAntesMin: v }))} />
                  </div>
                  {modulos.map((mod) => (
                    <div key={mod}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Módulo {mod.toLowerCase()}</p>
                      <div className="flex flex-col gap-2">
                        {borrador.horas.filter((h) => h.modulo === mod).map((h) => (
                          <div key={h.id} className="flex items-center gap-2">
                            <span className="w-16 shrink-0 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{h.nombre}</span>
                            <InputHora valor={h.inicio} onChange={(v) => editarHora(h.id, "inicio", v)} />
                            <span style={{ color: "var(--text-muted)" }}>–</span>
                            <InputHora valor={h.fin} onChange={(v) => editarHora(h.id, "fin", v)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!configEsValida(borrador) && (
                    <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>
                      Revisá los horarios: cada hora tiene que terminar después de empezar y no pisarse con la siguiente.
                    </p>
                  )}
                  <button onClick={() => setBorrador(CONFIG_DEFAULT)} className="inline-flex items-center gap-1.5 self-start text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                    <RotateCcw size={12} /> Volver al horario de la escuela
                  </button>
                  <div className="flex gap-2">
                    <button onClick={guardar} disabled={!configEsValida(borrador)} className="flex-1 rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-40" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)" }}>
                      Guardar
                    </button>
                    <button onClick={() => setEditando(false)} className="rounded-xl px-4 py-2 text-sm font-bold" style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-5">
                  {modulos.map((mod) => {
                    const horas = config.horas.filter((h) => h.modulo === mod);
                    return (
                      <div key={mod}>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                          Módulo {mod.toLowerCase()} · {horas[0].inicio} a {horas[horas.length - 1].fin}
                        </p>
                        <ul className="flex flex-col gap-1">
                          {horas.map((h, i) => {
                            const previa = horas[i - 1];
                            return (
                              <Fragment key={h.id}>
                                {previa && previa.fin !== h.inicio && (
                                  <li className="flex items-center gap-2 px-2.5 py-1 text-xs" style={{ color: "var(--text-muted)" }}>
                                    <Coffee size={12} /> Recreo {previa.fin} – {h.inicio}
                                  </li>
                                )}
                                <FilaHora hora={h} config={config} activa={sit.hora?.id === h.id} />
                              </Fragment>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Cada hora: el QR se prende {config.abreAntesMin} min antes y hasta que empieza es{" "}
                    <span style={{ color: "var(--success)" }}>presente</span>. Los primeros {config.toleranciaMin} min de clase son{" "}
                    <span style={{ color: "var(--warning)" }}>media falta</span>. Después <span style={{ color: "var(--error)" }}>se bloquea</span> hasta la hora siguiente.
                  </p>
                </div>
              )}
            </div>

            {/* Marcas de hoy */}
            <div className="flex min-h-0 flex-1 flex-col rounded-3xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                  <Users size={14} strokeWidth={2.5} /> Marcaron hoy
                </p>
                {sesionActual?.activo && (
                  <button
                    onClick={() => {
                      const s = sesionActual;
                      if (confirm("¿Cerrar la sesión QR? Los alumnos dejarán poder marcar asistencia.")) {
                        cerrarSesionQr(s.id).then(() => setSesion({ ...s, activo: false }));
                      }
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ color: "var(--text-muted)" }}
                    aria-label="Cerrar sesión QR"
                    title="Cerrar sesión QR"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {cursos.length > 1 && (
                <select
                  value={cursoId}
                  onChange={(e) => setCursoId(e.target.value)}
                  className="mt-3 w-full appearance-none rounded-xl px-3 py-2 text-sm font-semibold"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}
                >
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              )}
              {aviso && (
                <p className="mt-3 rounded-xl px-3 py-2 text-xs" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
                  {aviso}
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "var(--success-bg)" }}>
                  <p className="text-2xl font-extrabold" style={{ color: "var(--success)" }}>{presentes}</p>
                  <p className="text-[11px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>Presentes</p>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "var(--warning-bg)" }}>
                  <p className="text-2xl font-extrabold" style={{ color: "var(--warning)" }}>{llegadaTarde}</p>
                  <p className="text-[11px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>Llegada tarde</p>
                </div>
              </div>
              {marcas.length === 0 ? (
                <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>Todavía nadie marcó asistencia.</p>
              ) : (
                <ul className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                  {marcas.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>{m.alumnoId}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.cursoId} · {formatHora(m.hora)}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ color: m.estado === ESTADOS.PRESENTE ? "var(--success)" : "var(--warning)", backgroundColor: m.estado === ESTADOS.PRESENTE ? "var(--success-bg)" : "var(--warning-bg)" }}>
                        {m.estado === ESTADOS.PRESENTE ? "Presente" : "Llegada tarde"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="flex gap-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>
                Las asistencias se guardan en Firestore (`asistencias`) y quedan disponibles para el resto de la institución.
              </span>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FilaHora({ hora, config, activa }: { hora: HoraClase; config: ConfigHorario; activa: boolean }) {
  return (
    <li
      className="flex items-center gap-3 rounded-xl px-2.5 py-1.5 text-sm"
      style={{ backgroundColor: activa ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent", outline: activa ? "1px solid var(--accent)" : "none" }}
    >
      <span className="w-14 shrink-0 font-semibold" style={{ color: activa ? "var(--accent)" : "var(--text-primary)" }}>{hora.nombre}</span>
      <span className="flex-1 whitespace-nowrap tabular-nums" style={{ color: "var(--text-secondary)" }}>{hora.inicio} – {hora.fin}</span>
      <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }} title="Se bloquea a las">
        🔒 {deMinutos(finToleranciaDe(config, hora))}
      </span>
    </li>
  );
}

function InputHora({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-sm outline-none"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)", colorScheme: "dark" }}
    />
  );
}

function NumeroMin({ label, valor, onChange }: { label: string; valor: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</span>
      <div className="relative">
        <input
          type="number"
          min={0}
          max={60}
          value={valor}
          onChange={(e) => onChange(Math.max(0, Math.min(60, Number(e.target.value) || 0)))}
          className="w-full rounded-lg border px-2 py-1.5 pr-10 text-sm outline-none"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>min</span>
      </div>
    </label>
  );
}
