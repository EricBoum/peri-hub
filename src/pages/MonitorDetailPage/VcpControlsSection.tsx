import { useTranslation } from "react-i18next";
import { VcpSlider } from "@/components/VcpSlider";
import type { VcpValue } from "@/types/device";

const VCP_LABELS: Record<number, string> = {
  0x10: "controls.brightness",
  0x12: "controls.contrast",
  0x87: "controls.sharpness",
  0x8a: "controls.saturation",
  0x16: "controls.redGain",
  0x18: "controls.greenGain",
  0x1a: "controls.blueGain",
  0x62: "controls.volume",
  0x60: "controls.inputSource",
  0xd6: "controls.powerMode",
};

export function VcpControlsSection({
  displayId,
  controls,
}: {
  displayId: number;
  controls: VcpValue[];
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {controls.map((ctrl) => (
        <VcpSlider
          key={ctrl.code}
          displayId={displayId}
          code={ctrl.code}
          label={t(
            VCP_LABELS[ctrl.code] ??
              `VCP 0x${ctrl.code.toString(16).toUpperCase()}`
          )}
          initial={ctrl.current}
          maximum={ctrl.maximum}
        />
      ))}
    </div>
  );
}
