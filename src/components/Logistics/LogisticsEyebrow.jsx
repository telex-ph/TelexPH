import { COLORS } from "@/constant/styles";

/* Small section title: red "///" mark followed by a tracked, uppercase label. */
const LogisticsEyebrow = ({ children, light = false, center = false, slash = COLORS.primary }) => (
  <p
    className={`mb-4 flex items-center gap-3 text-xs md:text-sm font-semibold uppercase tracking-[0.28em] ${center ? "justify-center" : ""}`}
    style={{ color: light ? "#e5e7eb" : COLORS.dark, fontFamily: "var(--font-open-sans), sans-serif" }}
  >
    <span aria-hidden className="text-lg font-bold italic leading-none tracking-[0.2em]" style={{ color: slash }}>///</span>
    {children}
  </p>
);

export default LogisticsEyebrow;
