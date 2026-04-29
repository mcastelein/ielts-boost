export type ChartType = "line" | "bar" | "pie" | "table" | "process" | "map";

export interface ChartData {
  type: ChartType;
  title?: string;
  categories?: string[];
  series?: { name: string; data: number[] }[];
  xLabel?: string;
  yLabel?: string;
  pieData?: { label: string; slices: { name: string; value: number }[] }[];
  headers?: string[];
  rows?: (string | number)[][];
  description?: string;
}

export interface WritingPrompt {
  taskType: "task1" | "task2";
  topic: string;
  prompt: string;
  chart?: ChartData;
}
