import { useEffect, useState } from "react";
import { VictoryPie, VictoryTheme } from "victory";

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** i;

  return `${value.toFixed(decimals)} ${units[i]}`;
}

function MemoryUsage() {
  const [uid, setUid] = useState(null);
  const [ramTotal, setRamTotal] = useState(0);
  const [ramUsed, setRamUsed] = useState(0);
  const [ramFree, setRamFree] = useState(0);

  const dataMem = [
    { x: " ", y: ramUsed },
    { x: " ", y: ramFree },
  ];

  useEffect(() => {
    async function authUser() {
      const response = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        window.location.href = "/";
      } else {
        const data = await response.json();

        setUid(data.uid);
      }
    }

    authUser();
  }, []);

  useEffect(() => {
    if (!uid && uid !== 0) return;
    let intervalId;

    async function getNASResources() {
      const response = await fetch(`/dashboard/get-resources?u=${encodeURIComponent(uid)}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setRamTotal(data.ram.total);
        setRamUsed(data.ram.used);
        setRamFree(data.ram.free);
      }
    }

    getNASResources();

    intervalId = setInterval(getNASResources, 10000);
    return () => clearInterval(intervalId);
  }, [uid]);

  return (
    <div className="component-nas-memory-pie-chart-outer">
      <p className="component-nas-memory-pie-chart-title">
        Memory <b style={{ color: "#fd7f66ff" }}>Usage</b>
      </p>
      <div className="component-nas-memory-pie-chart">
        <div className="component-nas-memory-pie-chart-info">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{ display: "flex", flexDirection: "column" }}
              className="component-nas-memory-pie-chart-info-p">
              <b style={{ fontSize: "22px", color: "rgb(253, 127, 102)" }}>
                {formatBytes(ramTotal)}
              </b>
              Total Memory
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <p className="component-nas-memory-pie-chart-info-p">
                <span className="component-nas-memory-pie-chart-dot used"></span>
                Used {formatBytes(ramUsed)}
              </p>
              <p className="component-nas-memory-pie-chart-info-p">
                <span className="component-nas-memory-pie-chart-dot free"></span>
                Free {formatBytes(ramFree)}
              </p>
            </div>
          </div>
        </div>
        <VictoryPie
          data={dataMem}
          theme={VictoryTheme.clean}
          innerRadius={240}
          width={500}
          height={500}
          colorScale={["#027a64ff", "#00c49f"]}
        />
      </div>
    </div>
  );
}

export default MemoryUsage;
