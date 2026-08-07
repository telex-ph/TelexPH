import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bug, X } from "lucide-react";

const BUG_REPORT_URL = "https://api.texionix.telexph.com/report/telexph.html";

/**
 * Floating button rendered on every page (mounted once in App.jsx).
 * Asks for confirmation before opening the bug report tool in a new tab,
 * since the click can happen mid-task and shouldn't fire unintentionally.
 *
 * On /admin routes it follows the active dashboard theme via the --admin-*
 * tokens; everywhere else it keeps the fixed red, because the public site
 * has no theme provider and those tokens resolve to nothing there.
 */
const BugReportWidget = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const themed = pathname.startsWith("/admin");

  const handleConfirm = () => {
    window.open(BUG_REPORT_URL, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  // Inline styles (not Tailwind classes) for the themed case: these need to
  // read live CSS custom properties, which arbitrary-value classes can do but
  // are harder to keep readable across the hover/focus states below.
  const fabStyle = themed
    ? { background: "var(--admin-accent)", color: "var(--admin-text-on-accent)" }
    : undefined;
  const surfaceStyle = themed
    ? { background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }
    : undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report a bug"
        title="Report a bug"
        style={fabStyle}
        className={
          themed
            ? "fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-accent)]"
            : "fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        }
      >
        <Bug className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bug-report-modal-title"
          onClick={() => setOpen(false)}
        >
          <div
            className={
              themed
                ? "relative w-full max-w-sm rounded-xl p-6 shadow-xl"
                : "relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            }
            style={surfaceStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={themed ? { color: "var(--admin-text-faint)" } : undefined}
              className={
                themed
                  ? "absolute right-4 top-4 hover:opacity-70"
                  : "absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              }
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="bug-report-modal-title"
              style={themed ? { color: "var(--admin-text)" } : undefined}
              className={
                themed
                  ? "text-lg font-semibold"
                  : "text-lg font-semibold text-gray-900"
              }
            >
              Leave this page?
            </h2>
            <p
              style={themed ? { color: "var(--admin-text-sub)" } : undefined}
              className={themed ? "mt-2 text-sm" : "mt-2 text-sm text-gray-600"}
            >
              You&apos;ll be redirected to the bug report tool in a new tab.
              Do you want to continue?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={themed ? { color: "var(--admin-text-sub)" } : undefined}
                className={
                  themed
                    ? "rounded-lg px-4 py-2 text-sm font-medium hover:bg-[var(--admin-bg-hover)]"
                    : "rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                }
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                style={
                  themed
                    ? { background: "var(--admin-accent)", color: "var(--admin-text-on-accent)" }
                    : undefined
                }
                className={
                  themed
                    ? "rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                    : "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                }
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BugReportWidget;
