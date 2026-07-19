import React from 'react';
import Header from "../../components/common/Encabezado/Header";
import About from "../../components/sections/SobreNosotros/About";
import Destinations from "../../components/sections/Destinos/Destinations";
import Experiences from "../../components/sections/Experiencias/Experiences";
import InteractiveMap from "../../components/sections/MapaInteractivo/InteractiveMap";
import { FAQ } from '../../components/sections/PreguntasFrecuentes';
import Blog from "../../components/sections/Blog/Blog";

const Home = () => {
  return (
    <>
      <Header />
      <About />
      <Destinations />
      <Experiences />
      <InteractiveMap />
      <FAQ />
      <Blog />
    </>
  );
};

export default Home;
