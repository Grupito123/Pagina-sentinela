import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../Page/HomePage/HomePage";
import Auth from "../Page/Auth/Auth";
import Especialidades from "../Page/Especialidades/Especialidades";
import Inscripcion from "../Page/Inscripcion/Inscripcion";
import Contacto from "../Page/Contacto/Contacto";
import NotFound from "../Page/NotFound/NotFound";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import AdminLayout from "../Page/Admin/AdminLayout";
import Dashboard from "../Page/Admin/sections/Dashboard";
import Usuarios from "../Page/Admin/sections/Usuarios";
import Asistencia from "../Page/Admin/sections/Asistencia";
import Reportes from "../Page/Admin/sections/Reportes";
import Configuracion from "../Page/Admin/sections/Configuracion";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/registro" element={<Auth />} />
        <Route
          path="/especialidades"
          element={
            <div className="min-h-screen bg-white">
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
            <div className="min-h-screen bg-white">
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
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>
                <Contacto />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="asistencia" element={<Asistencia />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
