import { useEffect } from "react";
import StoragePieChart from "../components/pages/Nas/StoragePieChart";
import "../styles/css/Nas.css";
import HeaderComponent from "../components/global/Header";
import CPUUsage from "../components/pages/Nas/CPUUsage";
import SystemInformation from "../components/pages/Nas/SystemInformation";
import Loader from "../components/global/Loader";

function Nas() {
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
      <div className="nas-div">
        <SystemInformation />
        <CPUUsage />
        <StoragePieChart />
      </div>
    </>
  );
}

export default Nas;
