
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Loader2, XCircle } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_ORIGIN || "/api";
function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [pageState, setPageState] = useState("loading");
  const [vaName, setVaName] = useState("");
  const [vaEmail, setVaEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];
  useEffect(() => {
    if (!token) {
      setPageState("invalid");
      return;
    }
    fetch(`${API_BASE}/api/va-users/activate?token=${token}`).then((r) => r.json()).then((data) => {
      if (data.valid) {
        setVaName(`${data.firstName} ${data.lastName}`);
        setVaEmail(data.email);
        setPageState("valid");
      } else {
        setPageState("invalid");
      }
    }).catch(() => setPageState("invalid"));
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 2) {
      setError("Please use a stronger password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/va-users/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Activation failed.");
        return;
      }
      setPageState("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (pageState === "loading") {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#000000 100%)" }}>
        <div className="text-center">
          <Loader2 size={40} color="white" className="animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm">Verifying your activation link…</p>
        </div>
      </div>;
  }
  if (pageState === "invalid") {
    return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#000000 100%)" }}>
        <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl text-center p-10">
          <XCircle size={52} color="#ef4444" className="mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-3">Invalid or Expired Link</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            This activation link is either invalid or has already expired.<br />
            Please contact our support team to request a new link.
          </p>
          <button
      onClick={() => router.push("/VirtualAssistant/login")}
      className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide transition-opacity hover:opacity-90"
      style={{ background: "#8B0000" }}
    >
            Go to Login
          </button>
        </div>
      </div>;
  }
  if (pageState === "success") {
    return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#000000 100%)" }}>
        <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl text-center p-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#fdf2f2" }}>
            <ShieldCheck size={40} color="#8B0000" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Activated!</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            Your VA account has been successfully activated.
          </p>
          <p className="text-sm font-semibold mb-8" style={{ color: "#8B0000" }}>{vaEmail}</p>
          <button
      onClick={() => router.push("/VirtualAssistant/login")}
      className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide transition-opacity hover:opacity-90 active:opacity-80"
      style={{ background: "#8B0000" }}
    >
            Proceed to Login →
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#000000 100%)" }}>
      <div className="w-full max-w-[820px] bg-white rounded-[20px] overflow-hidden flex flex-col md:flex-row shadow-2xl">

        {
    /* LEFT — Form */
  }
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "#fdf2f2" }}>
            <ShieldCheck size={24} color="#8B0000" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "#8B0000" }}>
            Activate Your Account
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-1">
            Welcome, <span className="font-semibold text-gray-600">{vaName}</span>
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Set a strong password to complete your registration.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-0">

            {
    /* Email (readonly) */
  }
            <label className="text-[13px] font-semibold mb-1.5" style={{ color: "#8B0000" }}>Email Address</label>
            <input
    type="email"
    value={vaEmail}
    readOnly
    className="w-full px-4 py-3 rounded-lg text-sm text-gray-400 mb-4 border-[1.5px] border-transparent outline-none cursor-default"
    style={{ background: "#f0f4fa" }}
  />

            {
    /* Password */
  }
            <label className="text-[13px] font-semibold mb-1.5" style={{ color: "#8B0000" }}>New Password</label>
            <div className="relative mb-2">
              <input
    type={showPassword ? "text" : "password"}
    required
    placeholder="Minimum 8 characters"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 pr-10 rounded-lg text-sm text-gray-700 outline-none transition-all border-[1.5px] border-transparent focus:border-[#8B0000] focus:bg-white"
    style={{ background: "#f0f4fa" }}
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {
    /* Strength bar */
  }
            {password.length > 0 && <div className="mb-4">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => <div
    key={i}
    className="flex-1 h-1 rounded-full transition-all"
    style={{ background: i <= strength ? strengthColor : "#e5e7eb" }}
  />)}
                </div>
                <p className="text-[11px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</p>
              </div>}

            {
    /* Confirm password */
  }
            <label className="text-[13px] font-semibold mb-1.5" style={{ color: "#8B0000" }}>Confirm Password</label>
            <div className="relative mb-5">
              <input
    type={showConfirm ? "text" : "password"}
    required
    placeholder="Re-enter your password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full px-4 py-3 pr-10 rounded-lg text-sm text-gray-700 outline-none transition-all border-[1.5px] border-transparent focus:border-[#8B0000] focus:bg-white"
    style={{ background: "#f0f4fa" }}
  />
              <button
    type="button"
    onClick={() => setShowConfirm(!showConfirm)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {
    /* Match indicator */
  }
            {confirmPassword.length > 0 && <p className="text-[11px] font-semibold mb-4 -mt-3" style={{ color: password === confirmPassword ? "#22c55e" : "#ef4444" }}>
                {password === confirmPassword ? "\u2713 Passwords match" : "\u2717 Passwords do not match"}
              </p>}

            {
    /* Error */
  }
            {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-[12px] text-red-600 font-medium">{error}</p>
              </div>}

            <button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 flex items-center justify-center gap-2"
    style={{ background: "#8B0000" }}
  >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Activating…</> : "Activate Account"}
            </button>
          </form>
        </div>

        {
    /* RIGHT — Info panel */
  }
        <div className="relative w-full md:w-[300px] flex flex-col justify-center px-8 py-10 gap-6" style={{ background: "#fdf8f8" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#8B0000" }}>Password Requirements</p>
            {[
    ["At least 8 characters", password.length >= 8],
    ["One uppercase letter (A\u2013Z)", /[A-Z]/.test(password)],
    ["One number (0\u20139)", /[0-9]/.test(password)],
    ["One special character (@#$!...)", /[^A-Za-z0-9]/.test(password)]
  ].map(([label, met]) => <div key={label} className="flex items-center gap-2 mb-2">
                <div
    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
    style={{ background: met ? "#dcfce7" : "#f3f4f6", color: met ? "#16a34a" : "#9ca3af" }}
  >
                  {met ? "\u2713" : "\xB7"}
                </div>
                <span className="text-[12px]" style={{ color: met ? "#16a34a" : "#6b7280" }}>{label}</span>
              </div>)}
          </div>

          <div className="rounded-xl p-4" style={{ background: "#fff1f1", border: "1px solid #fecaca" }}>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              🔒 Keep your password secure. Do not share it with anyone, including TelexPH staff.
            </p>
          </div>
        </div>

      </div>
    </div>;
}
function ActivatePage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a0000 0%,#2d0000 50%,#000000 100%)" }}>
        <Loader2 size={40} color="white" className="animate-spin" />
      </div>}>
      <ActivateContent />
    </Suspense>;
}
export {
  ActivatePage as default
};
