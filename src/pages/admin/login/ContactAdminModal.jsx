import { useState } from "react";
import { getContactAdminUrl } from "@/lib/api-base";

export default function ContactAdminModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(getContactAdminUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDuration: "0.15s" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden font-open-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="px-8 pt-10 pb-8">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#800000]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <h2 className="text-xl font-bold text-[#800000] tracking-tight mb-2 font-poppins">
                Message sent
              </h2>
              <p className="text-gray-400 text-sm font-normal font-open-sans mb-6">
                Your message has been sent to the administrator. They&apos;ll get back to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#800000] text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#600000] transition-all shadow-xl shadow-[#800000]/20 active:scale-[0.98] font-poppins"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#800000] tracking-widest uppercase mb-1 font-poppins">
                  Need help?
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-2 font-poppins">
                  Contact <span className="text-[#800000]">Admin</span>
                </h2>
                <p className="text-gray-400 text-sm font-normal font-open-sans">
                  Having trouble logging in? Send a message to the system administrator and they&apos;ll follow up with you.
                </p>
                {error && (
                  <p role="alert" className="text-red-500 text-xs mt-2 font-bold tracking-tight">{error}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-admin-name" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 font-poppins">
                    Your name
                  </label>
                  <input
                    id="contact-admin-name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="contact-admin-email" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 font-poppins">
                    Your email
                  </label>
                  <input
                    id="contact-admin-email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="contact-admin-message" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 font-poppins">
                    Message
                  </label>
                  <textarea
                    id="contact-admin-message"
                    placeholder="Describe the issue you're having..."
                    rows={4}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#800000] text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#600000] transition-all shadow-xl shadow-[#800000]/20 active:scale-[0.98] mt-2 font-poppins flex items-center justify-center gap-2 ${isLoading ? "opacity-70" : ""}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Sending...
                    </>
                  ) : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
