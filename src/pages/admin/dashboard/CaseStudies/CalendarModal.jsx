import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import { MONTHS, DAYS_SHORT } from "./constants";
import { getCalendarDays } from "./helpers";
const CalendarModal = ({
  isOpen,
  selectedMonthIndex,
  records,
  onClose,
  onMonthChange,
  onDateClick
}) => {
  const { isdarkmode } = useDarkMode();
  if (!isOpen) return null;
  const days = getCalendarDays(selectedMonthIndex);
  const today = /* @__PURE__ */ new Date();
  const calendardata = days.map((d) => {
    if (d === null) return { day: 0, currentmonth: false, istoday: false };
    const year = today.getFullYear();
    const dateStr = `${year}-${String(selectedMonthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const studiesOnDate = records.filter((r) => r.start === dateStr);
    const markedDates = studiesOnDate.map((study) => {
      switch (study.status) {
        case "Active":
          return { color: "bg-[#10B981]" };
        case "Completed":
          return { color: "bg-[#3B82F6]" };
        case "Draft":
          return { color: "bg-[#9CA3AF]" };
        case "Scheduled":
          return { color: "bg-[#F59E0B]" };
        default:
          return { color: "bg-gray-400" };
      }
    });
    return {
      day: d,
      currentmonth: true,
      istoday: d === today.getDate() && selectedMonthIndex === today.getMonth(),
      markedDates: markedDates.length > 0 ? markedDates : void 0
    };
  });
  const handleDateClick = (d) => {
    if (d.currentmonth && d.day > 0) {
      onDateClick(d.day);
    }
  };
  return <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8 no-scrollbar">
      <div className={`rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl bg-[var(--admin-surface)]`}>
        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          {
    /* Left Side: Calendar */
  }
          <div className={`flex-[3] p-8 overflow-y-auto no-scrollbar bg-[var(--admin-surface)]`}>
            <div className="mb-6">
              <h3 className={`text-xl font-semibold text-[var(--admin-text)]`}>
                Calendar
              </h3>
              <p className={`text-xs mt-1 text-[var(--admin-text-faint)]`}>
                Select a date to view details
              </p>
            </div>

            {
    /* Month Selector */
  }
            <div className={`flex flex-wrap gap-2 mb-6 p-2 rounded-2xl bg-[var(--admin-bg-soft)]`}>
              {MONTHS.map((m, idx) => <button
    key={m}
    onClick={() => onMonthChange(idx)}
    className={`flex-1 min-w-[60px] text-center py-2.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-all duration-200 ${idx === selectedMonthIndex ? "bg-red-900 text-white shadow-lg" : "text-[var(--admin-text-sub)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]"}`}
  >
                  {m.substring(0, 3)}
                </button>)}
            </div>

            {
    /* Day Labels */
  }
            <div className="grid grid-cols-7 gap-3 text-center mb-3">
              {DAYS_SHORT.map((day) => <span key={day} className={`text-[10px] font-bold uppercase text-[var(--admin-text-faint)]`}>
                  {day}
                </span>)}
            </div>

            {
    /* Calendar Grid */
  }
            <div className="grid grid-cols-7 gap-2.5">
              {calendardata.map((d, i) => <div
    key={i}
    className={`relative rounded-2xl transition-all duration-200 flex items-center justify-center cursor-pointer min-h-[56px] ${d.istoday ? "bg-red-900 hover:bg-red-800 border border-red-900" : d.currentmonth ? "bg-[var(--admin-bg-soft)] hover:bg-[var(--admin-bg-hover)] border border-[var(--admin-border)]" : "bg-transparent opacity-30"}`}
    onClick={() => handleDateClick(d)}
  >
                  {
    /* Date markers */
  }
                  {d.markedDates && d.markedDates.length > 0 && <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-0.5 flex-wrap px-1">
                      {d.markedDates.slice(0, 5).map((mark, idx) => <div
    key={idx}
    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${mark.color}`}
  />)}
                    </div>}
                  
                  {
    /* Day number */
  }
                  <span
    className={`text-sm font-medium transition-all ${d.istoday ? "text-white font-bold" : d.currentmonth ? "text-[var(--admin-text)]" : "text-gray-400"}`}
  >
                    {d.day || ""}
                  </span>
                </div>)}
            </div>
          </div>

          {
    /* Right Side: Details Panel */
  }
          <div className={`flex-[2] p-8 flex flex-col relative overflow-y-auto no-scrollbar bg-[var(--admin-bg-soft)]`}>
            <button
    onClick={onClose}
    className={`absolute top-6 right-6 p-2.5 rounded-full transition-all bg-[var(--admin-surface)] text-[var(--admin-text-sub)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`}
  >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="mt-12 mb-6">
              <h3 className={`text-lg font-semibold text-[var(--admin-text)]`}>
                Event Details
              </h3>
              <p className={`text-xs mt-1 text-[var(--admin-text-faint)]`}>
                Stay updated with our project timeline and milestone completions.
              </p>
            </div>

            <div className="space-y-6">
              <div className={`p-5 rounded-2xl ${isdarkmode ? "bg-red-900/10 border border-red-900/20" : "bg-red-50 border border-red-100"}`}>
                <p className={`text-[10px] font-bold uppercase mb-1.5 ${isdarkmode ? "text-red-400" : "text-red-700"}`}>
                  Tip
                </p>
                <p className={`text-xs leading-relaxed text-[var(--admin-text-sub)]`}>
                  Click on any highlighted date to view associated case studies or project updates.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className={`text-xs font-medium text-[var(--admin-text-sub)]`}>
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className={`text-xs font-medium text-[var(--admin-text-sub)]`}>
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                  <span className={`text-xs font-medium text-[var(--admin-text-sub)]`}>
                    Draft
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className={`text-xs font-medium text-[var(--admin-text-sub)]`}>
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  CalendarModal
};
