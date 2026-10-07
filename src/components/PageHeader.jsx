// The one title block for every admin page (matches Services Management):
// 18px/500 title, 12px subtitle, divider underneath, optional actions on the right.
// `before` sits left of the title (e.g. a back button). `style` overrides the wrapper
// (pass marginBottom: 4 on pages whose parent already adds a 24px flex gap).
function PageHeader({ title, subtitle, actions, before, style }) {
  return <div
    className="ph"
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
      marginBottom: 28,
      paddingBottom: 24,
      borderBottom: "1px solid var(--admin-border)",
      ...style
    }}
  >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0 }}>
        {before}
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: "var(--admin-text)", margin: 0, lineHeight: 1.3 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 12, color: "var(--admin-text-sub)", margin: "4px 0 0", fontWeight: 400 }}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>{actions}</div>}
    </div>;
}

export default PageHeader;
