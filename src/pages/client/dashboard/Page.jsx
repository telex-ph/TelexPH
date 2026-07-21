import ClientDashboard from "./clientDashboard";
import LoginWelcomeGate from "@/components/LoginWelcomeGate";
const metadata = {
  title: "Client Portal | Dashboard",
  description: "Client Portal Dashboard"
};
function Page() {
  return <>
      <LoginWelcomeGate portalLabel="Client" accent="#8b0000" />
      <ClientDashboard />
    </>;
}
export {
  Page as default,
  metadata
};
