import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();

  return (
      <div className="hero bg-base-200 h-fit">
        <div className="hero-content flex-col lg:flex-row">
          <img
              src="https://christcenteredmall.com/stores/art/hopkins/images/zooms/helping-hand-large-image-zoom.jpg"
              className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">
              {t("hero.title")}
            </h1>
            <p className="py-6">
              {t("hero.description")}
            </p>
            <Link className="btn btn-primary" to="/register">
              {t("hero.get_started")}
            </Link>
          </div>
        </div>
      </div>
  );
};
