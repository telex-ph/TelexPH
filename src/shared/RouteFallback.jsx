import { useLocation } from "react-router-dom";
import DashboardLoader from "@/components/DashboardLoader";

/**
 * Shown while a lazily-loaded route chunk is downloading.
 *
 * Public site: deliberately blank rather than a spinner — chunks usually
 * arrive in a few dozen milliseconds, and a spinner that appears and vanishes
 * that fast reads as a flicker. Reserving full viewport height keeps the
 * header from jumping.
 *
 * Admin dashboard: the shared dashboard loader, so the auth check, the chunk
 * download and the page's own data load read as one continuous animation.
 */
const RouteFallback = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin/dashboard")) {
    return <DashboardLoader isVisible message="Loading your workspace…" />;
  }
  return <div style={{ minHeight: "100dvh" }} aria-busy="true" />;
};

export default RouteFallback;
