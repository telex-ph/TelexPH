'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
 
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Solusyon para sa Hydration Error
  useEffect(() => {
    setMounted(true)
  }, [])
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
 
    try {
      // Naka-point na ito sa Port 3000 (Backend)
      const response = await fetch(`http://localhost:3000/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      })
 
      const data = await response.json()
 
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }
 
      router.push('/dashboard') 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  // Wag mag-render hangga't hindi mounted para iwas mismatch sa fonts
  if (!mounted) return null;
 
  return (
    <div className="h-screen w-full relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Open+Sans:wght@400;500;600&display=swap');
        
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-open-sans { font-family: 'Open Sans', sans-serif; }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0) scale(1.15); }
          50% { transform: translateY(-15px) scale(1.15); }
        }
        .animate-gentle-float {
          animation: gentle-float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.webp"
          alt="background"
          fill
          className="object-cover brightness-[0.4] contrast-[1.1]"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#800000]/30" />
      </div>

      <div className="relative z-10 w-full max-w-5xl h-full max-h-[540px] bg-white rounded-2xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row border border-white/10 font-open-sans">

        <div className="w-full md:w-1/2 px-8 py-6 sm:px-12 md:px-16 flex flex-col justify-center bg-white z-20 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-3xl font-normal text-[#800000] tracking-tight mb-2 uppercase font-poppins">
                welcome back
              </h1>
              <p className="text-gray-400 text-sm font-normal font-open-sans">
                secure verification required. please provide your administrative login details.
              </p>
            </div>

            <form onSubmit={handlelogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#800000] tracking-wider mb-2 ml-1 font-poppins">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@system.com"
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-[#800000] tracking-wider mb-2 ml-1 font-poppins">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer font-open-sans">
                  <input type="checkbox" className="w-4 h-4 accent-[#800000] rounded border-gray-200" />
                  <span className="font-normal">remember me</span>
                </label>
                <Link href="#" className="text-sm font-medium text-[#800000] hover:underline transition-colors font-poppins">
                  forgot password?
                </Link>
              </div>
 
              <button
                type="submit"
                className="w-full bg-[#800000] text-white py-4 rounded-xl font-normal text-sm uppercase tracking-widest hover:bg-[#600000] transition-all shadow-xl shadow-[#800000]/20 active:scale-[0.98] mt-2 font-poppins"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-[#fafafa] relative items-center justify-center border-l border-gray-50 overflow-hidden flex-col">
          
          <div className="relative z-10 w-full h-[65%] flex items-center justify-center p-6">
            <div className="relative w-full h-full scale-[1.15] transition-transform duration-1000 animate-gentle-float">
              <Image 
                src="/images/log.jpg" 
                alt="login illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="relative z-20 text-center px-10 pb-12">
            <p className="text-gray-500 text-sm font-normal max-w-[380px] mx-auto leading-relaxed font-poppins">
              this system is strictly for administrative use. all access attempts are monitored and unauthorized entry is prohibited.
            </p>
          </div>

          <div className="absolute top-10 right-10 w-40 h-40 border border-[#800000]/5 rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-[#800000]/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}