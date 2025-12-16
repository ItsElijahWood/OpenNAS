import { Cell, Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const format_value = formatBytes(value);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12">
      {`${name} ${format_value}`}
    </text>
  );
};

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** i;

  return `${value.toFixed(decimals)} ${units[i]}`;
}

function StoragePieChart() {
  const [uid, setUid] = useState(null);
  const [disk, setDisk] = useState([]);
  const [diskTotal, setDiskTotal] = useState("");
  const [nasDisk, setNasDisk] = useState("");
  const PIE_CHART_COLORS = ["#e2725b", "#00C49F"];

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

        const drive_total = data.drive.size;
        const drive_free = data.drive.available;
        const drive_used = data.drive.used;
        const drive = data.drive.drive;

        setNasDisk(drive);
        setDiskTotal(formatBytes(drive_total));
        setDisk([
          { name: "Used", value: drive_used },
          { name: "Free", value: drive_free },
        ]);
      } else {
        const data = await response.json();

        alert(data.error);
      }
    }

    getNASResources();

    intervalId = setInterval(getNASResources, 10000);
    return () => clearInterval(intervalId);
  }, [uid]);

  return (
    <div className="component-nas-storage-pie-chart">
      <p className="component-nas-storage-pie-chart-title">
        Storage <b style={{ color: "#fd7f66ff" }}>Used</b>
      </p>
      <PieChart
        style={{ userSelect: "none" }}
        className="component-nas-storage-piechart-constructor"
        width={350}
        height={250}>
        <Pie
          data={disk}
          cx="50%"
          cy="50%"
          isAnimationActive={false}
          outerRadius={80}
          dataKey="value"
          label={renderCustomizedLabel}>
          {disk.map((entry, index) => (
            <Cell key={index} fill={PIE_CHART_COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="component-nas-storage-pie-chart-div-p">
        <p className="component-nas-storage-pie-chart-p">
          Total: <b style={{ color: "#fd7f66ff" }}>{diskTotal}</b>
        </p>
        <p className="component-nas-storage-pie-chart-p">
          Disk: <b style={{ color: "#fd7f66ff" }}>{nasDisk}</b>
        </p>
      </div>
    </div>
  );
}

export default StoragePieChart;
