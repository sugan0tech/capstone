import { Hero } from "../Components/Hero";
import { OverAllStatus } from "../Components/OverAllStatus";

function Home() {
  return (
    <div className="flex flex-col">
      <OverAllStatus></OverAllStatus>
      <Hero></Hero>
    </div>
  );
}

export default Home;
