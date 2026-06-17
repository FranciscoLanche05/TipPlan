import { Budget } from '../../components/sections/Budget';
import { FAQ } from '../../components/sections/FAQ';

export default function Home() {
  return (
    <main>
      <Budget />
      <FAQ />
    </main>
  );
}
import Header from "../../components/common/Header/Header";
import About from "../../components/sections/About/About";
import Body from "../../components/common/Body/Body";
import Destinations from "../../components/sections/Destinations/Destinations";

const Home = () => {
  return (
    <>
      <Header />
      <About />
      <Body />
      <Destinations />
    </>
  );
};

export default Home;
