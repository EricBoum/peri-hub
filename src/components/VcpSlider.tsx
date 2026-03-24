import { useCallback, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export function VcpSlider({
  displayId,
  code,
  label,
  initial,
  maximum,
}: {
  displayId: number;
  code: number;
  label: string;
  initial: number;
  maximum: number;
}) {
  const [value, setValue] = useState(initial);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = useCallback(
    (val: number) => {
      setValue(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        invoke("set_vcp_value", { displayId, code, value: val }).catch(
          () => {}
        );
      }, 80);
    },
    [displayId, code]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value} / {maximum}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={maximum}
        step={1}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="h-1.5 w-full appearance-none rounded-full bg-muted accent-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
      />
    </div>
  );
}
