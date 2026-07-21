import { useDarkMode } from "@/pages/admin/dashboard/Layout";
const CaseStudyCard = ({
  study,
  isEditing,
  onPreview,
  onEdit,
  onDelete
}) => {
  const { isdarkmode } = useDarkMode();
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#10B981]";
      case "Completed":
        return "bg-[#3B82F6]";
      case "Draft":
        return "bg-[#9CA3AF]";
      case "Scheduled":
        return "bg-[#F59E0B]";
      default:
        return "bg-gray-600";
    }
  };
  return <div className={`group rounded-[2.5rem] p-6 transition-all duration-300 flex flex-col relative overflow-hidden ${isEditing ? "ring-2 ring-red-900 shadow-xl" : isdarkmode ? "bg-[#2a2a2a] hover:bg-[#303030] shadow-md hover:shadow-xl" : "bg-white hover:shadow-xl shadow-sm"}`}>
      {
    /* Cover Image */
  }
      {study.image && <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-5 bg-gray-100">
          <img
    src={study.image}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    alt={study.title}
    onError={(e) => {
      const target = e.target;
      target.style.display = "none";
    }}
  />
        </div>}

      {
    /* Title */
  }
      <h4 className={`text-lg font-semibold mb-2 line-clamp-2 leading-snug ${isdarkmode ? "text-white" : "text-gray-900"}`}>
        {study.title}
      </h4>

      {
    /* Subtitle */
  }
      {study.subtitle && <p className={`text-sm mb-3 line-clamp-2 ${isdarkmode ? "text-gray-400" : "text-gray-500"}`}>
          {study.subtitle}
        </p>}

      {
    /* Author */
  }
      <p className={`text-xs mb-1 ${isdarkmode ? "text-gray-500" : "text-gray-400"}`}>
        By {study.author}
      </p>

      {
    /* Date Range */
  }
      <p className={`text-xs mb-4 ${isdarkmode ? "text-gray-500" : "text-gray-400"}`}>
        {study.start} â€“ {study.isUnfinished ? "Unfinished" : study.end}
      </p>

      {
    /* Spacer */
  }
      <div className="flex-1" />

      {
    /* Bottom Section: Status Badge + Actions */
  }
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white ${getStatusBadgeStyle(study.status)}`}>
          {study.status}
        </span>

        <div className="flex items-center gap-1.5">
          {
    /* Preview */
  }
          <button
    onClick={onPreview}
    className={`p-2 rounded-lg transition-colors ${isdarkmode ? "text-gray-400 hover:text-blue-400 hover:bg-white/5" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
    title="Preview"
  >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {
    /* Edit */
  }
          <button
    onClick={onEdit}
    className={`p-2 rounded-lg transition-colors ${isEditing ? "text-red-900 bg-red-100 dark:bg-red-900/20" : isdarkmode ? "text-gray-400 hover:text-orange-400 hover:bg-white/5" : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"}`}
    title="Edit"
  >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {
    /* Archive */
  }
          <button
    onClick={onDelete}
    className={`p-2 rounded-lg transition-colors ${isdarkmode ? "text-gray-400 hover:text-amber-400 hover:bg-white/5" : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"}`}
    title="Archive"
  >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>;
};
export {
  CaseStudyCard
};
