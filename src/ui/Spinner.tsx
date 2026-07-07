import type { ReactElement } from "react";

export function Spinner(): ReactElement {
  return <div className="aiwe-spinner" role="progressbar" aria-label="Loading" />;
}
