import type { ReactElement } from "react";
import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import type { HistoryEntry } from "../../shared/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Legend);

export interface UsageChartProps {
  entries: HistoryEntry[];
}

// Groups history entries by date and sums water (mL) per day for the trend line.
function groupByDate(entries: HistoryEntry[]): { labels: string[]; totals: number[] } {
  const totalsByDate = new Map<string, number>();
  for (const entry of entries) {
    totalsByDate.set(entry.date, (totalsByDate.get(entry.date) ?? 0) + entry.water);
  }
  const labels = Array.from(totalsByDate.keys()).sort();
  const totals = labels.map((date) => totalsByDate.get(date) ?? 0);
  return { labels, totals };
}

const CHART_MAX_SCALE = 150;

export function UsageChart({ entries }: UsageChartProps): ReactElement {
  const { labels, totals } = useMemo(() => groupByDate(entries), [entries]);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Water (mL)",
        data: totals,
        borderColor: "#0ea5e9",
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(14, 165, 233, 0.18)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(56, 189, 248, 0.35)");
          gradient.addColorStop(1, "rgba(224, 242, 254, 0.02)");
          return gradient;
        },
        pointBackgroundColor: "#0ea5e9",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.45,
        fill: true,
        borderWidth: 2.5,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: CHART_MAX_SCALE,
            grid: { color: "#eef2f6" },
            ticks: { color: "#64748b", font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 11 } },
          },
        },
      }}
    />
  );
}
