import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AppRouter from "./router/AppRouter";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return <AppRouter />;
}

export default App;
