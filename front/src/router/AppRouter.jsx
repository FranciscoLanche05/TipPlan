import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import MainLayout from "../layouts/PlantillaPrincipal/MainLayout";
import Home from "../pages/Inicio/Home";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";

import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../constants/routes";

const MisViajes = lazy(() => import("../pages/MisViajes"));
const ConfiguracionCuenta = lazy(() => import("../pages/Configuracion/ConfiguracionCuenta"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Vuelos = lazy(() => import("../pages/Servicios/Vuelos"));
const Hoteles = lazy(() => import("../pages/Servicios/Hoteles"));
const Autos = lazy(() => import("../pages/Servicios/Autos"));
const Restaurantes = lazy(() => import("../pages/Servicios/Restaurantes"));
const Actividades = lazy(() => import("../pages/Servicios/Actividades"));
const Privacidad = lazy(() => import("../pages/Legal/Privacidad"));
const EliminacionDatos = lazy(() => import("../pages/Legal/EliminacionDatos"));
const NuevoViaje = lazy(() => import("../pages/Viajes/NuevoViaje"));
const DetalleViaje = lazy(() => import("../pages/Viajes/DetalleViaje"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
        <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="registro" element={<Registro />} />
          <Route path={ROUTES.PRIVACIDAD} element={<Privacidad />} />
          <Route path={ROUTES.ELIMINACION_DATOS} element={<EliminacionDatos />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD.replace("/", "")} element={<Dashboard />} />
            <Route path={ROUTES.MIS_VIAJES.replace("/", "")} element={<MisViajes />} />
            <Route path={ROUTES.VUELOS.replace("/", "")} element={<Vuelos />} />
            <Route path={ROUTES.HOTELES.replace("/", "")} element={<Hoteles />} />
            <Route path={ROUTES.AUTOS.replace("/", "")} element={<Autos />} />
            <Route path={ROUTES.RESTAURANTES.replace("/", "")} element={<Restaurantes />} />
            <Route path={ROUTES.ACTIVIDADES.replace("/", "")} element={<Actividades />} />
            <Route path={ROUTES.NUEVO_VIAJE.replace("/", "")} element={<NuevoViaje />} />
            <Route path={ROUTES.DETALLE_VIAJE.replace("/", "")} element={<DetalleViaje />} />
            <Route path={`${ROUTES.CONFIGURACION.replace("/", "")}/*`} element={<ConfiguracionCuenta />} />
          </Route>
        </Route>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
