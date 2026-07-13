import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, LogIn, UserPlus, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Especialidades", to: "/especialidades" },
  { label: "Inscripción", to: "/inscripcion" },
  { label: "Institucional", to: "/institucional" },
  { label: "Contacto", to: "/contacto" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="h-1 w-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500" />

      <nav className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center gap-8">
            <NavLink to="/" className="flex shrink-0 items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-lg shadow-sky-600/30">
                <ShieldCheck size={22} strokeWidth={2.5} />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-cyan-500" />
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-extrabold tracking-tight text-slate-900">
                  E.E.S.T. Nro. 3
                </p>
                <p className="text-[11px] font-medium text-sky-600">
                  Padua · Pcia. de Buenos Aires
                </p>
              </div>
            </NavLink>

            <div className="hidden flex-1 items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    [
                      "relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "text-sky-600"
                        : "text-slate-500 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Notificaciones"
                title="Notificaciones"
              >
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white" />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-sky-300 hover:text-sky-600 sm:inline-flex"
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>

              <button
                onClick={() => navigate("/registro")}
                className="hidden items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:bg-sky-700 sm:inline-flex"
              >
                <UserPlus size={16} />
                Registrarse
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menú"
                title="Menú"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-5 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/registro");
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <UserPlus size={16} />
                Registrarse
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
