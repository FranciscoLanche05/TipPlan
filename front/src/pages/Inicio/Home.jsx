import React, { lazy, Suspense } from 'react';
import Header from "../../components/common/Encabezado/Header";
import About from "../../components/sections/SobreNosotros/About";
import Destinations from "../../components/sections/Destinos/Destinations";
import Experiences from "../../components/sections/Experiencias/Experiences";
import { FAQ } from '../../components/sections/PreguntasFrecuentes';
import Blog from "../../components/sections/Blog/Blog";


const Home = () => {
  return (
    <>
      <Header />
      <About />
      <Destinations />
      <Experiences />

      <FAQ />
      <Blog />
    </>
  );
};

export default Home;
