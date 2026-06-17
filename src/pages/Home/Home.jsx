import Header from "../../components/common/Header/Header";
import Body from "../../components/common/Body/Body";
import About from "../../components/sections/About/About";
import Destinations from "../../components/sections/Destinations/Destinations";
import Planner from "../../components/sections/Planner/Planner";
import { FAQ } from "../../components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <Body />
      <About />
      <Destinations />
      <Planner />
      <FAQ />
    </>
  );
}