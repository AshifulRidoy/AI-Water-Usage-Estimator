import type { ReactElement, ReactNode } from "react";

export interface CardProps {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps): ReactElement {
  return (
    <div className="aiwe-card">
      {title && <div className="aiwe-card-title">{title}</div>}
      <div className="aiwe-card-body">{children}</div>
    </div>
  );
}
