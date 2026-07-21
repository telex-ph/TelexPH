import { useDarkMode } from "@/pages/admin/dashboard/Layout";
const DeleteModal = ({
  isOpen,
  isDeleting,
  targetTitle,
  onClose,
  onConfirm
}) => {
  const { isdarkmode } = useDarkMode();
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-[3rem] p-12 max-w-md w-full shadow-2xl ${isdarkmode ? "bg-[#1f1f1f]" : "bg-white"}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isdarkmode ? "bg-amber-900/20" : "bg-amber-50"}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isdarkmode ? "text-amber-400" : "text-amber-600"}>
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
            <path d="M12 11v6M9 11v6M15 11v6" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isdarkmode ? "text-white" : "text-gray-900"}`}>
          Archive Case Study
        </h3>
        <p className={`mb-1 text-sm font-semibold ${isdarkmode ? "text-gray-300" : "text-gray-700"}`}>
          "{targetTitle}"
        </p>
        <p className={`mb-8 text-sm ${isdarkmode ? "text-gray-400" : "text-gray-500"}`}>
          This case study will be archived and hidden from the library. It will no longer appear in any listings.
        </p>
        <div className="flex gap-4">
          <button
    onClick={onClose}
    disabled={isDeleting}
    className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-colors ${isdarkmode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
  >
            Cancel
          </button>
          <button
    onClick={onConfirm}
    disabled={isDeleting}
    className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-colors disabled:opacity-50"
  >
            {isDeleting ? "Archiving..." : "Archive"}
          </button>
        </div>
      </div>
    </div>;
};
export {
  DeleteModal
};
