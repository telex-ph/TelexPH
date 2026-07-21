import MyVAsPage from "./MyVAsPage";
const metadata = {
  title: "Client Portal | My VAs",
  description: "Client Portal Dashboard - Manage Hired Virtual Assistants"
};
function Page() {
  return <MyVAsPage />;
}
export {
  Page as default,
  metadata
};
