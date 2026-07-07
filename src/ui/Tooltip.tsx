import type { ReactElement, ReactNode } from "react";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps): ReactElement {
  return (
    <span className="aiwe-tooltip-wrapper" title={typeof content === "string" ? content : undefined}>
      {children}
    </span>
  );
}
