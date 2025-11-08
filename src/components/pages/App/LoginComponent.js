import { useState } from "react";
import ButtonComponent from "../../global/Button";
import EyeIcon from "../../svgs/EyeIcon";
import CrossedEyeIcon from "../../svgs/CrossedEyeIcon";

function LoginComponent() {
  const [icon, setIcon] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  function toggleDisplayPassword() {
    setIcon((prev) => !prev);
  }

  async function login(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) return;

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      const data = await response.json();

      setErrMsg(data.error);
    }
  }

  return (
    <form className="component-app-form">
      <p className="component-app-form-title">
        Login to <b className="component-app-form-title-NASS">OpenNAS</b>
      </p>
      <div className="component-app-form-div-username">
        <input
          className="component-app-form-username"
          id="username"
          type="text"
          placeholder="Username"
        />
      </div>
      <div className="component-app-form-div-password">
        {icon ? (
          <CrossedEyeIcon onClick={toggleDisplayPassword} isInput={true} />
        ) : (
          <EyeIcon onClick={toggleDisplayPassword} isInput={true} />
        )}
        <input
          className="component-app-form-password"
          id="password"
          type={icon ? "text" : "password"}
          placeholder="Password"
        />
      </div>
      <ButtonComponent onClick={(e) => login(e)} buttonName="Login" />
      <p style={{ color: "#ffffff", fontSize: "17px", userSelect: "none" }}>
        {errMsg}
      </p>
    </form>
  );
}

export default LoginComponent;
