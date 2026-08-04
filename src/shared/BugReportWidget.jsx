import { useState } from "react";
import { Bug, X } from "lucide-react";

const BUG_REPORT_URL = "https://api.texionix.telexph.com/report/telexph.html";

/**
 * Floating button rendered on every page (mounted once in App.jsx).
 * Asks for confirmation before opening the bug report tool in a new tab,
 * since the click can happen mid-task and shouldn't fire unintentionally.
 */
const BugReportWidget = () => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    window.open(BUG_REPORT_URL, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report a bug"
        title="Report a bug"
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
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
            className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="bug-report-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              Leave this page?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You&apos;ll be redirected to the bug report tool in a new tab.
              Do you want to continue?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
