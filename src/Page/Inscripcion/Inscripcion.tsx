import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  ShieldCheck,
  ClipboardList,
  IdCard,
  Home,
  Info,
} from "lucide-react";

const STEPS = [
  { n: 1, label: "Completar formulario", icon: ClipboardList },
  { n: 2, label: "Presentar documentación", icon: FileText },
  { n: 3, label: "Entrevista", icon: User },
  { n: 4, label: "Confirmación", icon: CheckCircle2 },
];

const REQUIREMENTS = [
  { icon: IdCard, text: "DNI del alumno y fotocopia" },
  { icon: FileText, text: "Certificado de estudios primarios" },
  { icon: FileText, text: "Libreta/boletín de 7mo grado" },
  { icon: IdCard, text: "DNI del tutor/responsable" },
  { icon: Home, text: "Comprobante de domicilio" },
  { icon: FileText, text: "Ficha de inscripción firmada" },
];

const SPECIALTIES = [
  { value: "informatica", label: "Técnico en Informática" },
  { value: "electromecanica", label: "Técnico en Electromecánica" },
  { value: "sin-definir", label: "Sin definir / A consultar" },
];

const SHIFTS = [
  { value: "manana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "vespertino", label: "Vespertino" },
];

export default function Inscripcion() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    email: "",
    telefono: "",
    direccion: "",
    tutorNombre: "",
    tutorTelefono: "",
    tutorEmail: "",
    especialidad: "",
    turno: "",
    observaciones: "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const totalSteps = 3;
  const canNext =
    (step === 1 && form.nombre && form.apellido && form.dni && form.nacimiento) ||
    (step === 2 && form.tutorNombre && form.tutorTelefono) ||
    step === 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="relative w-full py-20" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-3xl border p-10 text-center shadow-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", boxShadow: "0 10px 25px -5px var(--overlay)" }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-lg" style={{ background: "linear-gradient(to bottom right, var(--accent), var(--accent-dark))", boxShadow: "0 10px 25px -5px var(--accent-glow)" }}>
              <CheckCircle2 size={40} strokeWidth={2.2} />
            </div>
            <h2
              className="mt-6 font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", color: "var(--text-primary)" }}
            >
              ¡Inscripción enviada!
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Recibimos la solicitud de inscripción de{" "}
              <span className="font-bold" style={{ color: "var(--accent)" }}>
                {form.nombre} {form.apellido}
              </span>
              . Nos comunicaremos al correo{" "}
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{form.email || "indicado"}</span>{" "}
              para coordinar la entrega de documentación y la entrevista.
            </p>

            <div className="mt-7 rounded-2xl p-5 text-left" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                <Info size={14} strokeWidth={2.5} /> Próximos pasos
              </p>
              <ol className="mt-3 flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>1</span>
                  Reuní la documentación requerida (ver lista abajo).
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>2</span>
                  Presentala en la secretaría de la escuela en horario de atención.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>3</span>
                  Concurrí a la entrevista con el preceptor/a asignado.
                </li>
              </ol>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}
              >
                <Home size={16} strokeWidth={2.5} /> Volver al inicio
              </a>
              <a
                href="/especialidades"
                className="inline-flex items-center gap-2 rounded-xl border bg-transparent px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                Ver especialidades <ArrowRight size={16} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
        <div className="absolute -left-24 top-40 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent)", opacity: 0.08 }} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-12 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest shadow-sm backdrop-blur" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--accent)" }}>
            <ShieldCheck size={13} strokeWidth={2.5} />
            Inscripción 2026 · Cupos limitados
          </span>
          <h1
            className="mt-5 font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "var(--text-primary)" }}
          >
            Inscripción
            <br />
            <span style={{ color: "var(--accent)" }}>en línea</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Completá el formulario para iniciar tu inscripción en la E.E.S.T. Nro. 3.
            El proceso consta de 3 pasos y te tomará menos de 5 minutos.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => {
            const reached = step >= s.n;
            const active = step === s.n;
            return (
              <div key={s.n} className="flex items-center gap-2 sm:gap-4">
                <div
                  className="flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 transition-all sm:px-4"
                  style={{
                    borderColor: active ? "var(--accent)" : reached ? "var(--border)" : "var(--border)",
                    backgroundColor: active ? "var(--bg-secondary)" : "var(--bg-card)",
                    opacity: active ? 1 : reached ? 1 : 0.6,
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: active ? "var(--accent)" : reached ? "var(--bg-secondary)" : "var(--bg-input)",
                      color: active ? "var(--accent-text)" : reached ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {s.n}
                  </span>
                  <span
                    className="hidden text-xs font-semibold sm:block"
                    style={{ color: active ? "var(--accent)" : reached ? "var(--text-secondary)" : "var(--text-muted)" }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px w-4 sm:w-8" style={{ backgroundColor: "var(--border)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border shadow-lg"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", boxShadow: "0 10px 25px -5px var(--overlay)" }}
          >
            {/* Progress bar */}
            <div className="h-1.5 w-full" style={{ backgroundColor: "var(--bg-input)" }}>
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%`, background: "linear-gradient(to right, var(--accent), var(--accent-hover))" }}
              />
            </div>

            <div className="p-7 sm:p-9">
              {/* STEP 1: Datos del alumno */}
              {step === 1 && (
                <div className="animate-[fade-in_0.4s_ease-out_both]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                      <User size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        Datos del alumno
                      </h2>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Información personal del aspirante</p>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <Field label="Nombre" icon={<User size={16} />} value={form.nombre} onChange={(v) => update("nombre", v)} placeholder="Juan" required />
                    <Field label="Apellido" icon={<User size={16} />} value={form.apellido} onChange={(v) => update("apellido", v)} placeholder="Pérez" required />
                    <Field label="DNI" icon={<IdCard size={16} />} value={form.dni} onChange={(v) => update("dni", v)} placeholder="42.123.456" required />
                    <Field label="Fecha de nacimiento" icon={<Calendar size={16} />} type="date" value={form.nacimiento} onChange={(v) => update("nacimiento", v)} required />
                    <Field label="Correo electrónico" icon={<Mail size={16} />} type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="alumno@correo.com" />
                    <Field label="Teléfono" icon={<Phone size={16} />} type="tel" value={form.telefono} onChange={(v) => update("telefono", v)} placeholder="(0220) 123-4567" />
                    <div className="sm:col-span-2">
                      <Field label="Dirección" icon={<MapPin size={16} />} value={form.direccion} onChange={(v) => update("direccion", v)} placeholder="Calle y número, Padua" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Datos del tutor */}
              {step === 2 && (
                <div className="animate-[fade-in_0.4s_ease-out_both]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                      <ShieldCheck size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        Datos del tutor
                      </h2>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Padre, madre o responsable a cargo</p>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Nombre completo del tutor" icon={<User size={16} />} value={form.tutorNombre} onChange={(v) => update("tutorNombre", v)} placeholder="María González" required />
                    </div>
                    <Field label="Teléfono" icon={<Phone size={16} />} type="tel" value={form.tutorTelefono} onChange={(v) => update("tutorTelefono", v)} placeholder="(0220) 987-6543" required />
                    <Field label="Correo electrónico" icon={<Mail size={16} />} type="email" value={form.tutorEmail} onChange={(v) => update("tutorEmail", v)} placeholder="tutor@correo.com" />
                  </div>
                </div>
              )}

              {/* STEP 3: Especialidad y observaciones */}
              {step === 3 && (
                <div className="animate-[fade-in_0.4s_ease-out_both]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                      <GraduationCap size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        Especialidad y turno
                      </h2>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Elegí la orientación de tu interés</p>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <SelectField label="Especialidad de interés" icon={<GraduationCap size={16} />} value={form.especialidad} onChange={(v) => update("especialidad", v)} options={SPECIALTIES} placeholder="Seleccionar..." />
                    <SelectField label="Turno preferido" icon={<Calendar size={16} />} value={form.turno} onChange={(v) => update("turno", v)} options={SHIFTS} placeholder="Seleccionar..." />
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        Observaciones (opcional)
                      </label>
                      <textarea
                        value={form.observaciones}
                        onChange={(e) => update("observaciones", e.target.value)}
                        rows={4}
                        placeholder="Contanos algo que consideres relevante: salud, actividades extracurriculares, etc."
                        className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none transition-all"
                        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
                      />
                    </div>
                  </div>

                  <label className="mt-4 flex cursor-pointer items-start gap-2">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded" style={{ accentColor: "var(--accent)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Declaro que la información proporcionada es verídica y acepto la{" "}
                      <a href="#" className="font-semibold" style={{ color: "var(--accent)" }}>política de privacidad</a> de la institución.
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  <ArrowLeft size={16} /> Anterior
                </button>

                <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                  Paso {step} de {totalSteps}
                </span>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => canNext && setStep((s) => Math.min(totalSteps, s + 1))}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}
                  >
                    Siguiente <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(to right, var(--accent), var(--accent-dark))", boxShadow: "0 4px 14px var(--accent-glow)" }}
                  >
                    <Send size={16} strokeWidth={2.5} /> Enviar inscripción
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Sidebar: requisitos */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                <FileText size={14} strokeWidth={2.5} /> Documentación requerida
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                {REQUIREMENTS.map((r) => (
                  <li key={r.text} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--accent)" }}>
                      <r.icon size={15} strokeWidth={2.3} />
                    </div>
                    {r.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                <Info size={14} strokeWidth={2.5} /> Información importante
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} strokeWidth={2.3} />
                  La inscripción online inicia el trámite, no lo confirma.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} strokeWidth={2.3} />
                  Los cupos se asignan por orden de llegada y entrevista.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} strokeWidth={2.3} />
                  Secretaría atiende de lunes a viernes de 9 a 16 hs.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl p-6 text-white shadow-lg" style={{ background: "linear-gradient(to bottom right, var(--accent), var(--accent-dark))", boxShadow: "0 10px 25px -5px var(--accent-glow)" }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-text)", opacity: 0.8 }}>
                ¿Dudas con la inscripción?
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--accent-text)" }}>
                Comunicate con la secretaría de la escuela y te asesoramos.
              </p>
              <a
                href="tel:+542204863633"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold backdrop-blur transition-all hover:bg-white/25"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--accent-text)" }}
              >
                <Phone size={15} strokeWidth={2.5} /> (0220) 486-3633
              </a>
            </div>
          </aside>
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

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border px-3 py-2.5 pl-10 pr-9 text-sm outline-none transition-all"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>▼</span>
      </div>
    </div>
  );
}
