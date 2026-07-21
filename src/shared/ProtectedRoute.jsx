import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "@/lib/api/axios";

/**
 * Replaces the old Next.js `middleware.ts`.
 *
 * The middleware verified the accessToken's signature server-side before
 * rendering. A SPA has no server render step and cannot hold a verification
 * key, so instead we ask the API whether the session cookie is actually
 * valid. The backend remains the real authority — this guard only decides
 * what the user sees while that answer is pending.
 *
 * `probe` is the endpoint that 401s for an unauthenticated caller.
 */
const ProtectedRoute = ({
  probe = "/users/me",
  loginPath = "/admin/login",
  label = "Authenticating...",
}) => {
  const [status, setStatus] = useState("checking"); // checking | authed | denied
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    api
      .get(probe)
      .then(() => {
        if (!cancelled) setStatus("authed");
      })
      .catch((error) => {
        if (cancelled) return;
        // Only a genuine auth failure should bounce the user. Timeouts and
        // network blips must not, or a flaky request kicks off the
        // dashboard <-> login redirect loop this app has hit before.
        setStatus(error?.response?.status === 401 ? "denied" : "authed");
      });

    return () => {
      cancelled = true;
    };
  }, [probe]);

  if (status === "checking") {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#800000] border-r-transparent" />
          <p
            className="mt-4 text-gray-500"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px" }}
          >
            {label}
          </p>
          <p
            className="mt-2 text-gray-400"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px" }}
          >
            Please wait
          </p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
