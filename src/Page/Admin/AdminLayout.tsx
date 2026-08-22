import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ShieldCheck,
  Shield,
  ChevronDown,
  Palette,
  Check,
  Link2,
} from "lucide-react";
import { useTheme } from "../../Context/useTheme";
import { THEMES } from "../../Context/themes";
import type { ThemeId } from "../../Context/ThemeContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users, end: false },
  { to: "/admin/asistencia", label: "Asistencia", icon: ClipboardCheck, end: false },
  { to: "/admin/autorizaciones", label: "Autorizaciones", icon: Shield, end: false },
  { to: "/admin/vinculaciones", label: "Vinculaciones", icon: Link2, end: false },
  { to: "/admin/reportes", label: "Reportes", icon: FileText, end: false },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex" style={{ borderRight: "1px solid var(--border)", backgroundColor: "var(--bg-sidebar)" }}>
        <SidebarContent />
      </aside>

      {/* Sidebar (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: "var(--overlay)" }} onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col animate-[fade-in_0.2s_ease-out_both]" style={{ borderRight: "1px solid var(--border)", backgroundColor: "var(--bg-sidebar)" }}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute -right-10 top-3 flex h-9 w-9 items-center justify-center rounded-lg shadow-md"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 px-4 backdrop-blur-xl sm:px-6" style={{ borderBottom: "1px solid var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)" }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Menú"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="relative hidden flex-1 sm:block">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar alumnos, docentes, cursos..."
              className="w-full max-w-md rounded-xl py-2 pl-10 pr-3 text-sm outline-none transition-all"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors" style={{ color: "var(--text-secondary)" }}>
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 0 2px var(--bg-primary)" }} />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[var(--accent-text)]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}>
                  AD
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Administrador</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Rol total</p>
                </div>
                <ChevronDown size={15} className="hidden sm:block" style={{ color: "var(--text-muted)" }} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-2xl shadow-xl animate-[fade-in_0.15s_ease-out_none]" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", boxShadow: "0 10px 30px var(--overlay)" }}>
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Administrador</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>admin@eestmerlo.gob.ar</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/admin/configuracion"); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Settings size={16} /> Configuración
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/"); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--accent-text)] shadow-lg" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 14px var(--accent-glow)" }}>
          <ShieldCheck size={22} strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Sentinel</p>
          <p className="text-[10px] font-medium" style={{ color: "var(--accent)" }}>Panel admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          General
        </p>
        <div className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent",
              })}
            >
              {({ isActive: a }) => (
                <>
                  <item.icon size={19} strokeWidth={a ? 2.5 : 2} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Theme switcher */}
      <div className="px-3 pb-2" ref={themeRef}>
        <div className="relative">
          <button
            onClick={() => setThemeOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Palette size={19} />
            <span className="flex-1 text-left">Tema: {THEMES.find((t) => t.id === theme)?.label}</span>
            <ChevronDown size={14} />
          </button>
          {themeOpen && (
            <div
              className="absolute bottom-full left-0 mb-1 w-full overflow-hidden rounded-xl shadow-xl animate-[fade-in_0.15s_ease-out_none]"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id as ThemeId); setThemeOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors"
                  style={{
                    color: theme === t.id ? "var(--accent)" : "var(--text-secondary)",
                    backgroundColor: theme === t.id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                  }}
                >
                  <span>{t.emoji}</span>
                  <span className="flex-1 text-left">{t.label}</span>
                  {theme === t.id && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <LogOut size={19} /> Volver al sitio
        </button>
      </div>
    </>
  );
}
