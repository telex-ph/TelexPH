import { useDarkMode } from "@/pages/admin/dashboard/Layout";
const ConfirmModal = ({
  isOpen,
  isEditMode,
  isLoading,
  onClose,
  onConfirm
}) => {
  const { isdarkmode } = useDarkMode();
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-[3rem] p-12 max-w-md w-full shadow-2xl bg-[var(--admin-surface)]`}>
        <h3 className={`text-2xl font-bold mb-4 text-[var(--admin-text)]`}>
          {isEditMode ? "Confirm Update" : "Confirm Creation"}
        </h3>
        <p className={`mb-8 text-[var(--admin-text-sub)]`}>
          {isEditMode ? "Are you sure you want to update this case study?" : "Are you sure you want to create this case study?"}
        </p>
        <div className="flex gap-4">
          <button
    onClick={onClose}
    disabled={isLoading}
    className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-colors bg-[var(--admin-bg-soft)] text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`}
  >
            Cancel
          </button>
          <button
    onClick={onConfirm}
    disabled={isLoading}
    className="flex-1 px-6 py-3 bg-[var(--admin-accent)] text-white rounded-2xl font-bold hover:bg-[#600000] transition-colors disabled:opacity-50"
  >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>;
};
export {
  ConfirmModal
};
