import Navbar from "../../Components/Navbar/Navbar";
import Hero from "../../Components/Hero/Hero";
import Especialidades from "../Especialidades/Especialidades";
import Footer from "../../Components/Footer/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Especialidades />
      </main>
      <Footer />
    </div>
  );
}
