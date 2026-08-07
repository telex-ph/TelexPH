import AdminDashboard from "./AdminDashboard";
import LoginWelcomeGate from "@/components/LoginWelcomeGate";
function Page() {
  return <>
      <LoginWelcomeGate portalLabel="Admin" accent="var(--admin-accent)" />
      <AdminDashboard />
    </>;
}
export {
  Page as default
};
