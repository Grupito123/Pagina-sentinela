import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, LogIn, LogOut, UserPlus, Menu, X, Palette, Check } from "lucide-react";
import { useTheme } from "../../Context/useTheme";
import { THEMES } from "../../Context/themes";
import type { ThemeId } from "../../Context/ThemeContext";
import { useSesion, cerrarSesion, tieneRango, type Rango } from "../../services/sesion";

const NAV_LINKS: { label: string; to: string; rango?: Rango }[] = [
  { label: "Inicio", to: "/" },
  { label: "Especialidades", to: "/especialidades" },
  { label: "Inscripción", to: "/inscripcion" },
  { label: "QR", to: "/qr", rango: "qr" }, // solo visible para el rango QR
  { label: "Contacto", to: "/contacto" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const sesion = useSesion();
  const links = NAV_LINKS.filter((l) => !l.rango || tieneRango(sesion, l.rango));

  const salir = () => {
    cerrarSesion();
    setMobileOpen(false);
    navigate("/");
  };
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, var(--accent-dark), var(--accent), var(--accent-dark))" }} />

      <nav className="w-full border-b backdrop-blur-xl" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)" }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center gap-8">
            <NavLink to="/" className="flex shrink-0 items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 14px var(--accent-glow)" }}>
                <ShieldCheck size={22} strokeWidth={2.5} />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2" style={{ borderColor: "var(--bg-primary)", backgroundColor: "var(--accent-light)" }} />
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  E.E.S.T. Nro. 3
                </p>
                <p className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>
                  Padua · Pcia. de Buenos Aires
                </p>
              </div>
            </NavLink>

            <div className="hidden flex-1 items-center gap-1 md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    [
                      "relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                      isActive ? "" : "",
                    ].join(" ")
                  }
                  style={({ isActive }) => ({
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full" style={{ background: "linear-gradient(to right, var(--accent), var(--accent-light))" }} />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Theme switcher */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setThemeOpen((v) => !v)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label="Cambiar tema"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <Palette size={19} />
                </button>

                {themeOpen && (
                  <div
                    className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border shadow-xl shadow-black/40 animate-[fade-in_0.15s_ease-out_both]"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Tema de color</p>
                    </div>
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id as ThemeId); setThemeOpen(false); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                        style={{
                          color: theme === t.id ? "var(--accent)" : "var(--text-secondary)",
                          backgroundColor: theme === t.id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                        }}
                        onMouseEnter={(e) => { if (theme !== t.id) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                        onMouseLeave={(e) => { if (theme !== t.id) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <span className="text-base">{t.emoji}</span>
                        <span className="flex-1 text-left">{t.label}</span>
                        {theme === t.id && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Notificaciones"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full ring-2" style={{ backgroundColor: "var(--accent)", boxShadow: `0 0 0 2px var(--bg-primary)` }} />
              </button>

              {sesion ? (
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="text-right leading-tight">
                    <span className="block text-sm font-bold" style={{ color: "var(--text-primary)" }}>{sesion.nombre}</span>
                    <span className="block text-[11px] font-semibold uppercase" style={{ color: "var(--accent)" }}>Rango {sesion.rango}</span>
                  </span>
                  <button
                    onClick={salir}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                    style={{ border: "1px solid var(--border-light)", color: "var(--text-secondary)" }}
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
              <>
              <button
                onClick={() => navigate("/login")}
                className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all sm:inline-flex"
                style={{ border: "1px solid var(--border-light)", color: "var(--text-secondary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>

              <button
                onClick={() => navigate("/registro")}
                className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 sm:inline-flex"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)", boxShadow: "0 4px 14px var(--accent-glow)" }}
              >
                <UserPlus size={16} />
                Registrarse
              </button>
              </>
              )}

              <button
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menú"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t px-5 pb-4 pt-2 md:hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}>
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                  style={({ isActive }) => ({
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {sesion ? (
                <>
                  <p className="px-4 text-xs" style={{ color: "var(--text-muted)" }}>
                    Sesión: <span className="font-bold" style={{ color: "var(--text-primary)" }}>{sesion.nombre}</span> · rango {sesion.rango}
                  </p>
                  <button
                    onClick={salir}
                    className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    style={{ border: "1px solid var(--border-light)", color: "var(--text-secondary)" }}
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
              <>
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{ border: "1px solid var(--border-light)", color: "var(--text-secondary)" }}
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/registro"); }}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--accent-text)" }}
              >
                <UserPlus size={16} />
                Registrarse
              </button>
              </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
