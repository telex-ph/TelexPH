'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock, Mail, KeyRound, Check } from 'lucide-react'
import { getForgotPasswordUrl, getResetPasswordUrl } from '@/lib/api-base'

type Step = 'email' | 'reset' | 'done'

export default function VaForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch(getForgotPasswordUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accountType: 'va' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }
      setStep('reset')
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.trim().length < 6) {
      setError('Please enter the 6-digit code sent to you.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(getResetPasswordUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.trim(), newPassword, accountType: 'va' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }
      setStep('done')
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} className="hidden md:block" />
      <div style={styles.blob2} className="hidden md:block" />

      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <Lock size={18} color="#fff" />
            </div>
            <span style={styles.brandName}>VAportal</span>
            <span style={styles.brandBadge}>Secure</span>
          </div>

          {step === 'email' && (
            <>
              <h1 style={styles.heading}>Reset your password</h1>
              <p style={styles.subhead}>Enter your email and we&apos;ll send you a verification code.</p>
              {error && <p style={styles.errorInline}>{error}</p>}

              <form onSubmit={handleSendCode} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Email address</label>
                  <div style={styles.inputWrap}>
                    <Mail size={15} style={styles.inputIcon} />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      style={{ ...styles.input, paddingLeft: 40 }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} style={{ ...styles.submitBtn, opacity: isLoading ? 0.65 : 1 }}>
                  {isLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> Sending...</>
                  ) : 'Send Verification Code'}
                </button>

                <button type="button" onClick={() => router.push('/VirtualAssistant/login')} style={styles.linkBtn}>
                  Back to sign in
                </button>
              </form>
            </>
          )}

          {step === 'reset' && (
            <>
              <h1 style={styles.heading}>Enter verification code</h1>
              <p style={styles.subhead}>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below with your new password.
              </p>
              {error && <p style={styles.errorInline}>{error}</p>}

              <form onSubmit={handleResetPassword} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Verification code</label>
                  <div style={styles.inputWrap}>
                    <KeyRound size={15} style={styles.inputIcon} />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                      disabled={isLoading}
                      style={{ ...styles.input, paddingLeft: 40, letterSpacing: '0.3em', textAlign: 'center' }}
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>New password</label>
                  <div style={styles.inputWrap}>
                    <Lock size={15} style={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ ...styles.input, paddingLeft: 40, paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={styles.eyeBtn}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Confirm new password</label>
                  <div style={styles.inputWrap}>
                    <Lock size={15} style={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ ...styles.input, paddingLeft: 40 }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} style={{ ...styles.submitBtn, opacity: isLoading ? 0.65 : 1 }}>
                  {isLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> Resetting...</>
                  ) : 'Reset Password'}
                </button>

                <button type="button" onClick={() => setStep('email')} style={styles.linkBtn}>
                  Use a different email
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <>
              <div style={styles.successIcon}>
                <Check size={26} color="#fff" strokeWidth={3} />
              </div>
              <h1 style={styles.heading}>Password reset</h1>
              <p style={styles.subhead}>
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <button type="button" onClick={() => router.push('/VirtualAssistant/login')} style={styles.submitBtn}>
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0000',
    position: 'relative',
    overflow: 'hidden',
    padding: 24,
  },
  blob1: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(160,0,0,0.4) 0%, transparent 70%)',
    top: -160,
    left: -120,
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,0,0,0.35) 0%, transparent 70%)',
    bottom: -100,
    right: -80,
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid rgba(139,0,0,0.25)',
  },
  left: {
    background: '#fff',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: '#800000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 15,
    fontWeight: 500,
    color: '#1a0000',
    letterSpacing: '-0.3px',
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: '#fff0f0',
    color: '#800000',
    borderRadius: 4,
    padding: '2px 7px',
    border: '1px solid #f5caca',
  },
  heading: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1a0000',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
    marginBottom: 8,
  },
  subhead: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  errorInline: {
    fontSize: 12,
    fontWeight: 600,
    color: '#dc2626',
    marginTop: -12,
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#800000',
    marginBottom: 6,
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#c4a0a0',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid #f0e8e8',
    background: '#fdf8f8',
    fontSize: 14,
    color: '#1a0000',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ccc',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: 13,
    background: '#800000',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.06em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
    cursor: 'pointer',
  },
  linkBtn: {
    fontSize: 13,
    fontWeight: 500,
    color: '#800000',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'center',
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#800000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
}
