"use client";

import { useLanguage } from "@/lib/language-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface SubScore {
  label: string;
  score: number;
}

interface SubScoreBarChartProps {
  scores: SubScore[];
  title?: string;
  height?: number;
}

const BAR_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#16a34a"];

function bandColor(score: number): string {
  if (score >= 7) return "#16a34a";
  if (score >= 6) return "#2563eb";
  if (score >= 5) return "#d97706";
  return "#dc2626";
}

export default function SubScoreBarChart({
  scores,
  title,
  height = 220,
}: SubScoreBarChartProps) {
  const { t } = useLanguage();

  if (scores.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-50 p-8 text-sm text-gray-400" style={{ height }}>
        {t("dashboard_no_subscore_data")}
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={scores} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 9]}
            ticks={[0, 3, 5, 6, 7, 8, 9]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(value) => [Number(value).toFixed(1), t("dashboard_band")]}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {scores.map((entry, index) => (
              <Cell key={index} fill={bandColor(entry.score)} />
            ))}
            <LabelList dataKey="score" position="top" fontSize={12} fontWeight={600} fill="#374151" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
