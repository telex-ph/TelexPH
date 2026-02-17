'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '../../layout' // Import the dark mode hook

// Helper functions to map department and role numbers to strings
const getDepartmentName = (dept: number): string => {
  const departments: { [key: number]: string } = {
    1: 'Compliance',
    2: 'Innovation',
    3: 'Marketing',
    4: 'Recruitment',
    5: 'Human Resources'
  }
  return departments[dept] || 'Unknown'
}

const getRoleName = (role: number): string => {
  const roles: { [key: number]: string } = {
    1: 'Main Administrator',
    2: 'Administrator'
  }
  return roles[role] || 'Unknown'
}

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  profilePicture?: string
  department: number
  role: number
}

export default function AdminSettings() {
  const router = useRouter()
  const { isdarkmode } = useDarkMode() // Get dark mode state from context
  const [activetab, setactivetab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [department, setDepartment] = useState(1)
  const [profilePicture, setProfilePicture] = useState('')
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  // Fetch current user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      setUserData(data)
      
      // Populate form fields
      setFirstName(data.firstName || '')
      setLastName(data.lastName || '')
      setEmail(data.email || '')
      setContactNumber(data.contactNumber || '')
      setDepartment(data.department || 1)
      setProfilePicture(data.profilePicture || '')
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load user data')
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!userData) return

      const updateData: any = {
        firstName,
        lastName,
        email,
        contactNumber,
        department,
      }

      if (profilePicture) {
        updateData.profilePicture = profilePicture
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUserData(updatedUser)
      alert('Profile updated successfully!')
      
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setPasswordError(null)
      setPasswordSuccess(null)

      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError('All password fields are required')
        return
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match')
        return
      }

      if (newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters long')
        return
      }

      setSaving(true)

      // Call the change password endpoint from your user.controller.ts
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      // Parse the response
      const data = await response.json()

      // Check if the response was successful
      if (!response.ok) {
        // If not successful, throw an error with the message from the backend
        throw new Error(data.message || data.error || 'Failed to change password')
      }

      // Success! Clear the form and show success message
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(data.message || 'Password changed successfully!')
      
      // Optional: Show alert
      alert(data.message || 'Password changed successfully!')
      
    } catch (err: any) {
      console.error('Error changing password:', err)
      setPasswordError(err.message || 'Failed to change password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = () => {
    if (!firstName && !lastName) return '?'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-lg ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent">
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-xl md:text-2xl mb-2 tracking-tight transition-colors ${isdarkmode ? 'text-white' : 'text-black'}`}>
            Admin Settings
          </h1>
          <p className={`text-[11px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
            Configure Your Administrator Account
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-transparent p-4 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm sticky top-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setactivetab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] transition-all ${
                    activetab === 'profile'
                      ? 'bg-[#800000] text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile Information
                </button>
                <button
                  onClick={() => {
                    setactivetab('security')
                    setPasswordError(null)
                    setPasswordSuccess(null)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] transition-all ${
                    activetab === 'security'
                      ? 'bg-[#800000] text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Security Settings
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                <p className={`text-[9px] italic px-4 transition-colors ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>
                  All Changes Made To Admin Profiles Are Logged For Security Auditing Purposes.
                </p>
              </div>
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
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          getInitials()
                        )}
                      </div>
                      <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-[#800000] p-1.5 rounded-full border-2 border-white dark:border-transparent text-white shadow-sm cursor-pointer hover:bg-[#600000]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      </label>
                      <input 
                        id="profile-upload" 
                        type="file" 
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <label htmlFor="profile-upload" className="px-5 py-2 bg-[#800000] text-white rounded-lg text-[10px] hover:opacity-90 transition-all shadow-md shadow-[#800000]/10 cursor-pointer">
                          Upload New Photo
                        </label>
                        <button 
                          onClick={() => setProfilePicture('')}
                          className={`px-5 py-2 border rounded-lg text-[10px] transition-all ${isdarkmode ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                          Remove
                        </button>
                      </div>
                      <p className={`text-[10px] italic transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Recommended Size: 400x400px. Formats: Jpg, Png.
                      </p>
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        First Name
                      </label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white' : 'bg-gray-50 border border-gray-200 text-black'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last Name
                      </label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white' : 'bg-gray-50 border border-gray-200 text-black'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Admin Email
                      </label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white' : 'bg-gray-50 border border-gray-200 text-black'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Contact Number
                      </label>
                      <input 
                        type="text" 
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white' : 'bg-gray-50 border border-gray-200 text-black'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(Number(e.target.value))}
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white' : 'bg-gray-50 border border-gray-200 text-black'}`}
                      >
                        <option value={1}>Compliance</option>
                        <option value={2}>Innovation</option>
                        <option value={3}>Marketing</option>
                        <option value={4}>Recruitment</option>
                        <option value={5}>Human Resources</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Assigned Role
                      </label>
                      <div className={`w-full p-3.5 bg-gray-100/50 dark:bg-white/5 rounded-xl text-[12px] transition-colors ${isdarkmode ? 'text-[#ff6666]' : 'text-[#800000]'}`}>
                        {userData && getRoleName(userData.role)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-50 dark:border-white/10 flex justify-end">
                    <button 
                      onClick={handleProfileUpdate}
                      disabled={saving}
                      className={`px-10 py-3.5 bg-[#800000] text-white rounded-xl text-[11px] shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-all active:scale-95 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Saving...' : 'Save Admin Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500 max-w-md">
                  {passwordError && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-green-600 dark:text-green-400 text-xs">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current Password
                      </label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••" 
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white placeholder-gray-600' : 'bg-gray-50 border border-gray-200 text-black placeholder-gray-400'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        New Secure Password
                      </label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white placeholder-gray-600' : 'bg-gray-50 border border-gray-200 text-black placeholder-gray-400'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] px-1 uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" 
                        className={`w-full p-3.5 rounded-xl text-[12px] outline-none focus:ring-1 ring-[#800000]/20 transition-colors ${isdarkmode ? 'bg-white/5 border-none text-white placeholder-gray-600' : 'bg-gray-50 border border-gray-200 text-black placeholder-gray-400'}`}
                      />
                    </div>
                    <div className="pt-4">
                      <button 
                        onClick={handlePasswordChange}
                        disabled={saving}
                        className={`px-10 py-3.5 bg-[#800000] text-white rounded-xl text-[11px] shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-all active:scale-95 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {saving ? 'Updating...' : 'Update Security'}
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