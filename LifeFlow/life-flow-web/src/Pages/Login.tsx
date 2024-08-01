import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAlert } from "../contexts/AlertContext";
import EmailLogo from "../assets/EmailLogo";
import PasswordSvg from "../assets/PasswordSvg";
import { useAuth } from "../contexts/AuthContext.tsx";

function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySigned, setStaySigned] = useState(false);
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password, staySigned);
      addAlert({ message: t("login.login_success"), type: "success" });
      navigate("/home");
    } catch (error) {
      const msg =
          error.status === 404 ? t("login.user_not_found") : error.message;
      addAlert({
        message: msg,
        type: "error",
      });
    }
  };

  return (
      <>
        <div className="card items-center gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <EmailLogo />
            <input
                type="text"
                className="grow"
                placeholder={t("login.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <PasswordSvg />
            <input
                type="password"
                className="grow"
                placeholder={t("login.password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="form-control gap-2">
            <label className="cursor-pointer label">
              <span className="label-text pr-2">{t("login.remember_me_label")}</span>
              <input
                  type="checkbox"
                  checked={staySigned}
                  onChange={(e) => setStaySigned(e.target.checked)}
                  className="checkbox checkbox-error"
              />
            </label>
            <button
                className="btn btn-accent"
                type="submit"
                onClick={handleSubmit}
            >
              {t("login.login_button")}
            </button>
          </div>
        </div>
      </>
  );
}

export default Login;
