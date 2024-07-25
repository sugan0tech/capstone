import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthHook from "../hooks/useAuthHook";
import { useAlert } from "../contexts/AlertContext";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
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
