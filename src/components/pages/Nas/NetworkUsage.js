import { useEffect, useState, useRef } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis,
} from "victory";

function NetworkUsage() {
  const [dataNetwork, setDataNetwork] = useState([]);
  const tickRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dashboard/get-system-information");
        if (!response.ok) return;

        const data = await response.json();

        const inbound = parseFloat(
          data.network.inbound_bytes_per_sec.toFixed(2)
        );
        const outbound = parseFloat(
          data.network.outbound_bytes_per_sec.toFixed(2)
        );

        tickRef.current += 1;
        setDataNetwork((prev) => {
          const newData = [...prev, { x: tickRef.current, inbound, outbound }];
          return newData.slice(-20);
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="component-nas-network-line-chart">
      <p className="component-nas-network-line-chart-title">
        Network <b style={{ color: "#fd7f66ff" }}>Load</b>
      </p>
      <div className="component-nas-network-line-chart-inner">
        <VictoryChart theme={VictoryTheme.clean} animate={{ duration: 2000 }}>
          <VictoryLegend
            x={100}
            y={10}
            orientation="horizontal"
            gutter={20}
            style={{
              labels: { fontSize: 12, fill: "#ffffff", fontWeight: "bold" },
              border: { stroke: "none" },
            }}
            data={[
              { name: "Inbound (kbps)", symbol: { fill: "#00b4d8" } },
              { name: "Outbound (kbps)", symbol: { fill: "#fd7f66" } },
            ]}
          />
          <VictoryAxis
            style={{
              axis: { stroke: "#888" },
              tickLabels: { fill: "#ffffff", fontSize: 10 },
              grid: { stroke: "none" },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: "#888" },
              tickLabels: { fill: "#ffffff", fontSize: 10 },
              grid: { stroke: "#444", strokeDasharray: "4,4" },
            }}
          />
          <VictoryLine
            data={dataNetwork.map((d) => ({ x: d.x, y: d.inbound }))}
            interpolation="natural"
            style={{ data: { stroke: "#00b4d8", strokeWidth: 2 } }}
          />
          <VictoryLine
            data={dataNetwork.map((d) => ({ x: d.x, y: d.outbound }))}
            interpolation="natural"
            style={{ data: { stroke: "#fd7f66", strokeWidth: 2 } }}
          />
        </VictoryChart>
      </div>
    </div>
  );
}

export default NetworkUsage;
