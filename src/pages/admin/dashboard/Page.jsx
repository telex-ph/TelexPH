import AdminDashboard from "./AdminDashboard";
import LoginWelcomeGate from "@/components/LoginWelcomeGate";
function Page() {
  return <>
      <LoginWelcomeGate portalLabel="Admin" accent="#800000" />
      <AdminDashboard />
    </>;
}
export {
  Page as default
};
