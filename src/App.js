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
      <LoginComponent />
    </>
  );
}

export default App;
