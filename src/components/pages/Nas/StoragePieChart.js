import { Cell, Pie, PieChart } from "recharts";

const data = [
  { name: "Used", value: 350 },
  { name: "Free", value: 400 }
]
const COLORS = ['#e2725b', '#00C49F'];

const renderCustomizedLabel = ({
  cx, cy, midAngle, outerRadius, name, value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
    >
      {`${name} ${value}GB`}
    </text>
  );
};

function StoragePieChart() {
  return (
    <div className="component-nas-storage-pie-chart">
      <p className="component-nas-storage-pie-chart-title">Storage <b style={{ color: "#fd7f66ff" }}>Used</b></p>
      <PieChart style={{ userSelect: "none" }} width={300} height={250}>
        <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        dataKey="value"
        label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}

export default StoragePieChart;
