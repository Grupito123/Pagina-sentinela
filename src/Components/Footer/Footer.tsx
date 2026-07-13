import { NavLink } from "react-router-dom";
import { ShieldCheck, Mail, Phone, MapPin, Camera, Play, Code } from "lucide-react";

const LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Especialidades", to: "/especialidades" },
  { label: "Inscripción", to: "/inscripcion" },
  { label: "Institucional", to: "/institucional" },
  { label: "Contacto", to: "/contacto" },
];

const SOCIAL = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
  { icon: Code, label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-sky-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-900/40">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-extrabold text-white">E.E.S.T. Nro. 3</p>
                <p className="text-[11px] font-medium text-sky-300">Padua · Pcia. de Buenos Aires</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
              Sistema de Asistencia Inteligente. La escuela conectada con alumnos,
              docentes y familias.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-800 text-slate-400 transition-colors hover:border-sky-500 hover:bg-sky-500/10 hover:text-sky-300"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Navegación
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Acceso
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <NavLink to="/login" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Iniciar sesión
                </NavLink>
              </li>
              <li>
                <NavLink to="/registro" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Crear cuenta
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Contacto
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin size={16} className="text-sky-400" /> Padua, Merlo · Buenos Aires
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone size={16} className="text-sky-400" /> (0220) 000-0000
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail size={16} className="text-sky-400" /> eestmerlo@abc.gob.ar
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sky-900 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} E.E.S.T. Nro. 3 · Sentinel. Proyecto educativo.
          </p>
          <p className="text-xs text-slate-500">
            Hecho con React, TypeScript y Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
