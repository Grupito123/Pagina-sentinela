import { useCallback, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, XCircle, User, GraduationCap, QrCode, Clock, Loader2 } from "lucide-react";
import { situacionActual, etiquetaHora, leerConfig } from "../../services/qrAsistencia";
import { useAuth } from "../../Context/useAuth";
import { obtenerCursoDeAlumno } from "../../services/cursos";
import { obtenerSesionQr, estadoSesion, type SesionQR } from "../../services/qrSessions";
import {
  ESTADOS,
  registrarDesdeAlumno,
  type EstadoAsistencia,
} from "../../services/asistencia";

type Motivo =
  | "sinSesion"
  | "codigo"
  | "inactiva"
  | "vencida"
  | "fueraDeHorario"
  | "sinVinculo"
  | "otroCurso"
  | "error";

type Resultado =
  | { ok: true; estado: EstadoAsistencia; hora: string; nombre: string }
  | { ok: false; motivo: Motivo };

const ERRORES: Record<Motivo, { titulo: string; texto: string }> = {
  sinSesion: {
    titulo: "Sesión inexistente",
    texto: "No encontramos esta sesión QR. Volvé a escanear el código que está en pantalla ahora.",
  },
  codigo: {
    titulo: "Código vencido",
    texto: "Este QR ya cambió. Volvé a escanear el código que está en pantalla ahora.",
  },
  inactiva: {
    titulo: "Asistencia cerrada",
    texto: "El docente cerró esta sesión. Si creés que fue un error, hablá con tu preceptor.",
  },
  vencida: {
    titulo: "Se acabó el tiempo",
    texto: "La sesión QR ya venció. Volvé a escanear el código nuevo.",
  },
  fueraDeHorario: {
    titulo: "Todavía no se prendió",
    texto: "Esta sesión de QR todavía no empieza. Esperá a que se abra y volvé a escanear.",
  },
  sinVinculo: {
    titulo: "Falta vincular tu cuenta",
    texto: "Tu usuario todavía no está vinculado a una ficha de alumno. Pedile a un administrador que lo associe.",
  },
  otroCurso: {
    titulo: "No es tu curso",
    texto: "Esta sesión QR es de otro curso. Escaneá el código de tu propio docente.",
  },
  error: {
    titulo: "No pudimos guardar tu asistencia",
    texto: "Ocurrió un problema al registrar la marca. Probá de nuevo en unos segundos.",
  },
};

