import { createContext, useContext, useEffect, useState } from "react";

// Multi-theme system for the admin dashboard. Colors live entirely in CSS
// custom properties (see styles/admin-theme.css) selected by a
// data-admin-theme attribute on <html> — that's what lets a repaint happen
// the instant the attribute changes, without every consumer re-rendering.
//
// `isDark` here is not cosmetic: the dashboard's 34 existing component files
// all branch on `isdarkmode ? A : B` for things CSS vars don't cover (opacity
// choices, shadow presence, chart palettes). Keeping an authoritative
// light/dark bit per theme means those files keep working untouched and only
// need their *colors* swapped for tokens.
const STORAGE_KEY = "admin-dashboard-theme";

export const THEMES = [
  { key: "light", label: "Light", isDark: false },
  { key: "light-cream", label: "Cream", isDark: false },
  { key: "light-blush", label: "Blush", isDark: false },
  { key: "light-sand", label: "Sand", isDark: false },
  { key: "light-cool", label: "Cool", isDark: false },
  { key: "light-sage", label: "Sage", isDark: false },
  { key: "dark-obsidian", label: "Obsidian", isDark: true },
  { key: "dark-slate", label: "Slate", isDark: true },
  { key: "dark-maroon", label: "Maroon", isDark: true },
  { key: "dark-indigo", label: "Indigo", isDark: true },
  { key: "dark-charcoal", label: "Charcoal", isDark: true },
  { key: "dark-espresso", label: "Espresso", isDark: true },
  { key: "dark-burgundy", label: "Burgundy", isDark: true },
  { key: "dark-rosegold", label: "Rose Gold", isDark: true },
  { key: "dracula", label: "Dracula", isDark: true },
  { key: "monokai", label: "Monokai", isDark: true },
  { key: "night-owl-light", label: "Night Owl Light", isDark: false },
  { key: "night-owl-dark", label: "Night Owl Dark", isDark: true },
  { key: "solarized-light", label: "Solarized Light", isDark: false },
  { key: "solarized-dark", label: "Solarized Dark", isDark: true },
];

const THEME_BY_KEY = Object.fromEntries(THEMES.map((t) => [t.key, t]));
export const DEFAULT_THEME = "light";

export function isDarkTheme(key) {
  return THEME_BY_KEY[key]?.isDark ?? false;
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (THEME_BY_KEY[stored]) return stored;
    // Migrates the old binary toggle, which wrote localStorage "theme" =
    // "dark" | "light", so an admin who had dark mode on doesn't get snapped
    // back to light on first load after this upgrade.
    if (localStorage.getItem("theme") === "dark") return "dark-obsidian";
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

const AdminThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  isdarkmode: false,
});

export function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-admin-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      // Kept in sync so the pre-existing binary reads elsewhere (and the
      // /users/theme darkMode column) still agree with the active theme.
      localStorage.setItem("theme", isDarkTheme(theme) ? "dark" : "light");
    } catch {
      // localStorage throws in private-browsing/quota-exceeded contexts — the
      // theme still applies for this session, it just won't persist.
    }
    return () => document.documentElement.removeAttribute("data-admin-theme");
  }, [theme]);

  const setTheme = (key) => {
    if (THEME_BY_KEY[key]) setThemeState(key);
  };

  return (
    <AdminThemeContext.Provider
      value={{ theme, setTheme, isdarkmode: isDarkTheme(theme) }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
