import { NavLink } from "react-router-dom";
import { ShieldCheck, Mail, Phone, MapPin, Camera, Play, Code } from "lucide-react";

const LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Especialidades", to: "/especialidades" },
  { label: "Inscripción", to: "/inscripcion" },
  { label: "Contacto", to: "/contacto" },
];

const SOCIAL = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
  { icon: Code, label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "var(--bg-sidebar)", color: "var(--text-secondary)" }}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl shadow-lg"
                style={{
                  backgroundImage: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  color: "var(--accent-text)",
                  boxShadow: "0 10px 15px -3px var(--accent-glow), 0 4px 6px -4px var(--accent-glow)",
                }}
              >
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>E.E.S.T. Nro. 3</p>
                <p className="text-[11px] font-medium" style={{ color: "var(--accent-light)" }}>Padua · Pcia. de Buenos Aires</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Sistema de Asistencia Inteligente. La escuela conectada con alumnos,
              docentes y familias.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-glow)] hover:text-[var(--accent-light)]"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Navegación
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Acceso
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <NavLink to="/login" className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
                  Iniciar sesión
                </NavLink>
              </li>
              <li>
                <NavLink to="/registro" className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
                  Crear cuenta
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Contacto
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <MapPin size={16} style={{ color: "var(--accent)" }} /> El Algarrobo 223, San Antonio de Padua
              </li>
              <li className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <Phone size={16} style={{ color: "var(--accent)" }} /> (0220) 486-3633
              </li>
              <li className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <Mail size={16} style={{ color: "var(--accent)" }} /> eestmerlo@abc.gob.ar
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row" style={{ borderTopColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} E.E.S.T. Nro. 3 · Sentinel. Proyecto educativo.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Hecho con React, TypeScript y Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
