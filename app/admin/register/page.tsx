'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`name: ${name}\nemail: ${email}\npassword: ${password}`)
  }

  return (
    <div className="h-screen w-full relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black">
      {/* background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.webp"
          alt="background"
          fill
          className="object-cover brightness-[0.5] contrast-[1.1]"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#800000]/30" />
      </div>

      {/* main card */}
      <div className="relative z-10 w-full max-w-6xl h-full max-h-[650px] bg-white/95 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-white/20">

        {/* left – form */}
        <div className="w-full md:w-1/2 px-6 py-8 sm:px-12 md:px-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-[#800000] tracking-tight mb-2 uppercase">
                create account
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                fill in your details to get started.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-[#800000] uppercase tracking-widest mb-1.5 ml-1">
                  full name
                </label>
                <input
                  type="text"
                  placeholder="john doe"
                  className="w-full px-5 py-3 bg-gray-50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#800000] focus:bg-white outline-none transition-all text-gray-800 border border-gray-200 text-sm shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#800000] uppercase tracking-widest mb-1.5 ml-1">
                  email address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-5 py-3 bg-gray-50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#800000] focus:bg-white outline-none transition-all text-gray-800 border border-gray-200 text-sm shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#800000] uppercase tracking-widest mb-1.5 ml-1">
                  password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-3 bg-gray-50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#800000] focus:bg-white outline-none transition-all text-gray-800 border border-gray-200 text-sm shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#800000] text-white py-4 rounded-xl sm:rounded-2xl font-black text-base uppercase tracking-widest hover:bg-[#600000] transition-all shadow-[0_15px_30px_rgba(128,0,0,0.35)] active:scale-[0.98] mt-2"
              >
                register
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-bold">
                already have an account?{' '}
                <Link href="/admin/login" className="text-[#800000] font-black hover:underline underline-offset-4 ml-1">
                  sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* right – branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#800000] to-[#4a0000] relative p-12 lg:p-16 items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 w-full">
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 mb-8 drop-shadow-2xl">
              <Image
                src="/images/log0.png"
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tighter">
              join the <br /> 
              <span className="text-white/60">future of testing</span>
            </h2>
            <p className="text-white/80 text-sm lg:text-lg leading-relaxed mb-10 max-w-sm font-medium">
              start your journey today and experience a platform built for your success.
            </p>
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl max-w-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#800000] flex items-center justify-center text-lg font-black shadow-lg">a+</div>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-tight">join 10k+ users</p>
                  <p className="text-white/50 text-[10px] font-medium italic">trusted worldwide</p>
                </div>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}