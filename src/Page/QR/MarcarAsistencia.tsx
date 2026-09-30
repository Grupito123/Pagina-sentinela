import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, XCircle, User, IdCard, GraduationCap, QrCode, Clock } from "lucide-react";
import {
  CURSOS,
  codigoValido,
  situacionActual,
  etiquetaHora,
  leerConfig,
  registrarMarca,
  type ResultadoMarca,
} from "../../services/qrAsistencia";

const KEY_ALUMNO = "sentinel-qr-alumno";

interface DatosAlumno {
  nombre: string;
  dni: string;
  curso: string;
}

function leerAlumno(): DatosAlumno {
  try {
    const raw = localStorage.getItem(KEY_ALUMNO);
    if (raw) return JSON.parse(raw) as DatosAlumno;
  } catch {
    /* ignorar */
  }
  return { nombre: "", dni: "", curso: "" };
}

const ERRORES: Record<Exclude<ResultadoMarca, { ok: true }>["motivo"], { titulo: string; texto: string }> = {
  codigo: {
    titulo: "Código vencido",
    texto: "Este QR ya cambió. Volvé a escanear el código que está en pantalla ahora.",
  },
  vencido: {
    titulo: "Se acabó el tiempo",
    texto: "Pasaron más de 3 minutos desde que escaneaste. Volvé a escanear el QR.",
  },
  antes: {
    titulo: "Todavía no se prendió",
    texto: "El QR está apagado (recreo o antes de la hora). Esperá a que se prenda y volvé a escanear.",
  },
  bloqueado: {
    titulo: "QR bloqueado",
    texto: "Pasó la tolerancia de esta hora. Vas a poder marcar cuando se prenda el QR de la hora siguiente.",
  },
  cerrado: {
    titulo: "Asistencia cerrada",
    texto: "Terminaron las clases de hoy. Si necesitás corregir tu asistencia, hablá con tu preceptor.",
  },
  duplicado: {
    titulo: "Ya estabas marcado",
    texto: "Ya registraste tu asistencia en esta hora de clase.",
  },
};

export default function MarcarAsistencia() {
  const [params] = useSearchParams();
  const codigo = params.get("c") ?? "";
  const [escaneadoEn] = useState(() => Date.now());
  const [form, setForm] = useState<DatosAlumno>(leerAlumno);
  const [resultado, setResultado] = useState<ResultadoMarca | null>(() => {
    // Se valida al abrir el link: si el QR ya no sirve, no tiene sentido pedir los datos
    if (!codigoValido(codigo, escaneadoEn)) return { ok: false, motivo: "codigo" };
    const { estado } = situacionActual(leerConfig(), new Date(escaneadoEn));
    if (estado === "antes" || estado === "bloqueado" || estado === "cerrado") return { ok: false, motivo: estado };
    return null;
  });

  const update = (k: keyof DatosAlumno, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(KEY_ALUMNO, JSON.stringify(form));
    } catch {
      /* ignorar */
    }
    setResultado(registrarMarca({ ...form, codigo, escaneadoEn }));
  };

  const previsto = situacionActual(leerConfig(), new Date(escaneadoEn));
  const estadoPrevisto = previsto.estado;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md px-5 py-12">
        <div className="overflow-hidden rounded-3xl border shadow-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", boxShadow: "0 10px 25px -5px var(--overlay)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-hover))" }} />
          <div className="p-7">
            {resultado ? (
              <Resultado resultado={resultado} />
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
                      <span className="font-bold" style={{ color: estadoPrevisto === "presente" ? "var(--success)" : "var(--warning)" }}>
                        {estadoPrevisto === "presente" ? "PRESENTE" : "con MEDIA FALTA"}
                      </span>
                      {previsto.hora && <> en la {etiquetaHora(previsto.hora)}</>}
                    </p>
                  </div>
                </div>

                <form onSubmit={enviar} className="mt-7 flex flex-col gap-4">
                  <Campo label="Nombre y apellido" icon={<User size={16} />}>
                    <input value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required minLength={3} placeholder="Juan López" autoComplete="name" className={INPUT} style={INPUT_STYLE} />
                  </Campo>
                  <Campo label="DNI" icon={<IdCard size={16} />}>
                    <input value={form.dni} onChange={(e) => update("dni", e.target.value.replace(/\D/g, ""))} required inputMode="numeric" pattern="\d{7,8}" title="7 u 8 números, sin puntos" placeholder="45123456" className={INPUT} style={INPUT_STYLE} />
                  </Campo>
                  <Campo label="Curso" icon={<GraduationCap size={16} />}>
                    <select value={form.curso} onChange={(e) => update("curso", e.target.value)} required className={`${INPUT} appearance-none`} style={INPUT_STYLE}>
                      <option value="" disabled>Seleccionar...</option>
                      {CURSOS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Campo>

                  <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-dark))", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                    <CheckCircle2 size={16} strokeWidth={2.5} /> Confirmar asistencia
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={12} /> Tenés 3 minutos para confirmar
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const INPUT = "w-full rounded-xl border px-3 py-2.5 pl-10 text-sm outline-none transition-all";
const INPUT_STYLE = { borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" };

function Campo({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function Resultado({ resultado }: { resultado: ResultadoMarca }) {
  if (resultado.ok) {
    const tarde = resultado.marca.estado === "media_falta";
    const color = tarde ? "var(--warning)" : "var(--success)";
    return (
      <div className="flex flex-col items-center py-6 text-center animate-[fade-in_0.4s_ease-out_both]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg" style={{ backgroundColor: tarde ? "var(--warning-bg)" : "var(--success-bg)", color }}>
          {tarde ? <AlertTriangle size={40} strokeWidth={2.2} /> : <CheckCircle2 size={40} strokeWidth={2.2} />}
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {tarde ? "Quedaste con media falta" : "¡Estás presente!"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{resultado.marca.nombre}</span> · {resultado.marca.curso}
          <br />
          {resultado.marca.horaClase}
          <br />
          Registrado a las <span className="font-bold" style={{ color }}>{resultado.marca.hora}</span>
        </p>
      </div>
    );
  }

  const err = ERRORES[resultado.motivo];
  const esDuplicado = resultado.motivo === "duplicado";
  return (
    <div className="flex flex-col items-center py-6 text-center animate-[fade-in_0.4s_ease-out_both]">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg" style={{ backgroundColor: esDuplicado ? "var(--info-bg)" : "var(--error-bg)", color: esDuplicado ? "var(--info)" : "var(--error)" }}>
        {esDuplicado ? <CheckCircle2 size={40} strokeWidth={2.2} /> : <XCircle size={40} strokeWidth={2.2} />}
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {err.titulo}
      </h1>
      <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {err.texto}
        {esDuplicado && resultado.marca && (
          <>
            <br />
            Marcaste a las <span className="font-bold" style={{ color: "var(--text-primary)" }}>{resultado.marca.hora}</span> ({resultado.marca.estado === "presente" ? "presente" : "media falta"}).
          </>
        )}
      </p>
      <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
        Ir al inicio
      </Link>
    </div>
  );
}
