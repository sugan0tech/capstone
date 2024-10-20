import { useTranslation } from "react-i18next";

export const OverAllStatus = () => {
  const { t } = useTranslation();

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-8 w-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">{t("stats.total_units")}</div>
        <div className="stat-value text-primary">25.6K</div>
        <div className="stat-desc">{t("stats.total_units_desc")}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-8 w-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">{t("stats.life_saved")}</div>
        <div className="stat-value text-secondary">2.6M</div>
        <div className="stat-desc">{t("stats.life_saved_desc")}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <div className="avatar online">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="#000000"
              fill="none"
            >
              <path
                d="M12 4.5V6M12 6V7.5M12 6H13.5M12 6H10.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M8.58579 2.58579C8 3.17157 8 4.11438 8 6C8 7.88562 8 8.82843 8.58579 9.41421C9.17157 10 10.1144 10 12 10C13.8856 10 14.8284 10 15.4142 9.41421C16 8.82843 16 7.88562 16 6C16 4.11438 16 3.17157 15.4142 2.58579C14.8284 2 13.8856 2 12 2C10.1144 2 9.17157 2 8.58579 2.58579Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 22V11.9707C4 8.66123 4 7.00649 5.02513 5.97836C5.67665 5.32493 6.58055 5.08679 8 5M20 22V11.9707C20 8.66123 20 7.00649 18.9749 5.97836C18.3233 5.32493 17.4194 5.08679 16 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 22H21"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.5 22V19.5C9.5 18.5654 9.5 18.0981 9.70096 17.75C9.83261 17.522 10.022 17.3326 10.25 17.201C10.5981 17 11.0654 17 12 17C12.9346 17 13.4019 17 13.75 17.201C13.978 17.3326 14.1674 17.522 14.299 17.75C14.5 18.0981 14.5 18.5654 14.5 19.5V22"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M8.00896 13H8M12 13H11.991M16.0011 13H15.9922"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="stat-value">11K</div>
        <div className="stat-title">{t("stats.blood_banks")}</div>
        <div className="stat-desc text-secondary">
          {t("stats.blood_banks_desc")}
        </div>
      </div>
    </div>
  );
};
