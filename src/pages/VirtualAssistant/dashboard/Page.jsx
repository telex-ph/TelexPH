
import Dashboard from "./VAdashboard/Dashboard";
import LoginWelcomeGate from "@/components/LoginWelcomeGate";
function Page() {
  return <>
      <LoginWelcomeGate portalLabel="Virtual Assistant" accent="#800000" />
      <Dashboard />
    </>;
}
export {
  Page as default
};
