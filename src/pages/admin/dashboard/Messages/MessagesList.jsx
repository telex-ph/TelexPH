import { useState, useEffect, useMemo } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import api from "@/lib/api/axios";

const poppins = { fontFamily: "'Poppins', sans-serif" };

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesList() {
  const { isdarkmode } = useDarkMode();
  const dm = isdarkmode;

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/contact-messages");
      setMessages(response.data);
    } catch (err) {
      console.error("[Messages] fetchMessages error:", err);
      setError("Unable to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === "unread") {
      try {
        await api.patch(`/contact-messages/${msg._id}/read`);
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m)));
        setSelected((prev) => (prev && prev._id === msg._id ? { ...prev, status: "read" } : prev));
      } catch (err) {
        console.error("[Messages] markAsRead error:", err);
      }
    }
  };

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchStatus = filterStatus === "all" || m.status === filterStatus;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [messages, filterStatus, searchQuery]);

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="flex flex-col items-start justify-start p-8 space-y-6 min-h-screen bg-transparent" style={poppins}>
      <div className="w-full flex justify-between items-end px-2">
        <div className="space-y-2">
          <h2 className="text-xl leading-none tracking-tight font-bold" style={{ color: dm ? "#f3f4f6" : "#4a5565" }}>
            Contact Admin Messages
          </h2>
          <p className="text-[11px] tracking-wide italic text-gray-400">
            Messages sent by users who couldn&apos;t log in via the &quot;Contact Admin&quot; form.
          </p>
        </div>
        {unreadCount > 0 && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl text-white"
            style={{ background: "#800000" }}
          >
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="w-full mt-6">
        <div className="px-2 mb-6 flex flex-wrap justify-between items-center gap-3">
          <div className="inline-flex items-center rounded-full p-[3px] gap-[2px]" style={{
            background: dm ? "rgba(128,0,0,0.2)" : "rgba(128,0,0,0.08)",
            boxShadow: dm
              ? "inset 0 1px 4px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(128,0,0,0.25)"
              : "inset 0 1px 3px rgba(128,0,0,0.12), inset 0 0 0 1px rgba(128,0,0,0.1)",
          }}>
            {["all", "unread", "read"].map((key) => {
              const isActive = filterStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className="capitalize"
                  style={{
                    ...poppins,
                    fontSize: "11px",
                    fontWeight: isActive ? 600 : 500,
                    padding: "6px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isActive ? "#800000" : "transparent",
                    color: isActive ? "#ffffff" : dm ? "#e5e7eb" : "#111827",
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>

          <div className="relative flex items-center bg-white rounded-full px-6 py-2.5 w-64 shadow-sm border border-gray-100"
            style={dm ? { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" } : undefined}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 flex-shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-[11px] outline-none w-full ml-3 placeholder:text-gray-400"
              style={{ color: dm ? "#f3f4f6" : "#1f2937" }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-xl px-4 py-3 mb-4">{error}</div>
        )}

        {isLoading ? (
          <div className="bg-white p-20 rounded-2xl text-center border border-gray-50" style={dm ? { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" } : undefined}>
            <p className="text-[11px] text-gray-300 tracking-widest uppercase font-bold italic">loading messages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl text-center border border-gray-50" style={dm ? { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" } : undefined}>
            <p className="text-[11px] text-gray-300 tracking-widest uppercase font-bold italic">no messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg) => (
              <button
                key={msg._id}
                onClick={() => openMessage(msg)}
                className="w-full text-left bg-white border border-gray-50 rounded-2xl p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
                style={{
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  ...(dm ? { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" } : {}),
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: msg.status === "unread" ? "#800000" : "transparent", border: msg.status === "unread" ? "none" : "2px solid #e5e7eb" }}
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm truncate" style={{ fontWeight: msg.status === "unread" ? 700 : 500, color: dm ? "#f3f4f6" : "#111827" }}>
                      {msg.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-1">{msg.email}</p>
                  <p className="text-[12px] text-gray-500 line-clamp-1">{msg.message}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            style={dm ? { background: "#1f1f23" } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="px-8 pt-10 pb-8">
              <p className="text-xs font-semibold text-[#800000] tracking-widest uppercase mb-1">Contact Admin message</p>
              <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: dm ? "#f3f4f6" : "#111827" }}>{selected.name}</h2>
              <p className="text-gray-400 text-sm mb-1">{selected.email}</p>
              <p className="text-gray-400 text-[11px] mb-6">{formatDate(selected.createdAt)}</p>
              <div className="rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: dm ? "rgba(255,255,255,0.05)" : "#f9fafb", color: dm ? "#e5e7eb" : "#374151" }}
              >
                {selected.message}
              </div>
              <a
                href={`mailto:${selected.email}`}
                className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-[#800000] text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#600000] transition-all shadow-xl shadow-[#800000]/20 active:scale-[0.98]"
              >
                Reply via email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
