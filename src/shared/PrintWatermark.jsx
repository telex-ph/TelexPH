// Logo watermark shown only when printing / exporting to PDF.
import { localImage } from "@/shared/Image";

export default function PrintWatermark() {
  return (
    <div className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none z-0">
      <img src={localImage("/images/log0.png", 640)} alt="TelexPH logo" aria-hidden="true" style={{ width: "480px", opacity: 0.07, transform: "rotate(-20deg)" }} />
    </div>
  );
}
