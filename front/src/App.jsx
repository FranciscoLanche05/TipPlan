import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from "./router/AppRouter";
import LoginModal from "./components/common/LoginModal/LoginModal";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <AppRouter />
      <LoginModal />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;