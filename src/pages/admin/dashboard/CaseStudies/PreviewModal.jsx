import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import { getstatuscolor, getcategorybadgecolor } from "./helpers";
const PreviewModal = ({ isOpen, data, onClose, onEdit }) => {
  const { isdarkmode } = useDarkMode();
  if (!isOpen || !data) return null;
  const handleEdit = () => {
    onEdit(data);
    onClose();
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 overflow-y-auto no-scrollbar">
      <div className={`rounded-[3rem] p-12 max-w-4xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto no-scrollbar bg-[var(--admin-surface)]`}>
        <div className="flex justify-between items-start mb-6">
          <h3 className={`text-3xl font-bold text-[var(--admin-text)]`}>
            {data.title}
          </h3>
          
        </div>

        {data.image && <div className="w-full h-80 rounded-[2rem] overflow-hidden mb-8">
            <img
    src={data.image}
    className="w-full h-full object-cover"
    alt={data.title}
    onError={(e) => {
      const target = e.target;
      target.style.display = "none";
    }}
  />
          </div>}

        <div className="mb-8">
          {data.subtitle && <p className={`text-xl mb-4 text-[var(--admin-text-sub)]`}>
              {data.subtitle}
            </p>}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs px-4 py-2 rounded-2xl font-bold text-white ${getstatuscolor(data.status)}`}>
              {data.status}
            </span>
            {data.categories && data.categories.map((cat, idx) => <span key={idx} className={`text-xs px-4 py-2 rounded-2xl font-bold text-white ${getcategorybadgecolor(cat)}`}>
                {cat}
              </span>)}
          </div>
          <p className={`text-sm mb-2 text-[var(--admin-text-faint)]`}>
            By {data.author}
          </p>
          <p className={`text-sm text-[var(--admin-text-faint)]`}>
            {data.start} – {data.isUnfinished ? "Unfinished" : data.end}
          </p>
          {data.status === "Scheduled" && data.scheduleDate && <p className={`text-sm font-bold mt-2 ${isdarkmode ? "text-orange-400" : "text-orange-600"}`}>
              Scheduled for: {data.scheduleDate} at {data.scheduleTime}
            </p>}
        </div>

        {
    /* Challenge Section */
  }
        {data.challenge && <div className="mb-8">
            <h4 className={`text-xl font-bold mb-4 text-[var(--admin-text)]`}>
              Challenge
            </h4>
            <p className={`text-sm p-6 rounded-2xl whitespace-pre-wrap ${isdarkmode ? "bg-red-900/10 text-gray-400" : "bg-red-50 text-gray-600"}`}>
              {data.challenge}
            </p>
          </div>}

        {
    /* Solution Section */
  }
        {data.solution && <div className="mb-8">
            <h4 className={`text-xl font-bold mb-4 text-[var(--admin-text)]`}>
              Solution
            </h4>
            <p className={`text-sm p-6 rounded-2xl whitespace-pre-wrap ${isdarkmode ? "bg-emerald-900/10 text-gray-400" : "bg-emerald-50 text-gray-600"}`}>
              {data.solution}
            </p>
          </div>}

        {
    /* Result Section */
  }
        {data.result && <div className="mb-8">
            <h4 className={`text-xl font-bold mb-4 text-[var(--admin-text)]`}>
              Result
            </h4>
            <p className={`text-sm p-6 rounded-2xl whitespace-pre-wrap ${isdarkmode ? "bg-blue-900/10 text-gray-400" : "bg-blue-50 text-gray-600"}`}>
              {data.result}
            </p>
          </div>}

        {
    /* Content Sections */
  }
        <div className="mb-8">
          <h4 className={`text-xl font-bold mb-4 text-[var(--admin-text)]`}>
            Content Sections
          </h4>
          {[1, 2, 3, 4, 5].map((num) => {
    const topic = data[`topic${num}`];
    const content = data[`content${num}`];
    if (!topic && !content) return null;
    return <div key={num} className={`mb-6 p-6 rounded-2xl bg-[var(--admin-bg-soft)]`}>
                {topic && <h5 className={`text-lg font-bold mb-2 text-[var(--admin-text)]`}>
                    {topic}
                  </h5>}
                {content && <p className={`text-sm whitespace-pre-wrap text-[var(--admin-text-sub)]`}>
                    {content}
                  </p>}
              </div>;
  })}
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
    onClick={handleEdit}
    className={`px-8 py-3 rounded-2xl font-bold transition-colors ${isdarkmode ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-orange-600 text-white hover:bg-orange-700"}`}
  >
            Edit Case Study
          </button>
          <button
    onClick={onClose}
    className="px-8 py-3 bg-[var(--admin-accent)] text-white rounded-2xl font-bold hover:bg-[var(--admin-accent-hover)] transition-colors"
  >
            Close Preview
          </button>
        </div>
      </div>
    </div>;
};
export {
  PreviewModal
};
