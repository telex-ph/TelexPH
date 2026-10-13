
import { useState } from "react";
import Link from "next/link";
import { getForgotPasswordUrl, getResetPasswordUrl } from "@/lib/api-base";
import { Alert, AuthCard, Field, Header, Icon, LinkButton, OtpInput, PasswordToggle, StrengthMeter, SubmitButton, useCooldown } from "../AuthUi";
const STEPS = ["Email", "Verify", "Done"];
function StepDots({ current }) {
  return <ol className="flex items-center gap-2 mb-6" aria-label="Progress">
      {STEPS.map((label, i) => <li key={label} className="flex items-center gap-2 flex-1 last:flex-none" aria-current={i === current ? "step" : void 0}>
          <span className={`w-6 h-6 rounded-full text-[11px] font-bold font-poppins flex items-center justify-center transition-colors ${i <= current ? "text-white" : "bg-gray-100 text-gray-400"}`} style={i <= current ? { background: "var(--brand-red)" } : void 0}>
            {i < current ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
          </span>
          <span className={`text-xs font-semibold font-poppins ${i <= current ? "text-gray-800" : "text-gray-400"}`}>{label}</span>
          {i < STEPS.length - 1 && <span className="flex-1 h-px bg-gray-200 relative overflow-hidden"><span className="absolute inset-0 transition-transform duration-500 origin-left" style={{ background: "var(--brand-red)", transform: `scaleX(${i < current ? 1 : 0})` }} /></span>}
        </li>)}
    </ol>;
}
function ForgotPasswordPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLeft, startResendCooldown] = useCooldown(30);
  const sendCode = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(getForgotPasswordUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accountType: "admin" })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return false;
      }
      startResendCooldown();
      return true;
    } catch {
      setError("Unable to reach the server. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (await sendCode()) setStep("reset");
  };
  const handleResend = async () => {
    setOtp("");
    await sendCode();
  };
  const mismatch = confirmPassword !== "" && newPassword !== confirmPassword;
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(getResetPasswordUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, accountType: "admin" })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStep("done");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const toggle = <PasswordToggle shown={showPassword} onClick={() => setShowPassword((v) => !v)} />;
  return <AuthCard>
      <StepDots current={step === "email" ? 0 : step === "reset" ? 1 : 3} />

      {step === "email" && <div className="animate-fade-in-up">
          <Header eyebrow="Forgot password?" title="Reset your password" subtitle="Enter your admin email and we'll send you a 6-digit verification code." />
          <form onSubmit={handleSendCode} className="space-y-4">
            <Alert>{error}</Alert>
            <Field
    id="reset-email"
    label="Email"
    icon="mail"
    type="email"
    placeholder="you@example.com"
    autoComplete="email"
    autoFocus
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    disabled={isLoading}
  />
            <SubmitButton loading={isLoading} loadingText="Sending...">Send Verification Code</SubmitButton>
            <div className="text-center pt-1">
              <LinkButton as={Link} href="/admin/login" className="inline-flex items-center gap-1.5">
                <Icon name="back" className="w-3.5 h-3.5" />
                Back to sign in
              </LinkButton>
            </div>
          </form>
        </div>}

      {step === "reset" && <div className="animate-fade-in-up">
          <Header eyebrow="Check your email" title="Enter verification code" subtitle={<>We sent a 6-digit code to <span className="font-semibold text-gray-700 break-all">{email}</span>. Enter it below with your new password.</>} />
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Alert>{error}</Alert>
            <div>
              <span className="block text-[13px] font-semibold text-gray-700 mb-1.5 ml-0.5 font-poppins">Verification code</span>
              <OtpInput value={otp} onChange={setOtp} disabled={isLoading} autoFocus invalid={!!error && otp.length < 6} />
              <p className="text-xs text-gray-500 mt-2 ml-0.5 font-open-sans">
                Didn&apos;t get it?{" "}
                <LinkButton onClick={handleResend} disabled={isLoading || resendLeft > 0} className="text-xs">
                  {resendLeft > 0 ? `Resend in ${resendLeft}s` : "Resend code"}
                </LinkButton>
              </p>
            </div>
            <div>
              <Field
    id="new-password"
    label="New password"
    icon="lock"
    type={showPassword ? "text" : "password"}
    placeholder="At least 8 characters"
    autoComplete="new-password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    disabled={isLoading}
    right={toggle}
  />
              <StrengthMeter password={newPassword} />
            </div>
            <div>
              <Field
    id="confirm-password"
    label="Confirm new password"
    icon="lock"
    type={showPassword ? "text" : "password"}
    placeholder="Re-enter your password"
    autoComplete="new-password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    disabled={isLoading}
    aria-invalid={mismatch}
    className={mismatch ? "!border-red-400" : ""}
  />
              {mismatch && <p className="text-[11px] text-red-600 font-semibold mt-1.5 ml-0.5">Passwords do not match.</p>}
            </div>
            <SubmitButton loading={isLoading} loadingText="Resetting..." disabled={otp.length < 6 || !newPassword || mismatch}>Reset Password</SubmitButton>
            <div className="text-center pt-1">
              <LinkButton onClick={() => {
    setError("");
    setOtp("");
    setStep("email");
  }}>Use a different email</LinkButton>
            </div>
          </form>
        </div>}

      {step === "done" && <div className="text-center md:text-left animate-fade-in-up">
          <div className="animate-pop-in mx-auto md:mx-0 mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--admin-success-bg)", color: "var(--admin-success)" }}>
            <Icon name="check" className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl sm:text-[28px] leading-tight font-black tracking-tight mb-2 font-poppins text-gray-900">Password updated</h1>
          <p className="text-gray-500 text-sm leading-relaxed font-open-sans mb-6">
            Your password has been changed. Sign in with your new password to continue.
          </p>
          <Link
    href="/admin/login"
    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide text-white font-poppins transition-all shadow-[0_10px_24px_-10px_rgba(161,0,0,0.7)] hover:-translate-y-0.5 active:scale-[0.98]"
    style={{ background: "linear-gradient(135deg, var(--brand-red), var(--brand-maroon))" }}
  >
            Back to Sign In
            <Icon name="arrow" className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>}
    </AuthCard>;
}
export {
  ForgotPasswordPage as default
};
