import type { ReactElement } from "react";
import { formatWaterML } from "../../shared/utils/format";
import { getProviderLabel } from "../../shared/constants/providers";
import type { HistoryEntry } from "../../shared/types";

export interface HistoryListProps {
  entries: HistoryEntry[];
}

const MAX_VISIBLE = 10;

export function HistoryList({ entries }: HistoryListProps): ReactElement {
  const recent = entries.slice(-MAX_VISIBLE).reverse();

  if (recent.length === 0) {
    return <p style={{ color: "var(--aiwe-muted)", fontSize: 13 }}>No prompts recorded yet.</p>;
  }

  return (
    <ul className="aiwe-history-list">
      {recent.map((entry, index) => (
        <li key={`${entry.date}-${index}`}>
          <span>
            AI: {getProviderLabel(entry.provider)} · {entry.date}
          </span>
          <span>{formatWaterML(entry.water)}</span>
        </li>
      ))}
    </ul>
  );
}
