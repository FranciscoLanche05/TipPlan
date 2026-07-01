import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/PlantillaPrincipal/MainLayout";
import Home from "../pages/Inicio/Home";
import Registro from "../pages/Registro/Registro";

const AppRouter = () => {
  return (
    <Routes>
        <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="registro" element={<Registro />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
