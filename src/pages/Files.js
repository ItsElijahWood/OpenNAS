import { useEffect } from "react";
import HeaderComponent from "../components/global/Header";
import Loader from "../components/global/Loader";
import FileContainer from "../components/pages/Files/FileContainer";
import "../styles/css/Files.css";

function Files() {
  useEffect(() => {
    async function authUser() {
      const response = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        window.location.href = "/";
      }
    }

    authUser();
  }, []);

  return (
    <>
      <HeaderComponent />
      <Loader />
      <div className="files-centre">
        <FileContainer />
      </div>
    </>
  );
}

export default Files;
