"use client";

import { useLanguage } from "@/lib/language-context";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  score: number;
}

interface ScoreTrendChartProps {
  data: DataPoint[];
  color?: string;
  title?: string;
  height?: number;
}

export default function ScoreTrendChart({
  data,
  color = "#2563eb",
  title,
  height = 250,
}: ScoreTrendChartProps) {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-50 p-8 text-sm text-gray-400" style={{ height }}>
        {t("dashboard_no_score_data")}
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 9]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(value) => [Number(value).toFixed(1), t("dashboard_band")]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
