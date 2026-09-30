import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, User, X, IdCard } from "lucide-react";
import { useTheme } from "../../Context/useTheme";
import { iniciarSesion } from "../../services/sesion";

export default function Auth() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [active, setActive] = useState<"register" | "login">("login");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginCargando, setLoginCargando] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regRol, setRegRol] = useState<"alumno" | "padre">("alumno");
  const [regDniHijo, setRegDniHijo] = useState("");

  const close = () => navigate("/");

  const ingresar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginCargando(true);
    const sesion = await iniciarSesion(loginEmail, loginPass);
    setLoginCargando(false);
    if (!sesion) {
      setLoginError("Correo o contraseña incorrectos.");
      return;
    }
    navigate(sesion.rango === "qr" ? "/qr" : "/");
  };

  const bgImage =
    theme === "amanecer" ? "/imagen_amanecer.jfif" : "/imagen_anochecer.jfif";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[200] backdrop-blur-md"
        style={{ backgroundColor: "var(--overlay)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />

      {/* Modal */}
      <motion.div
        className="fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          width: "min(900px, 92vw)",
          height: 520,
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-primary)",
          boxShadow: "0 25px 50px -12px var(--overlay)",
        }}
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute right-4 top-4 z-[60] flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all hover:opacity-80"
          style={{ backgroundColor: "var(--overlay)", color: "var(--text-primary)" }}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Background image (según tema) — se desplaza de izquierda a derecha */}
        <motion.div
          key={bgImage}
          className="absolute top-0 left-0 h-full"
          initial={false}
          animate={{ x: active === "login" ? 0 : -900 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "1800px",
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: "cover",
            filter: "brightness(0.4) saturate(1.1)",
          }}
        />

        {/* Gradient overlay del tema */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "linear-gradient(135deg, var(--accent-dark), transparent 50%, var(--accent))" }}
        />

        {/* Divider */}
        <div
          className="absolute left-1/2 top-0 z-50 h-full w-px"
          style={{ backgroundColor: "var(--border-light)" }}
        />

        {/* VISTA LOGIN: promo registro (izq) + form login (der).
            Visible en login. Al pasar a registro sale hacia la izquierda atenuándose. */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={false}
          animate={{ x: active === "login" ? 0 : -900, opacity: active === "login" ? 1 : 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-full">
            <div className="flex h-full w-1/2 flex-col items-center justify-center p-12">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  color: "var(--accent-text)",
                }}
              >
                <User size={28} />
              </div>
              <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--text-primary)" }}>¿Sos nuevo?</h2>
              <p className="mb-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>Registrate y formá parte de la comunidad</p>
              <button
                type="button"
                onClick={() => setActive("register")}
                className="rounded-full px-8 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  color: "var(--accent-text)",
                  boxShadow: "0 4px 14px var(--accent-glow)",
                }}
              >
                Registrarse
              </button>
            </div>
            <div className="flex h-full w-1/2 flex-col justify-center overflow-y-auto p-12">
              <div className="mb-6 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    color: "var(--accent-text)",
                  }}
                >
                  S
                </div>
                <span className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Sentinel</span>
              </div>
              <h2 className="mb-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Iniciar sesión</h2>
              <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>Ingresá tus credenciales</p>
              <form onSubmit={ingresar} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>CORREO</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nombre@escuela.edu"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>CONTRASEÑA</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      type={showLogin ? "text" : "password"}
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-10 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLogin(!showLogin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {showLogin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: "var(--accent)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Recordarme</span>
                  </label>
                  <a href="#" className="text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]">¿Olvidaste tu contraseña?</a>
                </div>
                {loginError && (
                  <p className="-mb-1 text-xs font-semibold" style={{ color: "var(--error)" }}>{loginError}</p>
                )}
                <button
                  type="submit"
                  disabled={loginCargando}
                  className="w-full rounded-lg py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    color: "var(--accent-text)",
                  }}
                >
                  {loginCargando ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* VISTA REGISTRO: form registro (izq) + promo login (der).
            Espera fuera de pantalla a la derecha. Entra con un pequeño delay. */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={false}
          animate={{ x: active === "login" ? 900 : 0, opacity: active === "login" ? 0.3 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: active === "login" ? 0.08 : 0 }}
        >
          <div className="flex h-full">
            <div className="flex h-full w-1/2 flex-col justify-center overflow-y-auto p-12">
              <h2 className="mb-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Crear cuenta</h2>
              <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>Completá tus datos para registrarte</p>
              <form onSubmit={(e) => { e.preventDefault(); console.log("Register:", { name: regName, email: regEmail, rol: regRol, dniHijo: regRol === "padre" ? regDniHijo : null, password: regPass }); }} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>NOMBRE</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>CORREO</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nombre@escuela.edu"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>REGISTRARSE COMO</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRol("alumno")}
                      className="rounded-lg border py-2 text-xs font-bold transition-colors"
                      style={regRol === "alumno"
                        ? { borderColor: "var(--accent)", backgroundColor: "var(--bg-secondary)", color: "var(--accent)" }
                        : { borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      Soy Alumno
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRol("padre")}
                      className="rounded-lg border py-2 text-xs font-bold transition-colors"
                      style={regRol === "padre"
                        ? { borderColor: "var(--accent)", backgroundColor: "var(--bg-secondary)", color: "var(--accent)" }
                        : { borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      Soy Padre/Madre
                    </button>
                  </div>
                </div>

                {regRol === "padre" && (
                  <div className="animate-[fade-in_0.4s_ease-out_both]">
                    <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>DNI DEL HIJO/A</label>
                    <div className="relative">
                      <IdCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                      <input
                        type="text"
                        value={regDniHijo}
                        onChange={(e) => setRegDniHijo(e.target.value)}
                        placeholder="42.123.456"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                        style={{ color: "var(--text-primary)" }}
                        required
                      />
                    </div>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Vincularemos tu cuenta con la asistencia de tu hijo/a
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>CONTRASEÑA</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      type={showRegister ? "text" : "password"}
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-9 pr-10 text-sm outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegister(!showRegister)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {showRegister ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <label className="mt-1 flex cursor-pointer items-start gap-1.5">
                  <input type="checkbox" className="mt-0.5 rounded" style={{ accentColor: "var(--accent)" }} required />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Acepto los{" "}
                    <a href="#" className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]">Términos</a>
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full rounded-lg py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    color: "var(--accent-text)",
                  }}
                >
                  Crear Cuenta
                </button>
              </form>
            </div>
            <div className="flex h-full w-1/2 flex-col items-center justify-center p-12">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  color: "var(--accent-text)",
                }}
              >
                <Lock size={28} />
              </div>
              <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--text-primary)" }}>¿Ya tenés cuenta?</h2>
              <p className="mb-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>Iniciá sesión para acceder a tus herramientas</p>
              <button
                type="button"
                onClick={() => setActive("login")}
                className="rounded-full px-8 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  color: "var(--accent-text)",
                  boxShadow: "0 4px 14px var(--accent-glow)",
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
