 import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

function renderChart(chart) {
  switch (chart.type) {
    case "bar": {
      // Coerce values to numbers in case they arrive as strings/undefined
      const barData = chart.data.map((d) => ({
        ...d,
        value: Number(d.value) || 0,
      }));
      return (
        <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} minPointSize={2}>
            {barData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    case "line":
      return (
        <LineChart data={chart.data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
          />
        </LineChart>
      );

    case "pie":
      return (
        <PieChart>
          <Tooltip />
          <Pie
            data={chart.data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chart.data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );

    default:
      return null;
  }
}

function RechartSetup({ charts }) {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="space-y-8">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-4 bg-white"
        >
          <h4 className="font-semibold text-gray-800 mb-3">
            📊 {chart.title}
          </h4>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(chart)}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RechartSetup;