import { useState } from "react";
import { useTranslation } from "react-i18next";

export const EditUserInfo = ({ user, onSave, onCancel }) => {
    const [formState, setFormState] = useState(user);
    const { t } = useTranslation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-control">
                <label className="label">{t("editUserInfo.email")}</label>
                <input
                    type="email"
                    name="email"
                    className="input input-bordered"
                    value={formState?.email}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control">
                <label className="label">{t("editUserInfo.name")}</label>
                <input
                    type="text"
                    name="name"
                    className="input input-bordered"
                    value={formState?.name}
                    onChange={handleChange}
                />
            </div>
            <div className="flex justify-between mt-4">
                <button type="submit" className="btn btn-secondary">
                    {t("editUserInfo.saveButton")}
                </button>
                <button type="button" className="btn btn-error" onClick={onCancel}>
                    {t("editUserInfo.cancelButton")}
                </button>
            </div>
        </form>
    );
};
