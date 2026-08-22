import { useEffect, useState } from "react";
import AppRoutes from "../Routes/app.routes";
import LoadingScreen from "../Components/LoadingScreen/LoadingScreen";
import SmoothScroll from "../Components/Immersive/SmoothScroll";
import CursorFollower from "../Components/Microinteractions/CursorFollower";
import { ThemeProvider } from "../Context/ThemeProvider";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <SmoothScroll>
        {loading && <LoadingScreen />}
        <CursorFollower />
        <AppRoutes />
      </SmoothScroll>
    </ThemeProvider>
  );
}

export default App;
