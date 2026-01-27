'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function loginpage() {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const handlelogin = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`email: ${email}\npassword: ${password}`)
  }

  return (
    <div className="h-screen w-full relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black">
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

      <div className="relative z-10 w-full max-w-6xl h-full max-h-[650px] bg-white/95 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-white/20">

        <div className="w-full md:w-1/2 px-6 py-8 sm:px-12 md:px-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-[#800000] tracking-tight mb-2 uppercase">
                welcome back
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handlelogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-[#800000] uppercase tracking-widest mb-1.5 ml-1">
                  email address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-5 py-3.5 bg-gray-50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#800000] focus:bg-white outline-none transition-all text-gray-800 border border-gray-200 text-sm shadow-sm"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
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
                  className="w-full px-5 py-3.5 bg-gray-50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#800000] focus:bg-white outline-none transition-all text-gray-800 border border-gray-200 text-sm shadow-sm"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-[#800000] rounded cursor-pointer" />
                  <span className="group-hover:text-[#800000] transition-colors font-bold">remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="font-bold text-[#800000] hover:text-[#a00000] transition-colors"
                >
                  forgot?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800000] text-white py-4 rounded-xl sm:rounded-2xl font-black text-base uppercase tracking-widest hover:bg-[#600000] transition-all shadow-[0_15px_30px_rgba(128,0,0,0.35)] active:scale-[0.98]"
              >
                sign in
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-bold">
                new here?{' '}
                <Link href="/register" className="text-[#800000] font-black hover:underline underline-offset-4 ml-1">
                  create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-[#fdfdfd] relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gray-100 rounded-full blur-3xl" />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              
              <div className="relative w-48 h-80 bg-[#2b3990] rounded-[2rem] transform rotate-x-[25deg] rotate-z-[-20deg] shadow-[30px_30px_60px_rgba(0,0,0,0.2)] flex flex-col p-3 border-r-[15px] border-b-[10px] border-[#1e2a78]">
                <div className="w-full h-full bg-[#f4f7ff] rounded-[1.5rem] p-4 flex flex-col space-y-4">
                  <div className="w-12 h-12 bg-[#e91e63] rounded-full mx-auto flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <div className="w-full h-10 bg-gray-200 rounded-md" />
                  <div className="w-full h-10 bg-gray-200 rounded-md" />
                  <div className="w-full h-10 bg-[#e91e63] rounded-md shadow-lg flex items-center justify-center text-[10px] text-white font-black">LOGIN</div>
                </div>
              </div>

              <div className="absolute top-10 left-4 w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center transform translate-z-10 border-b-8 border-gray-100">
                <div className="w-12 h-12 bg-[#e91e63] rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg>
                </div>
              </div>

              <div className="absolute bottom-4 right-0 w-32 h-48 z-20 flex flex-col items-center">
                <div className="w-12 h-12 bg-black rounded-full mb-[-5px]" />
                <div className="w-full h-full bg-[#e91e63] rounded-t-[50%] rounded-b-lg shadow-xl" />
                <div className="absolute top-1/2 -left-6 w-12 h-4 bg-black rounded-full rotate-[-20deg]" />
              </div>

              <div className="absolute top-0 right-10 text-gray-300 animate-pulse">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </div>
              <div className="absolute bottom-20 left-0 w-16 h-16 border-4 border-[#e91e63]/20 rounded-full" />
            </div>

            <div className="mt-8 text-center max-w-sm">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                easy & secure access
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-2">
                a modern way to manage your credentials with top-tier encryption and speed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}