export default function MarcarAsistencia() {
  const [params] = useSearchParams();
  const sesionId = params.get("s") ?? "";
  const codigo = (params.get("c") ?? "").toUpperCase();

  const { user, perfil } = useAuth();
  const alumnoId = perfil?.alumnoId ?? null;

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [sesion, setSesion] = useState<SesionQR | null>(null);
  const [motivoInicial, setMotivoInicial] = useState<Motivo | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  /** Valida sesión + código + curso del alumno. Replica los controles del móvil. */
  const validar = useCallback(async (): Promise<{ sesion: SesionQR | null; motivo: Motivo | null }> => {
    if (!user) return { sesion: null, motivo: "sinVinculo" };
    if (!alumnoId) return { sesion: null, motivo: "sinVinculo" };

    const s = await obtenerSesionQr(sesionId);
    if (!s) return { sesion: null, motivo: "sinSesion" };
    // El código rota cada 30 s: un código viejo no abre la sesión.
    if (s.codigo.toUpperCase() !== codigo) return { sesion: s, motivo: "codigo" };

    const estado = estadoSesion(s);
    if (estado === "inexistente") return { sesion: s, motivo: "sinSesion" };
    if (estado) return { sesion: s, motivo: estado };

    const cursoAlumno = await obtenerCursoDeAlumno(alumnoId);
    if (!cursoAlumno) return { sesion: s, motivo: "sinVinculo" };
    if (cursoAlumno !== s.cursoId) return { sesion: s, motivo: "otroCurso" };

    return { sesion: s, motivo: null };
  }, [user, alumnoId, sesionId, codigo]);

  useEffect(() => {
    if (!perfil) return;
    let vivo = true;
    validar()
      .then(({ sesion: s, motivo }) => {
        if (!vivo) return;
        setSesion(s);
        setMotivoInicial(motivo);
        setResultado(null);
        setCargando(false);
      })
      .catch(() => {
        if (!vivo) return;
        setMotivoInicial("error");
        setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, [perfil, validar]);

  const previsto = situacionActual(leerConfig(), new Date());
  const estadoPrevisto: EstadoAsistencia =
    previsto.estado === "media_falta" ? ESTADOS.TARDE : ESTADOS.PRESENTE;

  const enviar = async () => {
    if (!sesion || !user || !alumnoId || motivoInicial) return;
    setEnviando(true);
    try {
      const cursoId = await obtenerCursoDeAlumno(alumnoId);
      if (!cursoId) throw new Error("sin curso");
      await registrarDesdeAlumno({
        alumnoId,
        cursoId,
        uid: user.uid,
        sesionQRId: sesion.id,
        estado: estadoPrevisto,
        materiaId: sesion.materiaId,
      });
      setResultado({
        ok: true,
        estado: estadoPrevisto,
        hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        nombre: perfil?.nombre ?? "",
      });
    } catch {
      setResultado({ ok: false, motivo: "error" });
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
        <div className="flex flex-col items-center gap-3" style={{ color: "var(--text-muted)" }}>
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Validando el código…</p>
        </div>
      </section>
    );
  }

  const fallaInicial: Resultado | null = motivoInicial ? { ok: false, motivo: motivoInicial } : null;
  const estado = resultado ?? fallaInicial;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md px-5 py-12">
        <div className="overflow-hidden rounded-3xl border shadow-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", boxShadow: "0 10px 25px -5px var(--overlay)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-hover))" }} />
          <div className="p-7">
            {estado ? (
              <Resultado resultado={estado} />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                    <QrCode size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                      Marcar asistencia
                    </h1>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Vas a quedar{" "}
                      <span className="font-bold" style={{ color: estadoPrevisto === ESTADOS.PRESENTE ? "var(--success)" : "var(--warning)" }}>
                        {estadoPrevisto === ESTADOS.PRESENTE ? "PRESENTE" : "TARDE"}
                      </span>
                      {previsto.hora && <> en la {etiquetaHora(previsto.hora)}</>}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                  <Dato label="Alumno" icon={<User size={16} />}>
                    {perfil?.nombre || "Tu cuenta"}
                  </Dato>
                  <Dato label="Curso" icon={<GraduationCap size={16} />}>
                    {sesion?.cursoId ?? "—"}
                  </Dato>
                </div>

                <p className="mt-4 rounded-xl px-3 py-2 text-xs" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                  Tu identidad sale de tu cuenta, no se escribe a mano.
                </p>

                <button
                  type="button"
                  onClick={enviar}
                  disabled={enviando}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: "linear-gradient(to right, var(--accent), var(--accent-dark))", boxShadow: "0 4px 14px var(--accent-glow)" }}
                >
                  {enviando ? <Loader2 size={16} className="animate-spin" strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
                  Confirmar asistencia
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock size={12} /> El código QR cambia cada 30 segundos
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const DATO_STYLE = { borderColor: "var(--border)", backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" };

function Dato({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={DATO_STYLE}>
      <span className="shrink-0" style={{ color: "var(--text-muted)" }}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>{children}</p>
      </div>
    </div>
  );
}

function Resultado({ resultado }: { resultado: Resultado }) {
  if (resultado.ok) {
    const tarde = resultado.estado === ESTADOS.TARDE;
    const color = tarde ? "var(--warning)" : "var(--success)";
    return (
      <div className="flex flex-col items-center py-6 text-center animate-[fade-in_0.4s_ease-out_both]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg" style={{ backgroundColor: tarde ? "var(--warning-bg)" : "var(--success-bg)", color }}>
          {tarde ? <AlertTriangle size={40} strokeWidth={2.2} /> : <CheckCircle2 size={40} strokeWidth={2.2} />}
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {tarde ? "Quedaste registrado tarde" : "¡Estás presente!"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {resultado.nombre && (
            <>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{resultado.nombre}</span> · registro guardado
              <br />
            </>
          )}
          Registrado a las <span className="font-bold" style={{ color }}>{resultado.hora}</span>
        </p>
      </div>
    );
  }

  const err = ERRORES[resultado.motivo];
  const esInfo = resultado.motivo === "sinVinculo" || resultado.motivo === "otroCurso";
  return (
    <div className="flex flex-col items-center py-6 text-center animate-[fade-in_0.4s_ease-out_both]">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg" style={{ backgroundColor: esInfo ? "var(--info-bg)" : "var(--error-bg)", color: esInfo ? "var(--info)" : "var(--error)" }}>
        {esInfo ? <AlertTriangle size={40} strokeWidth={2.2} /> : <XCircle size={40} strokeWidth={2.2} />}
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {err.titulo}
      </h1>
      <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {err.texto}
      </p>
      <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
        Ir al inicio
      </Link>
    </div>
  );
}
