import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../Page/HomePage/HomePage";
import Auth from "../Page/Auth/Auth";
import Especialidades from "../Page/Especialidades/Especialidades";
import Inscripcion from "../Page/Inscripcion/Inscripcion";
import Contacto from "../Page/Contacto/Contacto";
import NotFound from "../Page/NotFound/NotFound";
import QR from "../Page/QR/QR";
import MarcarAsistencia from "../Page/QR/MarcarAsistencia";
import RutaConRango from "../Components/RutaConRango/RutaConRango";
import { ROLES } from "../Firebase/roles";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import AdminLayout from "../Page/Admin/AdminLayout";
import Dashboard from "../Page/Admin/sections/Dashboard";
import Usuarios from "../Page/Admin/sections/Usuarios";
import Asistencia from "../Page/Admin/sections/Asistencia";
import Reportes from "../Page/Admin/sections/Reportes";
import Configuracion from "../Page/Admin/sections/Configuracion";
import Autorizaciones from "../Page/Admin/sections/Autorizaciones";
import Vinculaciones from "../Page/Admin/sections/Vinculaciones";

function AuthOverlay() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/registro";
  return isAuth ? <Auth /> : null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthOverlay />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/registro" element={<HomePage />} />
        <Route
          path="/especialidades"
          element={
            <div className="min-h-screen bg-[#0a0a0a]">
              <Navbar />
              <main>
                <Especialidades />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/inscripcion"
          element={
            <div className="min-h-screen bg-[#0a0a0a]">
              <Navbar />
              <main>
                <Inscripcion />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/contacto"
          element={
            <div className="min-h-screen bg-[#0a0a0a]">
              <Navbar />
              <main>
                <Contacto />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/qr"
          element={
            <div className="min-h-screen bg-[#0a0a0a]">
              <Navbar />
              <main>
                <RutaConRango roles={[ROLES.PRECEPTOR, ROLES.PROFESOR, ROLES.DIRECTIVO, ROLES.ADMIN]}>
                  <QR />
                </RutaConRango>
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/qr/marcar"
          element={
            <div className="min-h-screen bg-[#0a0a0a]">
              <Navbar />
              <main>
                <RutaConRango roles={[ROLES.ALUMNO]}>
                  <MarcarAsistencia />
                </RutaConRango>
              </main>
            </div>
          }
        />
        {/* El shell /admin es solo para el personal. Antes no lo protegia ninguna
            regla: cualquier cuenta firmada (incluido un padre) podia llegar por
            URL y ver el Dashboard, que es mock. Alumno y padre quedan fuera.
            `usuarios` y `vinculaciones` mantienen su propio guard de ADMIN. */}
        <Route
          path="/admin"
          element={
            <RutaConRango roles={[ROLES.PROFESOR, ROLES.PRECEPTOR, ROLES.DIRECTIVO, ROLES.ADMIN]}>
              <AdminLayout />
            </RutaConRango>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="usuarios"
            element={
              <RutaConRango roles={[ROLES.ADMIN]}>
                <Usuarios />
              </RutaConRango>
            }
          />
          <Route path="asistencia" element={<Asistencia />} />
          <Route path="autorizaciones" element={<Autorizaciones />} />
          <Route
            path="vinculaciones"
            element={
              <RutaConRango roles={[ROLES.ADMIN]}>
                <Vinculaciones />
              </RutaConRango>
            }
          />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
