import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import "./Auth.css";

export default function Auth() {
  const location = useLocation();
  const [active, setActive] = useState<"register" | "login">(
    location.pathname === "/login" ? "login" : "register"
  );
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center font-sans" style={{ background: "#082f49" }}>
      <div className="container overflow-hidden relative z-10">
        {/* BACKGROUND - image slides to show correct half */}
        <div
          className="absolute top-0 left-0 w-[1800px] h-full transition-transform duration-500 ease-in-out"
          style={{
            backgroundImage: "url('https://picsum.photos/seed/sentinel-auth/1800/600')",
            backgroundSize: "1800px 100%",
            filter: "brightness(0.6)",
            transform: `translateX(${active === "login" ? "-900px" : "0px"})`,
          }}
        />

        {/* Fixed center divider */}
        <div className="absolute left-1/2 top-0 h-full w-px z-50" style={{ background: "#D1D5DB" }} />

        {/* VIEW 1: Default - Register Button (left) + Login Form (right) */}
        <div
          className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out z-10"
          style={{ transform: `translateX(${active === "login" ? "900px" : "0px"})` }}
        >
          <div className="flex h-full">
            <div className="w-1/2 h-full flex flex-col justify-center items-center p-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #0EA5E9, #0284C7)" }}>
                <User size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¿Sos nuevo?</h2>
              <p className="text-sm text-white/70 text-center mb-6">Registrate y formá parte de la comunidad</p>
              <button type="button" onClick={() => setActive("login")} className="px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95" style={{ background: "linear-gradient(135deg, #0EA5E9, #0284C7)" }}>
                Registrarse
              </button>
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center p-12" style={{ background: "#fff" }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white" style={{ background: "linear-gradient(135deg, #0EA5E9, #06B6D4)" }}>S</div>
                <span className="text-lg font-black text-gray-900">Sentinel</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h2>
              <p className="text-sm text-gray-400 mb-6">Ingresá tus credenciales</p>
              <form onSubmit={(e) => { e.preventDefault(); console.log("Login:", { email: loginEmail, password: loginPass }); }} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">CORREO</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="nombre@escuela.edu" className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border outline-none focus:border-[#0EA5E9] transition-colors" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">CONTRASEÑA</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type={showLogin ? "text" : "password"} value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm border outline-none focus:border-[#0EA5E9] transition-colors" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }} required />
                    <button type="button" onClick={() => setShowLogin(!showLogin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                      {showLogin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: "#0EA5E9" }} />
                    <span className="text-xs text-gray-400">Recordarme</span>
                  </label>
                  <a href="#" className="text-xs font-semibold" style={{ color: "#0EA5E9" }}>¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #0EA5E9, #06B6D4)" }}>
                  Iniciar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* VIEW 2: Login active - Register Form (left) + Login Button (right) */}
        <div
          className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out z-10"
          style={{ transform: `translateX(${active === "login" ? "0px" : "-900px"})` }}
        >
          <div className="flex h-full">
            <div className="w-1/2 h-full flex flex-col justify-center p-12" style={{ background: "#fff" }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h2>
              <p className="text-sm text-gray-400 mb-6">Completá tus datos para registrarte</p>
              <form onSubmit={(e) => { e.preventDefault(); console.log("Register:", { name: regName, email: regEmail, password: regPass }); }} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">NOMBRE</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Juan Pérez" className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border outline-none focus:border-[#0EA5E9] transition-colors" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">CORREO</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="nombre@escuela.edu" className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm border outline-none focus:border-[#0EA5E9] transition-colors" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">CONTRASEÑA</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type={showRegister ? "text" : "password"} value={regPass} onChange={(e) => setRegPass(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm border outline-none focus:border-[#0EA5E9] transition-colors" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }} required />
                    <button type="button" onClick={() => setShowRegister(!showRegister)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                      {showRegister ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <label className="flex items-start gap-1.5 cursor-pointer mt-1">
                  <input type="checkbox" className="mt-0.5 rounded" style={{ accentColor: "#0EA5E9" }} required />
                  <span className="text-xs text-gray-400">
                    Acepto los{" "}
                    <a href="#" className="font-semibold" style={{ color: "#0EA5E9" }}>Términos</a>
                  </span>
                </label>
                <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #0EA5E9, #0284C7)" }}>
                  Crear Cuenta
                </button>
              </form>
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center items-center p-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #0EA5E9, #06B6D4)" }}>
                <Lock size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¿Ya tenés cuenta?</h2>
              <p className="text-sm text-white/70 text-center mb-6">Iniciá sesión para acceder a tus herramientas</p>
              <button type="button" onClick={() => setActive("register")} className="px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95" style={{ background: "linear-gradient(135deg, #0EA5E9, #06B6D4)" }}>
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to home */}
      <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/5 z-20" style={{ color: "#b3b3b3" }}>
        ← Volver
      </Link>
    </div>
  );
}
