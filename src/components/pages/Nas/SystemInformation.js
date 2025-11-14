import { useEffect, useState } from "react";
import opennas_logo from "../../../styles/imgs/OpenNAS.png";

function SystemInformation() {
  const [hostname, setHostName] = useState("");
  const [platform, setPlatform] = useState("");
  const [arch, setArch] = useState("");
  const [uptime, setUptime] = useState("");

  useEffect(() => {
    let intervalId;

    async function getSystemInformation() {
      const response = await fetch("/dashboard/get-system-information", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        const hostname = data.hostname;
        const platform = data.platform;
        const arch = data.arch;
        const uptimeSeconds = data.uptime;

        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const uptime = `${hours}h ${minutes}m ${seconds}s`;

        setHostName(hostname);
        setPlatform(platform);
        setArch(arch);
        setUptime(uptime);
      }
    }

    getSystemInformation();

    intervalId = setInterval(getSystemInformation, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="component-nas-system-info">
      <div className="component-nas-system-info-container">
        <div className="component-nas-system-info-container-adv">
          <div className="component-nas-system-info-container-adv-inner">
            <p
              style={{
                color: "#ffffff",
                fontSize: "23px",
                userSelect: "none",
              }}>
              Open<b style={{ color: "#e2725b", fontSize: "23px" }}>NAS</b>
            </p>
            <img
              src={opennas_logo}
              style={{ userSelect: "none" }}
              width={110}
              height={150}
              alt="OpenNAS Logo"></img>
          </div>
        </div>
        <div className="component-nas-system-info-container-sysinfo">
          <p className="component-nas-system-info-title">
            System
            <b style={{ color: "#e2725b", fontSize: "23px" }}>Information</b>
          </p>
          <div className="component-nas-system-info-container-sysinfo-inner">
            <p className="component-nas-system-info-p">
              <b style={{ color: "#fd7f66ff" }}>Hostname:</b> {hostname}
            </p>
            <p className="component-nas-system-info-p">
              <b style={{ color: "#fd7f66ff" }}>Platform:</b> {platform}
            </p>
            <p className="component-nas-system-info-p">
              <b style={{ color: "#fd7f66ff" }}>Architecture:</b> {arch}
            </p>
            <p className="component-nas-system-info-p">
              <b style={{ color: "#fd7f66ff" }}>Uptime:</b> {uptime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemInformation;
