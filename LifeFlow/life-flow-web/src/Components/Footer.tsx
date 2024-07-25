import LifeFlowLogo from "../assets/LifeFlowLogo";
import FollowUs from "./FollowUs";

function Footer() {
  return (
    <footer className="footer bg-secondary text-neutral-content items-center p-4 fixed bottom-0">
      <aside className="grid-flow-col items-center">
        <LifeFlowLogo h={36} w={36} />
        <p className="text-black">
          LifeFlow Blood Bank Service Ltd. <br />
          Helping Humanity since 2024
        </p>
      </aside>
      <FollowUs />
    </footer>
  );
}

export default Footer;
