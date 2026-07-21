
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
function useDashboardTheme() {
  const { isdarkmode } = useDarkMode();
  const cardBg = isdarkmode ? "#1a1a1a" : "#ffffff";
  const borderColor = isdarkmode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = isdarkmode ? "#f0f0f0" : "#1f2937";
  const textMuted = isdarkmode ? "#6b7280" : "#9ca3af";
  const subtleBg = isdarkmode ? "rgba(255,255,255,0.03)" : "#f9fafb";
  const pageBg = isdarkmode ? "#0d0d0d" : "#f5f5f5";
  const inputBg = isdarkmode ? "#161616" : "#ffffff";
  const card = {
    background: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: 24,
    boxShadow: isdarkmode ? "0 1px 6px rgba(0,0,0,.4)" : "0 1px 6px rgba(0,0,0,.06)"
  };
  return { isdarkmode, cardBg, borderColor, textPrimary, textMuted, subtleBg, pageBg, inputBg, card };
}
export {
  useDashboardTheme
};
