import LifeFlowLogo from "../assets/LifeFlowLogo";
import FollowUs from "./FollowUs";
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer bg-secondary text-neutral-content items-center p-4 fixed bottom-0">
            <aside className="grid-flow-col items-center">
                <LifeFlowLogo h={36} w={36} />
                <p className="text-black">
                    {t("footer.companyName")} <br />
                    {t("footer.tagline")}
                </p>
            </aside>
            <FollowUs />
        </footer>
    );
}

export default Footer;
