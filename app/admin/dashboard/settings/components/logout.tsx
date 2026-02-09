'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface logoutprops {
  isdarkmode: boolean
}

export default function Logout({ isdarkmode }: logoutprops) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handlelogout = async () => {
    if (isLoggingOut) return // Prevent multiple clicks
    
    try {
      setIsLoggingOut(true)
      
      // Call the logout API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important: includes cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Successfully logged out on server
        // Redirect to login page
        router.push('/admin/login')
        router.refresh() // Force refresh to clear any cached data
      } else {
        // Even if server fails, still redirect (token might be expired)
        console.error('Logout failed on server, but redirecting anyway')
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even on error, redirect to login
      router.push('/admin/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button 
      onClick={handlelogout}
      disabled={isLoggingOut}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-widest transition-all border-none bg-transparent cursor-pointer text-left ${
        isdarkmode 
          ? 'text-red-400 hover:bg-white/5' 
          : 'text-red-600 hover:bg-red-50'
      } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isLoggingOut ? 'Logging out...' : 'logout'}
    </button>
  )
}