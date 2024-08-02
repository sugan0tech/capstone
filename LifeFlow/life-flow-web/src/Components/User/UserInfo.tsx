import { useTranslation } from "react-i18next";

export const UserInfo = ({ user, onEdit }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p>{t("userInfo.email")}: {user?.email}</p>
            <p>{t("userInfo.name")}: {user?.name}</p>
            <p>{t("userInfo.role")}: {user?.role}</p>
            <button className="btn btn-secondary mt-4" onClick={onEdit}>
                {t("userInfo.editButton")}
            </button>
        </div>
    );
};
