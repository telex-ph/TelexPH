import { Outlet } from "react-router-dom";

function AdminLayout() {
  return <section className="min-h-screen bg-white font-poppins antialiased text-black">
      <Outlet />
    </section>;
}
export {
  AdminLayout as default
};
