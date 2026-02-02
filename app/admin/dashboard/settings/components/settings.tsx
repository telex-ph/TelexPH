'use client'

import React, { useState } from 'react'

export default function AdminSettings() {
  const [activetab, setactivetab] = useState('profile')

  return ( 
    <div className="flex flex-col items-start justify-start p-4 space-y-4 min-h-screen bg-[#f8f9fa] dark:bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; text-transform: none; font-weight: 400 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto space-y-6 overflow-y-auto">

      <div className="space-y-2 px-2">
        <h2 className="text-xl leading-none tracking-tight font-bold" style={{ color: '#4a5565' }}>
            Admin Control Center
        </h2>
        <p className="text-[11px] tracking-wide italic text-gray-400 dark:text-gray-500">
            Manage Your Administrative Profile And System Security Credentials.
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Settings Navigation Panel */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white dark:bg-transparent p-3 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
              <button 
                onClick={() => setactivetab('profile')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${activetab === 'profile' ? 'bg-[#800000] text-white shadow-lg shadow-[#800000]/20' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-xs">Profile Info</span>
              </button>
              
              <button 
                onClick={() => setactivetab('password')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all mt-1.5 ${activetab === 'password' ? 'bg-[#800000] text-white shadow-lg shadow-[#800000]/20' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span className="text-xs">Security</span>
              </button>
            </div>

            <div className="bg-white/50 dark:bg-transparent p-5 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center italic leading-relaxed">
                All Changes Made To Admin Profiles Are Logged For Security Auditing Purposes.
              </p>
            </div>
          </div>

          {/* Settings Form Panel */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-transparent p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm min-h-[550px]">
              {activetab === 'profile' ? (
                <div className="animate-in fade-in duration-500">
                  
                  {/* Profile Photo Header */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-gray-50/50 dark:bg-white/5 p-6 rounded-[1.5rem] border border-gray-100/50 dark:border-white/5">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-[#800000] flex items-center justify-center text-white text-2xl overflow-hidden shadow-inner">
                        Aj
                      </div>
                      <div className="absolute bottom-0 right-0 bg-[#800000] p-1.5 rounded-full border-2 border-white dark:border-transparent text-white shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button className="px-5 py-2 bg-[#800000] text-white rounded-lg text-[10px] hover:opacity-90 transition-all shadow-md shadow-[#800000]/10">Upload New Photo</button>
                        <button className="px-5 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 rounded-lg text-[10px] hover:bg-gray-50 dark:hover:bg-white/10 transition-all">Remove</button>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600 italic">Recommended Size: 400x400px. Formats: Jpg, Png.</p>
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">First Name</label>
                      <input type="text" defaultValue="Alex" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none focus:ring-1 ring-[#800000]/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Last Name</label>
                      <input type="text" defaultValue="Johnson" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none focus:ring-1 ring-[#800000]/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Admin Email</label>
                      <input type="email" defaultValue="Alex.Admin@Telex.Com" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none focus:ring-1 ring-[#800000]/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Phone Number</label>
                      <input type="text" defaultValue="+63 912 345 6789" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none focus:ring-1 ring-[#800000]/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Department</label>
                      <input type="text" defaultValue="System Management" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none focus:ring-1 ring-[#800000]/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Assigned Role</label>
                      <div className="w-full p-3.5 bg-gray-100/50 dark:bg-white/5 rounded-xl text-[12px] text-[#800000] dark:text-[#cc0000]">
                        Super Administrator
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Residential Address</label>
                      <textarea rows={2} defaultValue="123 Tech Street, Central District, Guimba" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none resize-none focus:ring-1 ring-[#800000]/20" />
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-50 dark:border-white/10 flex justify-end">
                    <button className="px-10 py-3.5 bg-[#800000] text-white rounded-xl text-[11px] shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-all active:scale-95">
                      Save Admin Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500 max-w-md">
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">New Secure Password</label>
                      <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 dark:text-gray-500 px-1 uppercase tracking-widest">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[12px] text-gray-600 dark:text-white outline-none" />
                    </div>
                    <div className="pt-4">
                      <button className="px-10 py-3.5 bg-[#800000] text-white rounded-xl text-[11px] shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-all">
                        Update Security
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}