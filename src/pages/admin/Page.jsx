import { Navigate } from "react-router-dom";

function AdminPage() {
  return <Navigate to="/admin/dashboard" replace />;
}
export {
  AdminPage as default
};
