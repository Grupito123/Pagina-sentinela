import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  Save,
  Bell,
  Globe,
  Eye,
  EyeOff,
  CheckCircle2,
  Settings as SettingsIcon,
  Building2,
} from "lucide-react";

export default function Configuracion() {
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Configuración</h1>
        <p className="mt-1 text-sm text-slate-500">Gestioná tu cuenta y las preferencias del sistema</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25">
                  <ShieldCheck size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Perfil del administrador</h2>
                  <p className="text-sm text-slate-500">Datos personales y de contacto</p>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-2xl font-black text-white shadow-lg shadow-sky-600/25">
                  AD
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900">Administrador</p>
                  <p className="text-sm text-slate-500">admin@eestmerlo.gob.ar</p>
                  <button type="button" className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                    Cambiar foto
                  </button>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Nombre completo</Label>
                  <Input icon={<ShieldCheck size={16} />} defaultValue="Administrador Root" />
                </div>
                <div>
                  <Label>DNI</Label>
                  <Input icon={<ShieldCheck size={16} />} defaultValue="20.000.000" />
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <Input icon={<Mail size={16} />} type="email" defaultValue="admin@eestmerlo.gob.ar" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input icon={<Phone size={16} />} type="tel" defaultValue="0220 000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Nueva contraseña</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={16} /></span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Dejar en blanco para mantener la actual"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                    />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button type="button" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit" className={[
                  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5",
                  saved ? "bg-emerald-600 shadow-emerald-600/25" : "bg-sky-600 shadow-sky-600/25 hover:bg-sky-700",
                ].join(" ")}>
                  {saved ? <><CheckCircle2 size={16} strokeWidth={2.5} /> Guardado</> : <><Save size={16} strokeWidth={2.5} /> Guardar cambios</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preferences */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
              <Bell size={14} strokeWidth={2.5} /> Notificaciones
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {[
                "Nuevos registros de usuarios",
                "Ausencias reiteradas",
                "Llegadas tarde por curso",
                "Resumen diario por email",
              ].map((t, i) => (
                <label key={t} className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">{t}</span>
                  <Toggle defaultChecked={i < 3} />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
              <Building2 size={14} strokeWidth={2.5} /> Datos de la institución
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <Label>Nombre</Label>
                <Input icon={<Building2 size={16} />} defaultValue="E.E.S.T. Nro. 3" />
              </div>
              <div>
                <Label>Correo institucional</Label>
                <Input icon={<Mail size={16} />} type="email" defaultValue="eestmerlo@abc.gob.ar" />
              </div>
              <div>
                <Label>Ubicación (Google Maps)</Label>
                <Input icon={<Globe size={16} />} defaultValue="https://maps.app.goo.gl/BcFRFccToD6CMMcH9" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
              <SettingsIcon size={14} strokeWidth={2.5} /> Sistema
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Row label="Versión" value="Sentinel v1.0.0" />
              <Row label="Última actualización" value="Jul 2026" />
              <Row label="Base de datos" value="Conectada" valueClass="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">{children}</label>;
}
function Input({ icon, type = "text", defaultValue, placeholder }: { icon: React.ReactNode; type?: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10" />
    </div>
  );
}
function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={[
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-sky-600" : "bg-slate-200",
      ].join(" ")}
    >
      <span className={[
        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
        on ? "left-[1.375rem]" : "left-0.5",
      ].join(" ")} />
    </button>
  );
}
function Row({ label, value, valueClass = "text-slate-700" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}
