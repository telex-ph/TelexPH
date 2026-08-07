import { useDarkMode } from "@/pages/admin/dashboard/Layout";

// Returns CSS custom properties rather than literal hex, so every consumer
// repaints when the active theme changes without threading a palette object
// through props. `isdarkmode` stays exposed for the non-color decisions
// (chart palettes, shadow presence) that a token can't express.
function useDashboardTheme() {
  const { isdarkmode } = useDarkMode();
  const cardBg = "var(--admin-surface)";
  const borderColor = "var(--admin-border)";
  const textPrimary = "var(--admin-text)";
  const textMuted = "var(--admin-text-faint)";
  const subtleBg = "var(--admin-bg-soft)";
  const pageBg = "var(--admin-bg)";
  const inputBg = "var(--admin-surface)";
  const accent = "var(--admin-accent)";
  const card = {
    background: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: 24,
    boxShadow: "var(--admin-shadow-sm)"
  };
  return { isdarkmode, cardBg, borderColor, textPrimary, textMuted, subtleBg, pageBg, inputBg, accent, card };
}
export {
  useDashboardTheme
};
