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
    value: "Padua, Merlo · Pcia. de Buenos Aires",
    detail: "Av. Hipólito Yrigoyen 0000",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "(0220) 000-0000",
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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -left-24 bottom-20 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-600 shadow-sm backdrop-blur">
            <MessageSquare size={13} strokeWidth={2.5} />
            Estamos para ayudarte
          </span>
          <h1
            className="mt-5 font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
          >
            Contacto
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            ¿Tenés dudas, sugerencias o necesitás comunicarte con la escuela?
            Completá el formulario o usá cualquiera de nuestros canales de atención.
          </p>
        </div>

        {/* Main grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />
            <div className="p-7 sm:p-9">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center animate-[fade-in_0.4s_ease-out_both]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/30">
                    <CheckCircle2 size={40} strokeWidth={2.2} />
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
                    ¡Mensaje enviado!
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                    Gracias{" "}
                    <span className="font-bold text-sky-600">{form.nombre}</span>,
                    recibimos tu consulta sobre{" "}
                    <span className="font-semibold text-slate-800">
                      {SUBJECTS.find((s) => s.value === form.asunto)?.label || "tu consulta"}
                    </span>
                    . Te responderemos a{" "}
                    <span className="font-semibold text-slate-800">{form.email}</span> a la brevedad.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
                    }}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-sky-300"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25">
                      <Send size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                        Enviar mensaje
                      </h2>
                      <p className="text-sm text-slate-500">
                        Te responderemos a la brevedad
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Nombre"
                        icon={<User size={16} />}
                        value={form.nombre}
                        onChange={(v) => update("nombre", v)}
                        placeholder="Tu nombre"
                        required
                      />
                      <Field
                        label="Correo electrónico"
                        icon={<Mail size={16} />}
                        type="email"
                        value={form.email}
                        onChange={(v) => update("email", v)}
                        placeholder="tu@correo.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        Asunto
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                          <MessageSquare size={16} />
                        </span>
                        <select
                          value={form.asunto}
                          onChange={(e) => update("asunto", e.target.value)}
                          required
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                        >
                          <option value="" disabled>
                            Seleccionar...
                          </option>
                          {SUBJECTS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                        Mensaje
                      </label>
                      <textarea
                        value={form.mensaje}
                        onChange={(e) => update("mensaje", e.target.value)}
                        rows={6}
                        required
                        placeholder="Escribí tu consulta o mensaje..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-1 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5"
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
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
                <Building2 size={14} strokeWidth={2.5} /> Información de contacto
              </p>
              <ul className="mt-5 flex flex-col gap-5">
                {CONTACT_INFO.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                      <c.icon size={18} strokeWidth={2.3} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {c.label}
                      </p>
                      <p className="text-sm font-bold text-slate-800">{c.value}</p>
                      <p className="text-xs text-slate-500">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Redes sociales
              </p>
              <div className="mt-4 flex gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <Navigation size={15} className="text-sky-600" strokeWidth={2.5} />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cómo llegar
                </p>
              </div>
              <div className="relative h-64 w-full bg-sky-50">
                <iframe
                  title="Ubicación E.E.S.T. Nro. 3"
                  src="https://maps.google.com/maps?q=EEST%20N%C2%B0%203%20Merlo%20Buenos%20Aires&z=15&output=embed"
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
                className="group flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 transition-colors hover:bg-sky-50"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-sky-600">
                  <MapPin size={16} strokeWidth={2.5} />
                  Abrir en Google Maps
                </span>
                <span className="text-sky-600 transition-transform group-hover:translate-x-1">
                  <Navigation size={16} strokeWidth={2.5} />
                </span>
              </a>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-600 shadow-sm backdrop-blur">
              <MessageSquare size={13} strokeWidth={2.5} />
              Preguntas frecuentes
            </span>
            <h2
              className="mt-5 font-extrabold tracking-tight text-slate-900"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
            >
              ¿Te quedan dudas?
            </h2>
            <p className="mt-3 text-sm text-slate-600">
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
                    className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                      open ? "border-sky-300 shadow-md" : "border-slate-200"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-bold text-slate-800">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-sky-600 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>
                    <div
                      className="grid transition-all duration-300"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
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
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
        />
      </div>
    </div>
  );
}
