
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AtSign, MessageSquare, Send, ShieldCheck, User } from "lucide-react";
import { COLORS, FONTS, FONT_WEIGHTS } from "@/constant/styles";
import { getApiBaseUrl } from "@/lib/api-base";
import { getOrCreateVisitorSessionId, setVisitorEmail } from "@/lib/page-view-session";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setStatus("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!RECAPTCHA_SITE_KEY) {
      setStatus("\u26A0\uFE0F reCAPTCHA is not configured. Cannot submit form.");
      return;
    }
    if (!recaptchaToken) {
      setStatus(
        "\u26A0\uFE0F Please complete the reCAPTCHA challenge before submitting."
      );
      return;
    }
    setIsSubmitting(true);
    setStatus("");
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("g-recaptcha-response", recaptchaToken);
    try {
      const response = await fetch("https://getform.io/f/akkpvmva", {
        method: "POST",
        body: formDataToSend
      });
      if (response.ok) {
        setVisitorEmail(formData.email);
        const sessionId = getOrCreateVisitorSessionId();
        if (sessionId) {
          fetch(`${getApiBaseUrl()}/page-views/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: typeof window !== "undefined" ? window.location.pathname : "/contact",
              referrer: typeof document !== "undefined" ? document.referrer || "" : "",
              sessionId,
              kind: "page",
              email: formData.email
            }),
            credentials: "omit",
            keepalive: true
          }).catch(() => {
          });
        }
        setStatus(
          "\u2705 Your message has been sent successfully! We will contact you shortly."
        );
        setFormData({ name: "", email: "", message: "" });
        setRecaptchaToken(null);
      } else {
        setStatus(
          "\u274C Submission Failed. There was an issue reaching the form server. Please try again."
        );
      }
    } catch (error) {
      setStatus("\u26A0\uFE0F Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const inputStyle = `w-full pl-11 pr-4 py-3 text-sm border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[#a10000]/20 focus:border-[#a10000] focus:outline-none transition placeholder-gray-400`;
  const iconStyle = "pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-[#a10000]";
  return <div
    className="h-full p-8 lg:p-12"
    style={{ backgroundColor: COLORS.white }}
  >
      <div className="mb-8">
        <h3
    className="text-2xl tracking-tight"
    style={{
      fontFamily: FONTS.poppins,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.black
    }}
  >
          Send us a message
        </h3>
        <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: FONTS.rubik }}>
          Fill out the form and our team will get back to you.
        </p>
      </div>

      <form
    action="https://services.leadconnectorhq.com/hooks/KlBL9XEG0eVNlAqE7m5V/webhook-trigger/c44f7f42-a284-4852-be0d-f263777767ef"
    method="POST"
    onSubmit={handleSubmit}
    className="space-y-5"
    encType="multipart/form-data"
  >
        <div className="group relative">
          <User aria-hidden className={iconStyle} />
          <input
    type="text"
    name="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
    required
    className={inputStyle}
  />
        </div>
        <div className="group relative">
          <AtSign aria-hidden className={iconStyle} />
          <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    required
    className={inputStyle}
  />
        </div>

        <div className="group relative">
          <MessageSquare aria-hidden className={iconStyle} />
          <textarea
    name="message"
    placeholder="Your Message or Inquiry"
    value={formData.message}
    onChange={handleChange}
    required
    rows={5}
    className={`${inputStyle} resize-none`}
  />
        </div>

        <div className="pt-2">
          {RECAPTCHA_SITE_KEY ? <ReCAPTCHA
    sitekey={RECAPTCHA_SITE_KEY}
    onChange={handleRecaptchaChange}
  /> : <p className="text-red-600 text-sm">
              ⚠️ reCAPTCHA key is missing. Please contact support.
            </p>}
        </div>

        <button
    type="submit"
    disabled={isSubmitting || !recaptchaToken || !RECAPTCHA_SITE_KEY}
    className={`w-full text-white font-semibold py-3.5 px-6 rounded-lg transition duration-300 ${isSubmitting || !recaptchaToken || !RECAPTCHA_SITE_KEY ? "bg-gray-400 cursor-not-allowed" : "bg-[#a10000] hover:bg-[#8a0000] active:scale-[0.99]"}`}
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold }}
  >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting ? "Sending..." : <>Send Message <Send className="h-4 w-4" /></>}
          </span>
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500" style={{ fontFamily: FONTS.rubik }}>
          <ShieldCheck className="h-3.5 w-3.5" /> Your details are safe with us.
        </p>

        {status && <p
    className={`text-center text-sm pt-2 ${status.startsWith("\u2705") ? "text-green-600" : "text-red-600"}`}
    style={{ fontFamily: FONTS.poppins }}
  >
            {status}
          </p>}
      </form>
    </div>;
};
var stdin_default = ContactForm;
export {
  stdin_default as default
};
