import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import { getstatuscolor, getcategorybadgecolor } from "./helpers";
const DateModal = ({
  isOpen,
  dateData,
  onClose,
  onSelectStudy
}) => {
  const { isdarkmode } = useDarkMode();
  if (!isOpen || !dateData) return null;
  const formattedDate = (/* @__PURE__ */ new Date(dateData.date + "T00:00:00")).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 no-scrollbar">
      <div className={`rounded-[2rem] p-8 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar bg-[var(--admin-surface)]`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold text-[var(--admin-text)]`}>
            {formattedDate}
          </h3>
          <button
    onClick={onClose}
    className={`p-2 rounded-full transition-colors hover:bg-[var(--admin-bg-hover)]`}
  >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {dateData.studies.length === 0 ? <div className="text-center py-12">
            <p className={`text-sm text-[var(--admin-text-faint)]`}>
              No case studies available for this date
            </p>
          </div> : <div className="space-y-3">
            {dateData.studies.map((cs) => <div
    key={cs.id}
    onClick={() => {
      onClose();
      onSelectStudy(cs);
    }}
    className={`p-4 rounded-xl cursor-pointer transition-colors border bg-[var(--admin-bg-soft)] border-[var(--admin-border)] hover:bg-[var(--admin-bg-hover)]`}
  >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate mb-1 text-[var(--admin-text)]`}>
                      {cs.title}
                    </h4>
                    {cs.subtitle && <p className={`text-xs truncate mb-2 text-[var(--admin-text-faint)]`}>
                        {cs.subtitle}
                      </p>}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] px-3 py-1 rounded-full font-bold text-white ${getstatuscolor(cs.status)}`}>
                        {cs.status}
                      </span>
                      {cs.categories && cs.categories.slice(0, 2).map((cat, idx) => <span key={idx} className={`text-[9px] px-3 py-1 rounded-full font-bold text-white ${getcategorybadgecolor(cat)}`}>
                          {cat}
                        </span>)}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 text-[var(--admin-text-faint)]`}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>)}
          </div>}

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
          <button
    onClick={onClose}
    className={`px-6 py-2 rounded-xl font-bold transition-colors text-sm bg-[var(--admin-bg-soft)] text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`}
  >
            Close
          </button>
        </div>
      </div>
    </div>;
};
export {
  DateModal
};
