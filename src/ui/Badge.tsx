// React Badge component. Used in popup/options previews and any future
// React-rendered surfaces. The live in-page badge (content script) uses plain
// DOM for performance — see content/renderer.ts — but shares the same
// formatting utilities so the two never drift.
import type { ReactElement } from "react";
import { formatWaterBadge } from "../shared/utils/format";

export interface BadgeProps {
  waterML: number;
}

export function Badge({ waterML }: BadgeProps): ReactElement {
  return (
    <span className="aiwe-badge-container" role="status">
      {formatWaterBadge(waterML)}
    </span>
  );
}
