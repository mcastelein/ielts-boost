"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartData } from "@/lib/writing-prompts";

const COLORS = [
  "#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed",
  "#0891b2", "#be185d", "#65a30d",
];

const PIE_COLORS = [
  "#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed",
  "#0891b2", "#be185d", "#65a30d",
];

export default function TaskChart({ chart }: { chart: ChartData }) {
  if (chart.type === "line" && chart.categories && chart.series) {
    return <LineChartView chart={chart} />;
  }
  if (chart.type === "bar" && chart.categories && chart.series) {
    return <BarChartView chart={chart} />;
  }
  if (chart.type === "pie" && chart.pieData) {
    return <PieChartView chart={chart} />;
  }
  if (chart.type === "table" && chart.headers && chart.rows) {
    return <TableView chart={chart} />;
  }
  if ((chart.type === "process" || chart.type === "map") && chart.description) {
    return <DescriptionView chart={chart} />;
  }
  return null;
}

function ChartWrapper({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      {title && (
        <h3 className="mb-3 text-center text-sm font-semibold text-gray-800">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function LineChartView({ chart }: { chart: ChartData }) {
  const data = chart.categories!.map((cat, i) => {
    const point: Record<string, string | number> = { name: cat };
    chart.series!.forEach((s) => {
      point[s.name] = s.data[i];
    });
    return point;
  });

  return (
    <ChartWrapper title={chart.title}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            label={
              chart.xLabel
                ? { value: chart.xLabel, position: "insideBottom", offset: -15, fontSize: 12 }
                : undefined
            }
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={
              chart.yLabel
                ? { value: chart.yLabel, angle: -90, position: "insideLeft", offset: 10, fontSize: 12, style: { textAnchor: "middle" } }
                : undefined
            }
          />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
          {chart.series!.map((s, i) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

function BarChartView({ chart }: { chart: ChartData }) {
  const data = chart.categories!.map((cat, i) => {
    const point: Record<string, string | number> = { name: cat };
    chart.series!.forEach((s) => {
      point[s.name] = s.data[i];
    });
    return point;
  });

  return (
    <ChartWrapper title={chart.title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={chart.categories!.length > 5 ? -30 : 0}
            textAnchor={chart.categories!.length > 5 ? "end" : "middle"}
            label={
              chart.xLabel
                ? { value: chart.xLabel, position: "insideBottom", offset: -15, fontSize: 12 }
                : undefined
            }
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={
              chart.yLabel
                ? { value: chart.yLabel, angle: -90, position: "insideLeft", offset: 10, fontSize: 12, style: { textAnchor: "middle" } }
                : undefined
            }
          />
          <Tooltip />
          {chart.series!.length > 1 && (
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
          )}
          {chart.series!.map((s, i) => (
            <Bar key={s.name} dataKey={s.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

function PieChartView({ chart }: { chart: ChartData }) {
  return (
    <ChartWrapper title={chart.title}>
      <div
        className={`grid gap-4 ${
          chart.pieData!.length > 1 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {chart.pieData!.map((pie) => (
          <div key={pie.label}>
            <p className="mb-2 text-center text-xs font-semibold text-gray-600">
              {pie.label}
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pie.slices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={{ strokeWidth: 1 }}
                  fontSize={11}
                >
                  {pie.slices.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </ChartWrapper>
  );
}

function TableView({ chart }: { chart: ChartData }) {
  return (
    <ChartWrapper title={chart.title}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              {chart.headers!.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows!.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartWrapper>
  );
}

function DescriptionView({ chart }: { chart: ChartData }) {
  const sections = chart.description!.split("\n\n");

  return (
    <ChartWrapper title={chart.title}>
      <div className="space-y-4">
        {sections.map((section, i) => {
          const lines = section.split("\n");
          const heading = lines[0];
          const steps = lines.slice(1);

          if (chart.type === "process") {
            // Process: render as flow
            const allSteps = section.split("\n");
            return (
              <div key={i} className="space-y-2">
                {allSteps.map((step, j) => {
                  const match = step.match(/^(\d+)\.\s+(.+?)(?:\s*—\s*(.+))?$/);
                  if (!match) return null;
                  const [, num, title, desc] = match;
                  return (
                    <div key={j} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {num}
                      </div>
                      <div className="pt-0.5">
                        <span className="text-sm font-semibold text-gray-800">
                          {title}
                        </span>
                        {desc && (
                          <p className="text-xs text-gray-600">{desc}</p>
                        )}
                      </div>
                      {j < allSteps.length - 1 && (
                        <div className="absolute ml-3.5 mt-7 h-4 w-px bg-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          // Map: render as sections
          return (
            <div key={i}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {heading}
              </p>
              {steps.length > 0 && (
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {steps.join(" ")}
                </p>
              )}
              {steps.length === 0 && (
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {heading}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </ChartWrapper>
  );
}
