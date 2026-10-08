
import { useEffect, useRef } from "react";
import DashboardLoader from "@/components/DashboardLoader";
// Uses the shared loader (icon + title + hint) so login looks like every other loading screen.
function LoginSuccessOverlay({
  portalLabel,
  onDone
}) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    const finish = setTimeout(() => onDoneRef.current(), 2200);
    return () => clearTimeout(finish);
  }, []);
  return <DashboardLoader isVisible message="Login successful" subMessage={`Taking you to your ${portalLabel} dashboard`} />;
}
export {
  LoginSuccessOverlay as default
};
