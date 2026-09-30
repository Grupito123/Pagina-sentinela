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
                <RutaConRango rango="qr">
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
                <MarcarAsistencia />
              </main>
            </div>
          }
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="asistencia" element={<Asistencia />} />
          <Route path="autorizaciones" element={<Autorizaciones />} />
          <Route path="vinculaciones" element={<Vinculaciones />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
