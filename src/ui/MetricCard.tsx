// Secondary metric card for the 2x2 grid: soft-colored icon glyph in a
// rounded, low-opacity background, paired with a label and bold value.
import type { ReactElement, ReactNode } from "react";

export type MetricAccent = "blue" | "azure" | "mint" | "slate";

export interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: MetricAccent;
}

export function MetricCard({ icon, label, value, accent = "blue" }: MetricCardProps): ReactElement {
  return (
    <div className="aiwe-metric-card">
      <div className={`aiwe-metric-icon aiwe-metric-icon-${accent}`}>{icon}</div>
      <div className="aiwe-metric-text">
        <div className="aiwe-metric-label">{label}</div>
        <div className="aiwe-metric-value">{value}</div>
      </div>
    </div>
  );
}
