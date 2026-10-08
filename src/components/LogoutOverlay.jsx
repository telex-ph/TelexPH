
import { useEffect, useRef } from "react";
import DashboardLoader from "@/components/DashboardLoader";
const MIN_VISIBLE_MS = 650;
// Uses the shared loader (icon + title + hint) so logout looks like every other loading screen.
// onDone fires once `ready` is true and the overlay has been up for MIN_VISIBLE_MS.
function LogoutOverlay({
  portalLabel,
  onDone,
  ready = true
}) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const shownAtRef = useRef(Date.now());
  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const finish = setTimeout(() => onDoneRef.current(), remaining);
    return () => clearTimeout(finish);
  }, [ready]);
  return <DashboardLoader isVisible message="Logging out…" subMessage={`Signing you out of ${portalLabel}`} />;
}
export {
  LogoutOverlay as default
};
