import { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";

function CPUUsage() {
  const [cpu, setCPU] = useState([]);
  const [cpuSpeed, setCPUSpeed] = useState("");
  const [cpuCores, setCPUCores] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    let intervalId;

    async function getNASResources() {
      const response = await fetch("/dashboard/get-resources", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        const cpu_percentage = Math.min(Math.max(data.cpu.usage, 0), 100) / 100;
        const speed = data.cpu.speed;
        const cores = data.cpu.cores;
        const brand = data.cpu.brand.split("w/") || data.cpu.brand;

        setCPU(cpu_percentage);
        setCPUSpeed(speed);
        setCPUCores(cores);
        setBrand(brand[0] || brand);
      }
    }

    getNASResources();

    intervalId = setInterval(getNASResources, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="component-nas-cpu-gauge-chart">
      <p className="component-nas-cpu-gauge-chart-title">
        CPU <b style={{ color: "#fd7f66ff" }}>Usage</b>
      </p>
      <div>
        <p className="component-nas-cpu-gauge-chart-p">{brand}</p>
        <GaugeChart
          id="gauge-chart2"
          style={{ userSelect: "none" }}
          nrOfLevels={20}
          percent={cpu}
        />
      </div>
      <div className="component-nas-cpu-gauge-chart-info">
        <p className="component-nas-cpu-gauge-chart-p">
          Speed: <b style={{ color: "#fd7f66ff" }}>{cpuSpeed} GHz</b>
        </p>
        <p className="component-nas-cpu-gauge-chart-p">
          Cores: <b style={{ color: "#fd7f66ff" }}>{cpuCores}</b>
        </p>
      </div>
    </div>
  );
}

export default CPUUsage;
