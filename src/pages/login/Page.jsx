import { Navigate } from "react-router-dom";

function LegacyLoginRedirect() {
  return <Navigate to="/admin/login" replace />;
}
export {
  LegacyLoginRedirect as default
};
