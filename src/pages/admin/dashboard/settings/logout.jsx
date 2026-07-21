
import { useState } from "react";
import LogoutOverlay from "@/components/LogoutOverlay";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
async function performAdminLogout() {
  try {
    await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      // Important: includes cookies
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
function goToAdminLogin() {
  window.location.href = "/admin/login";
}
function Logout({ isdarkmode, onRequestConfirm }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logoutDone, setLogoutDone] = useState(false);
  const handlelogout = async () => {
    if (isLoggingOut) return;
    setConfirmOpen(false);
    setIsLoggingOut(true);
    await performAdminLogout();
    setLogoutDone(true);
  };
  return <>
      {confirmOpen && <LogoutConfirmModal
    portalLabel="Admin"
    accent="#800000"
    onConfirm={handlelogout}
    onCancel={() => setConfirmOpen(false)}
  />}
      {isLoggingOut && <LogoutOverlay portalLabel="Admin" accent="#800000" ready={logoutDone} onDone={goToAdminLogin} />}
    <button
    onClick={() => onRequestConfirm ? onRequestConfirm() : setConfirmOpen(true)}
    disabled={isLoggingOut}
    className={`w-full flex items-center gap-4 px-6 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-widest transition-all border-none bg-transparent cursor-pointer text-left ${isdarkmode ? "text-red-400 hover:bg-white/5" : "text-red-600 hover:bg-red-50"} ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
  >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isLoggingOut ? "Logging out..." : "logout"}
    </button>
    </>;
}
export {
  Logout as default,
  goToAdminLogin,
  performAdminLogout
};
