import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Building2,
  Navigation,
  CheckCircle2,
  Camera,
  Play,
  Code,
  ChevronDown,
} from "lucide-react";

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "El Algarrobo 223, B1718 San Antonio de Padua",
    detail: "Provincia de Buenos Aires",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "(0220) 486-3633",
    detail: "Secretaría · Lunes a viernes",
  },
  {
    icon: Mail,
    label: "Correo",
    value: "eestmerlo@abc.gob.ar",
    detail: "Respuesta en 24-48 hs hábiles",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lun a Vie · 9:00 a 16:00",
    detail: "Sábados cerrado",
  },
];

const SOCIAL = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
  { icon: Code, label: "GitHub", href: "#" },
];

const SUBJECTS = [
  { value: "inscripcion", label: "Inscripción" },
  { value: "asistencia", label: "Asistencia / Novedades" },
  { value: "boletin", label: "Boletín / Calificaciones" },
  { value: "general", label: "Consulta general" },
];

const FAQ = [
  {
    q: "¿Cómo solicito una reunión con un docente?",
    a: "Podés coordinar una reunión a través de la sección de comunicados de la app o contactando a la preceptoria correspondiente a tu curso durante el horario de atención.",
  },
  {
    q: "¿Dónde puedo ver las notas y la asistencia de mi hijo/a?",
    a: "Las notas y la asistencia se actualizan en tiempo real dentro de la aplicación Sentinel. Ingresá con tu cuenta y accedé a las secciones 'Asistencia' y 'Boletín'.",
  },
  {
    q: "¿Qué hago si olvidé mi contraseña?",
    a: "En la pantalla de inicio de sesión tocá '¿Olvidaste tu contraseña?' y te enviaremos un enlace de recuperación al correo registrado.",
  },
  {
    q: "¿Cómo me inscribo para el próximo ciclo?",
    a: "Completá el formulario online en la sección 'Inscripción' y luego presentate en la secretaría con la documentación requerida para continuar el trámite.",
  },
];

export default function Contacto() {
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
        <div className="absolute -left-24 bottom-20 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest shadow-sm backdrop-blur" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--accent)" }}>
            <MessageSquare size={13} strokeWidth={2.5} />
            Estamos para ayudarte
          </span>
          <h1
            className="mt-5 font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "var(--text-primary)" }}
          >
            Contacto
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            ¿Tenés dudas, sugerencias o necesitás comunicarte con la escuela?
            Completá el formulario o usá cualquiera de nuestros canales de atención.
          </p>
        </div>

        {/* Main grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="overflow-hidden rounded-3xl border shadow-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", boxShadow: "0 10px 25px -5px var(--overlay)" }}>
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-hover))" }} />
            <div className="p-7 sm:p-9">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center animate-[fade-in_0.4s_ease-out_both]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-lg" style={{ background: "linear-gradient(to bottom right, var(--accent), var(--accent-dark))", boxShadow: "0 10px 25px -5px var(--accent-glow)" }}>
                    <CheckCircle2 size={40} strokeWidth={2.2} />
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    ¡Mensaje enviado!
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Gracias{" "}
                    <span className="font-bold" style={{ color: "var(--accent)" }}>{form.nombre}</span>,
                    recibimos tu consulta sobre{" "}
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {SUBJECTS.find((s) => s.value === form.asunto)?.label || "tu consulta"}
                    </span>
                    . Te responderemos a{" "}
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{form.email}</span> a la brevedad.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
                    }}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border bg-transparent px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                      <Send size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        Enviar mensaje
                      </h2>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        Te responderemos a la brevedad
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Nombre" icon={<User size={16} />} value={form.nombre} onChange={(v) => update("nombre", v)} placeholder="Tu nombre" required />
                      <Field label="Correo electrónico" icon={<Mail size={16} />} type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="tu@correo.com" required />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        Asunto
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                          <MessageSquare size={16} />
                        </span>
                        <select
                          value={form.asunto}
                          onChange={(e) => update("asunto", e.target.value)}
                          required
                          className="w-full appearance-none rounded-xl border px-3 py-2.5 pl-10 pr-9 text-sm outline-none transition-all"
                          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
                        >
                          <option value="" disabled>Seleccionar...</option>
                          {SUBJECTS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>▼</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        Mensaje
                      </label>
                      <textarea
                        value={form.mensaje}
                        onChange={(e) => update("mensaje", e.target.value)}
                        rows={6}
                        required
                        placeholder="Escribí tu consulta o mensaje..."
                        className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none transition-all"
                        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-1 inline-flex items-center justify-center gap-2 self-start rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(to right, var(--accent), var(--accent-dark))", boxShadow: "0 4px 14px var(--accent-glow)" }}
                    >
                      <Send size={16} strokeWidth={2.5} /> Enviar mensaje
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Sidebar: info */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                <Building2 size={14} strokeWidth={2.5} /> Información de contacto
              </p>
              <ul className="mt-5 flex flex-col gap-5">
                {CONTACT_INFO.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--accent)" }}>
                      <c.icon size={18} strokeWidth={2.3} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        {c.label}
                      </p>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{c.value}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Redes sociales
              </p>
              <div className="mt-4 flex gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:-translate-y-0.5"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
              <div className="flex items-center gap-2 border-b px-5 py-3" style={{ borderColor: "var(--border)" }}>
                <Navigation size={15} style={{ color: "var(--accent)" }} strokeWidth={2.5} />
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Cómo llegar
                </p>
              </div>
              <div className="relative h-64 w-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <iframe
                  title="Ubicación E.E.S.T. Nro. 3"
                  src="https://maps.google.com/maps?q=El%20Algarrobo%20223%2C%20B1718%20San%20Antonio%20de%20Padua%2C%20Provincia%20de%20Buenos%20Aires&z=16&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href="https://maps.app.goo.gl/BcFRFccToD6CMMcH9"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 border-t px-5 py-3 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--accent)" }}>
                  <MapPin size={16} strokeWidth={2.5} />
                  Abrir en Google Maps
                </span>
                <span className="transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }}>
                  <Navigation size={16} strokeWidth={2.5} />
                </span>
              </a>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest shadow-sm backdrop-blur" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--accent)" }}>
              <MessageSquare size={13} strokeWidth={2.5} />
              Preguntas frecuentes
            </span>
            <h2
              className="mt-5 font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", color: "var(--text-primary)" }}
            >
              ¿Te quedan dudas?
            </h2>
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              Revisá las consultas más comunes antes de escribirnos.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col gap-3">
              {FAQ.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-2xl border transition-all"
                    style={{ borderColor: open ? "var(--accent)" : "var(--border)", backgroundColor: "var(--bg-card)", boxShadow: open ? "0 4px 14px var(--overlay)" : "none" }}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.q}</span>
                      <ChevronDown
                        size={18}
                        className="shrink-0 transition-transform"
                        style={{ color: "var(--accent)", transform: open ? "rotate(180deg)" : "" }}
                        strokeWidth={2.5}
                      />
                    </button>
                    <div
                      className="grid transition-all duration-300"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border px-3 py-2.5 pl-10 text-sm outline-none transition-all"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}
