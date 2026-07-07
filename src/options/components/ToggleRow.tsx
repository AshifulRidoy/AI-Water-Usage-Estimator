import type { ReactElement } from "react";

export interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleRow({ label, checked, onChange }: ToggleRowProps): ReactElement {
  return (
    <div className="aiwe-settings-row">
      <span>{label}</span>
      <input
        className="aiwe-toggle"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
}
