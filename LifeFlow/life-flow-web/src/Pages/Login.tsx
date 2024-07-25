import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthHook from "../hooks/useAuthHook";
import { useAlert } from "../contexts/AlertContext";
import EmailLogo from "../assets/EmailLogo";
import PasswordSvg from "../assets/PasswordSvg";

function Login() {
  const { login } = useAuthHook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySigned, setStaySigned] = useState(false);
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password, staySigned);
      addAlert({ message: "Login successful!", type: "success" });
      navigate("/home");
    } catch (error) {
      addAlert({
        message: "Login failed. Please try again." + error,
        type: "warning",
      });
      console.log(error);
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <PasswordSvg />
          <input
            type="password"
            className="grow"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="form-control gap-2">
          <label className="cursor-pointer label">
            <span className="label-text pr-2">Remember me</span>
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
            Login
          </button>
        </div>
      </div>
    </>
  );
}
export default Login;
