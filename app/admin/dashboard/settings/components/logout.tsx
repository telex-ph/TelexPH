'use client'

import { useRouter } from 'next/navigation'

interface logoutprops {
  isdarkmode: boolean
}

export default function Logout({ isdarkmode }: logoutprops) {
  const router = useRouter()

  const handlelogout = () => {
    router.push('/login')
  }

  return (
    <button 
      onClick={handlelogout}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-widest transition-all border-none bg-transparent cursor-pointer text-left ${
        isdarkmode 
          ? 'text-red-400 hover:bg-white/5' 
          : 'text-red-600 hover:bg-red-50'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      logout
    </button>
  )
}