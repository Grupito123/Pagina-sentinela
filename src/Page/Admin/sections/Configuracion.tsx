import { useState } from "react";
import {
  User,
  Lock,
  Building2,
  Bell,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

type Tab = "perfil" | "contraseña" | "institucional" | "notificaciones";

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: "perfil", label: "Perfil", icon: User },
  { key: "contraseña", label: "Contraseña", icon: Lock },
  { key: "institucional", label: "Institucional", icon: Building2 },
  { key: "notificaciones", label: "Notificaciones", icon: Bell },
];

export default function Configuracion() {
  const [tab, setTab] = useState<Tab>("perfil");
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [profile, setProfile] = useState({
    name: "Administrador",
    email: "admin@eestmerlo.gob.ar",
    phone: "11-5555-0001",
    role: "Administrador general",
  });

  const [institution, setInstitution] = useState({
    name: "E.E.S.T. Nro. 3",
    location: "Merlo, Pcia. de Buenos Aires",
    email: "eestmerlo@abc.gob.ar",
    phone: "11-5555-0000",
    website: "https://eest3-merlo.edu.ar",
    director: "Ing. Roberto Martínez",
  });

  const [notifs, setNotifs] = useState({
    email: true,
    attendance: true,
    reports: false,
    system: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Configuración</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Administrar tu cuenta y preferencias del sistema</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent-text)] shadow-lg shadow-[0_4px_14px_var(--accent-glow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
        >
          {saved ? <><Check size={16} /> Guardado</> : <><Save size={16} /> Guardar cambios</>}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.key ? "bg-[var(--error-bg)] text-[var(--error)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <t.icon size={17} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          {tab === "perfil" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Tu perfil</h2>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-2xl font-extrabold text-[var(--accent-text)] shadow-lg shadow-[0_4px_14px_var(--accent-glow)]">
                    AD
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[var(--bg-card)] bg-[var(--bg-card-hover)] text-[var(--text-muted)] transition-colors hover:bg-[var(--border-light)]">
                    <Camera size={13} />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">{profile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{profile.role}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">NOMBRE</label>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">EMAIL</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">TELÉFONO</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">ROL</label>
                  <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-muted)]">
                    <Shield size={15} className="text-[var(--error)]" />
                    {profile.role}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "contraseña" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Cambiar contraseña</h2>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">CONTRASEÑA ACTUAL</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-10 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">NUEVA CONTRASEÑA</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">CONFIRMAR</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                  />
                </div>
                <button className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-text)] shadow-lg shadow-[0_4px_14px_var(--accent-glow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]">
                  Actualizar contraseña
                </button>
              </div>
            </div>
          )}

          {tab === "institucional" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Datos institucionales</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">NOMBRE DE LA ESCUELA</label>
                  <input
                    value={institution.name}
                    onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">UBICACIÓN</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={institution.location}
                      onChange={(e) => setInstitution({ ...institution, location: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">EMAIL INSTITUCIONAL</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={institution.email}
                      onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">TELÉFONO</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={institution.phone}
                      onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">SITIO WEB</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={institution.website}
                      onChange={(e) => setInstitution({ ...institution, website: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">DIRECTOR</label>
                  <input
                    value={institution.director}
                    onChange={(e) => setInstitution({ ...institution, director: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "notificaciones" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Preferencias de notificación</h2>
              <div className="space-y-4">
                {([
                  { key: "email" as const, label: "Notificaciones por email", desc: "Recibir resúmenes diarios en tu casilla" },
                  { key: "attendance" as const, label: "Alertas de asistencia", desc: "Avisar cuando un alumno se marca como ausente" },
                  { key: "reports" as const, label: "Reportes automáticos", desc: "Recibir reportes semanales generados por el sistema" },
                  { key: "system" as const, label: "Actualizaciones del sistema", desc: "Avisar sobre nuevas funciones y mantenimiento" },
                ]).map((n) => (
                  <div key={n.key} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-input)]/50 p-4">
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{n.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key] })}
                      className={`relative h-6 w-11 rounded-full transition-colors ${notifs[n.key] ? "bg-[var(--accent)]" : "bg-[var(--border-light)]"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs[n.key] ? "left-5.5 translate-x-0" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
