
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import LoginSuccessOverlay from "@/components/LoginSuccessOverlay";
function LoginWelcomeGateInner({ portalLabel, accent }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(() => searchParams.get("welcome") === "1");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!showWelcome) return;
    router.replace(window.location.pathname, { scroll: false });
  }, [showWelcome, router]);
  if (!showWelcome || !mounted) return null;
  return createPortal(
    <LoginSuccessOverlay
      portalLabel={portalLabel}
      accent={accent}
      onDone={() => setShowWelcome(false)}
    />,
    document.body
  );
}
function LoginWelcomeGate(props) {
  return <Suspense fallback={null}>
      <LoginWelcomeGateInner {...props} />
    </Suspense>;
}
export {
  LoginWelcomeGate as default
};
