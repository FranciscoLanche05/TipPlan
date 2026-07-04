import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/PlantillaPrincipal/MainLayout";
import Home from "../pages/Inicio/Home";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import MisViajes from "../pages/MisViajes";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../constants/routes";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.MIS_VIAJES.replace("/", "")} element={<MisViajes />} />
        </Route>
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
