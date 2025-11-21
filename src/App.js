import { useEffect } from "react";
import LoginComponent from "./components/pages/App/LoginComponent";
import "./styles/css/App.css";

function App() {
  useEffect(() => {
    async function authUser() {
      const response = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/nas";
      }
    }

    authUser();
  }, []);

  return (
    <>
      <div className="app-container">
        <div className="app-container-quote">
          <p
            className="app-container-quote-p"
            style={{ color: "#ffffff", userSelect: "none", fontSize: "25px" }}>
            Your PC. Your storage. Your NAS.
          </p>
        </div>
        <LoginComponent />
      </div>
    </>
  );
}

export default App;
