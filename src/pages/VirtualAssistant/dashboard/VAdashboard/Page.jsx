import Dashboard from "./Dashboard";
const metadata = {
  title: "Client Portal | Virtual Assistant Dashboard",
  description: "Manage your Virtual Assistant team \u2014 hiring, performance, tasks, and billing."
};
function Page() {
  return <Dashboard />;
}
export {
  Page as default,
  metadata
};
