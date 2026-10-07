import { THEMES, useAdminTheme } from "@/lib/admin-theme";

// Literal (non-var) swatches per theme so a tile can preview theme B's look
// while theme A is active — var(--admin-*) would just show whichever theme is
// live right now, defeating the point of a preview grid.
// Mirrors the values in styles/admin-theme.css.
const PALETTES = {
  light:           { bg: "#f5f5f4", surface: "#ffffff", border: "#e7e5e4", text: "#282828", textSub: "#8c8c8a" },
  "light-cream":   { bg: "#f7f3ea", surface: "#fffdf7", border: "#e9ddc6", text: "#2b2420", textSub: "#9c8f7f" },
  "light-blush":   { bg: "#fdf5f5", surface: "#ffffff", border: "#f5dede", text: "#2e1a1a", textSub: "#ad8c8c" },
  "light-sand":    { bg: "#f5f0e8", surface: "#fbf8f2", border: "#e3d7c1", text: "#33291e", textSub: "#a4967f" },
  "light-cool":    { bg: "#f3f5f8", surface: "#ffffff", border: "#e2e7ef", text: "#1a2030", textSub: "#8e97a8" },
  "light-sage":    { bg: "#f3f6f3", surface: "#fbfdfb", border: "#dee8dd", text: "#1e2620", textSub: "#8fa090" },
  "dark-obsidian": { bg: "#000000", surface: "#0a0a0a", border: "#1f1f1f", text: "#f5f5f5", textSub: "#6b6b6b" },
  "dark-slate":    { bg: "#0f1115", surface: "#171a20", border: "#262b34", text: "#f3f4f6", textSub: "#6b7280" },
  "dark-maroon":   { bg: "#1c1c1c", surface: "#282828", border: "#3a3a39", text: "#f5f5f4", textSub: "#85847f" },
  "dark-indigo":   { bg: "#10111a", surface: "#171925", border: "#282b40", text: "#edeef7", textSub: "#6b6e8a" },
  "dark-charcoal": { bg: "#1c1c1e", surface: "#262628", border: "#38383b", text: "#fafafa", textSub: "#7d7d80" },
  "dark-espresso": { bg: "#1c140f", surface: "#261c15", border: "#40301f", text: "#f3e9df", textSub: "#8f7563" },
  "dark-burgundy": { bg: "#1a0a0d", surface: "#250e13", border: "#40222a", text: "#f7e8ea", textSub: "#8f5f68" },
  "dark-rosegold": { bg: "#211519", surface: "#2c1d22", border: "#45303a", text: "#f9edef", textSub: "#977c82" },
  dracula:            { bg: "#191a21", surface: "#282a36", border: "#44475a", text: "#f8f8f2", textSub: "#6272a4", accent: "#ff79c6" },
  monokai:            { bg: "#1e1f1c", surface: "#272822", border: "#49483e", text: "#f8f8f2", textSub: "#75715e", accent: "#66d9ef" },
  "night-owl-light":  { bg: "#fbfbfb", surface: "#ffffff", border: "#e3e5e9", text: "#403f53", textSub: "#90a7b2", accent: "#2aa298" },
  "night-owl-dark":   { bg: "#011627", surface: "#0b2942", border: "#1d3b54", text: "#d6deeb", textSub: "#637777", accent: "#c792ea" },
  "solarized-light":  { bg: "#fdf6e3", surface: "#fffbf0", border: "#eee8d5", text: "#073642", textSub: "#93a1a1", accent: "#b58900" },
  "solarized-dark":   { bg: "#002b36", surface: "#073642", border: "#0d4957", text: "#839496", textSub: "#586e75", accent: "#2aa198" },
};

// TelexPH brand red — the accent for every theme that doesn't override it.
const DEFAULT_ACCENT = "#A10000";

function ThemeTile({ themeKey, label, active, onSelect }) {
  const p = PALETTES[themeKey];
  const accent = p.accent || DEFAULT_ACCENT;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      title={label}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          width: "100%", aspectRatio: "4 / 3", borderRadius: 10, overflow: "hidden",
          background: p.bg,
          border: `2.5px solid ${active ? accent : "var(--admin-border)"}`,
          boxShadow: active ? "var(--admin-shadow-sm)" : "none",
          transition: "border-color .15s",
        }}
      >
        {/* Mock browser chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", borderBottom: `1px solid ${p.border}` }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.textSub }} />
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.textSub }} />
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.textSub }} />
          <span style={{ flex: 1, height: 8, borderRadius: 4, background: p.surface, marginLeft: 4 }} />
        </div>
        {/* Mock content */}
        <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ width: "70%", height: 6, borderRadius: 3, background: p.text, opacity: 0.85 }} />
          <span style={{ width: "45%", height: 6, borderRadius: 3, background: p.textSub }} />
          <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
            <span style={{ width: 26, height: 14, borderRadius: 4, background: accent }} />
            <span style={{ flex: 1, height: 14, borderRadius: 4, background: p.surface, border: `1px solid ${p.border}` }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${active ? accent : "var(--admin-border-strong)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />}
        </span>
        <span style={{ fontSize: 12, fontWeight: active ? 600 : 500, color: "var(--admin-text)" }}>
          {label}
        </span>
      </div>
    </button>
  );
}

/**
 * Theme picker for the admin Settings → Appearance tab: a persistent grid of
 * live-preview tiles. Selecting one applies immediately (and persists) — there
 * is no separate save step.
 */
export default function AdminThemeGallery() {
  const { theme, setTheme } = useAdminTheme();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 18 }}>
      {THEMES.map((t) => (
        <ThemeTile
          key={t.key}
          themeKey={t.key}
          label={t.label}
          active={t.key === theme}
          onSelect={() => setTheme(t.key)}
        />
      ))}
    </div>
  );
}
