import { useEffect } from "react";
import StoragePieChart from "../components/pages/Nas/StoragePieChart";
import '../styles/css/Nas.css';
import HeaderComponent from "../components/global/Header";

function Nas() {
  useEffect(() => {
    async function authUser() {
      const response = await fetch('/auth/me', {
        method: "GET",
        credentials: "include"
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
      <div className="nas-div">
        <StoragePieChart />
      </div>
    </>
  )
}

export default Nas;
