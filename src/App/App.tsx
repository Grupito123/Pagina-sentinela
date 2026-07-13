import { useEffect, useState } from "react";
import AppRoutes from "../Routes/app.routes";
import LoadingScreen from "../Components/LoadingScreen/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <AppRoutes />
    </>
  );
}

export default App;
