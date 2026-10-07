
import Link from "next/link";
function SettingsMenu({ isdarkmode }) {
  const textMuted = "var(--admin-text-faint)";
  const borderColor = "var(--admin-border)";
  const hoverBg = "var(--admin-accent-soft)";
  const iconBg = "var(--admin-bg-soft)";
  return <>
      <style>{`
        * { font-family: var(--font-body) !important; letter-spacing: 0 !important; -webkit-font-smoothing: antialiased; }
        .settings-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          color: ${textMuted};
          background: transparent;
          transition: all 0.15s ease;
          width: 100%;
        }
        .settings-link:hover {
          background: ${hoverBg};
          border-color: ${borderColor};
          color: ${"var(--admin-accent-text)"};
        }
        .settings-link:hover .settings-icon {
          transform: rotate(45deg);
          color: var(--admin-accent);
          background: ${"var(--admin-accent-soft)"};
        }
        .settings-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: ${iconBg};
          color: ${textMuted};
          flex-shrink: 0;
          transition: transform 0.4s ease, color 0.15s ease, background 0.15s ease;
        }
        .settings-main {
          font-size: 12px;
          font-weight: 500;
          line-height: 1;
          display: block;
        }
        .settings-sub {
          font-size: 10px;
          font-weight: 400;
          color: ${textMuted};
          opacity: 0.7;
          line-height: 1;
          display: block;
          margin-top: 2px;
        }
      `}</style>

      <Link href="/admin/dashboard/settings" className="settings-link">
        <div className="settings-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div>
          <span className="settings-main">Settings</span>
          <span className="settings-sub">Preferences &amp; config</span>
        </div>
      </Link>
    </>;
}
export {
  SettingsMenu as default
};
