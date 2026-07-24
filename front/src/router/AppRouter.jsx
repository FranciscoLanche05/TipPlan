import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/PlantillaPrincipal/MainLayout";
import Home from "../pages/Inicio/Home";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import MisViajes from "../pages/MisViajes";
import Reservas from "../pages/Reservas/Reservas";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../constants/routes";
import ConfiguracionCuenta from "../pages/Configuracion/ConfiguracionCuenta";
import ExperienciasCategoria from "../pages/Experiencias/ExperienciasCategoria";
import Planificador from "../pages/Planificador/Planificador";
import Dashboard from "../pages/Dashboard/Dashboard";
import Vuelos from "../pages/Servicios/Vuelos";
import Hoteles from "../pages/Servicios/Hoteles";
import Autos from "../pages/Servicios/Autos";
import Restaurantes from "../pages/Servicios/Restaurantes";
import Actividades from "../pages/Servicios/Actividades";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="registro" element={<Registro />} />
        <Route path="experiencias/:categoria" element={<ExperienciasCategoria />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD.replace("/", "")} element={<Dashboard />} />
          <Route path={ROUTES.MIS_VIAJES.replace("/", "")} element={<MisViajes />} />
          <Route path={ROUTES.RESERVAS.replace("/", "")} element={<Reservas />} />
          <Route path={ROUTES.PLANIFICADOR.replace("/", "")} element={<Planificador />} />
          <Route path={ROUTES.VUELOS.replace("/", "")} element={<Vuelos />} />
          <Route path={ROUTES.HOTELES.replace("/", "")} element={<Hoteles />} />
          <Route path={ROUTES.AUTOS.replace("/", "")} element={<Autos />} />
          <Route path={ROUTES.RESTAURANTES.replace("/", "")} element={<Restaurantes />} />
          <Route path={ROUTES.ACTIVIDADES.replace("/", "")} element={<Actividades />} />
          <Route path={`${ROUTES.CONFIGURACION.replace("/", "")}/*`} element={<ConfiguracionCuenta />} />
        </Route>
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
