import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Sun, SunDim } from "lucide-react";

export function BrightnessSlider({ displayId }: { displayId: number }) {
  const [brightness, setBrightness] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    invoke<number>("get_brightness", { displayId })
      .then((v) => setBrightness(v))
      .catch(() => setSupported(false));
  }, [displayId]);

  const handleChange = useCallback(
    (val: number) => {
      setBrightness(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        invoke("set_brightness", { displayId, value: val }).catch(() => {});
      }, 50);
    },
    [displayId]
  );

  if (!supported) return null;
  if (brightness === null) return null;

  const percent = Math.round(brightness * 100);

  return (
    <div className="flex items-center gap-3">
      <SunDim className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={brightness}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="h-1.5 flex-1 appearance-none rounded-full bg-muted accent-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
      />
      <Sun className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
        {percent}%
      </span>
    </div>
  );
}
