
function VASubscriptions() {
  return <div
    style={{
      maxWidth: 640,
      padding: "8px 4px 32px",
      fontFamily: "'Inter', 'Poppins', sans-serif"
    }}
  >
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Subscriptions</h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginTop: 10, lineHeight: 1.55 }}>
        Active client plans and hours will appear here once connected to your backend. This page is for
        Virtual Assistant accounts only.
      </p>
    </div>;
}
export {
  VASubscriptions as default
};
