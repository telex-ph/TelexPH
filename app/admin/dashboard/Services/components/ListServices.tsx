'use client'

import React, { useState } from 'react'
import { useDarkMode } from '../../layout'

type ServiceStatus = Record<string, boolean>

const services = [
  {
    id: 'ai-builder',
    name: 'AI Builder',
    description: 'Build intelligent AI-powered solutions tailored to your business needs. Automate workflows and enhance decision-making with cutting-edge AI tools.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-violet-500 to-purple-600',
    badge: 'AI & Tech',
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Streamline repetitive tasks and business processes with smart automation. Increase efficiency, reduce errors, and free up your team for high-value work.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-600',
    badge: 'Operations',
  },
  {
    id: 'booking-appointment',
    name: 'Booking & Appointment',
    description: 'Manage scheduling with ease. Our booking systems handle client appointments, reminders, and calendar integrations seamlessly.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-emerald-500 to-teal-600',
    badge: 'Scheduling',
  },
  {
    id: 'courses-products',
    name: 'Courses / Products',
    description: 'Launch and manage online courses, digital products, and e-learning platforms. Monetize your expertise with robust product delivery systems.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'from-orange-500 to-amber-600',
    badge: 'Education',
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Centralize customer relationships with a powerful CRM system. Track leads, nurture clients, and drive sales growth with data-driven insights.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-rose-500 to-pink-600',
    badge: 'Sales',
  },
  {
    id: 'csr',
    name: 'CSR',
    description: 'Deliver exceptional customer support through trained representatives. Resolve issues efficiently and build lasting customer loyalty.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'from-sky-500 to-blue-600',
    badge: 'Support',
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Design, automate, and optimize email campaigns that convert. Grow your subscriber list and engage audiences with personalized messaging.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-indigo-500 to-violet-600',
    badge: 'Marketing',
  },
  {
    id: 'funnel-builder',
    name: 'Funnel Builder',
    description: 'Build high-converting sales funnels from scratch. Guide prospects through every stage of the buyer journey with strategic landing pages and flows.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    color: 'from-fuchsia-500 to-pink-600',
    badge: 'Sales',
  },
  {
    id: 'gray-label',
    name: 'Gray Label',
    description: 'Offer branded service solutions under a shared identity. Perfect for agencies looking to expand offerings without building from scratch.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    color: 'from-slate-500 to-gray-600',
    badge: 'Branding',
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    description: 'Grow your brand presence across all social platforms. From content creation to scheduling and analytics, we handle it all.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    color: 'from-pink-500 to-rose-600',
    badge: 'Marketing',
  },
  {
    id: 'survey-forms',
    name: 'Survey and Forms',
    description: 'Collect meaningful data with custom surveys and forms. Analyze responses in real-time and make informed business decisions.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: 'from-teal-500 to-emerald-600',
    badge: 'Data',
  },
  {
    id: 'tech-support',
    name: 'Tech Support',
    description: 'Provide reliable technical assistance to your clients around the clock. From troubleshooting to maintenance, our tech team has it covered.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-cyan-500 to-sky-600',
    badge: 'Support',
  },
  {
    id: 'video-graphics-design',
    name: 'Video & Graphics Design',
    description: 'Create stunning visuals, motion graphics, and video content that captivates your audience and elevates your brand identity.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-yellow-500 to-orange-500',
    badge: 'Creative',
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Build fast, scalable, and beautiful web applications. From landing pages to full-stack platforms, we bring your digital vision to life.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
    badge: 'Development',
  },
  {
    id: 'website-builder',
    name: 'Website Builder',
    description: 'Launch professional websites without the technical complexity. Our intuitive builder empowers anyone to create stunning sites in minutes.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-600',
    badge: 'Development',
  },
  {
    id: 'white-label',
    name: 'White Label',
    description: 'Resell our services under your own brand. Full white-label solutions that let you scale your agency offerings with zero infrastructure investment.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'from-purple-500 to-indigo-600',
    badge: 'Branding',
  },
]

const allBadges = ['All', ...Array.from(new Set(services.map(s => s.badge)))]

export default function ListServices() {
  const { isdarkmode } = useDarkMode()
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid')
  const [selectedbadge, setselectedbadge] = useState('All')
  const [search, setsearch] = useState('')
  const [activestatuses, setactivestatuses] = useState<Record<string, boolean>>(
    () => Object.fromEntries(services.map(s => [s.id, true]))
  )

  const togglestatus = (id: string) => {
    setactivestatuses(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtered = services.filter(s => {
    const matchesbadge = selectedbadge === 'All' || s.badge === selectedbadge
    const matchessearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    return matchesbadge && matchessearch
  })

  const cardshadow = { boxShadow: isdarkmode ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.06)' }

  return (
    <div className={`min-h-screen ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-gray-50'} p-6 transition-colors duration-500`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-black uppercase tracking-tight mb-1 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
            Services
          </h1>
          <p className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
            Browse and manage all available service offerings
          </p>
        </div>

        {/* Controls */}
        <div className={`${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'} rounded-2xl p-6 mb-6 border transition-colors duration-500`} style={cardshadow}>

          {/* Badge Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {allBadges.map(badge => (
              <button
                key={badge}
                onClick={() => setselectedbadge(badge)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedbadge === badge
                    ? 'bg-[#800000] text-white shadow-lg shadow-[#800000]/20'
                    : isdarkmode
                    ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {badge}
                <span className={`ml-1.5 ${selectedbadge === badge ? 'text-white/70' : 'text-gray-400'}`}>
                  ({badge === 'All' ? services.length : services.filter(s => s.badge === badge).length})
                </span>
              </button>
            ))}
          </div>

          {/* Search + View Toggle row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 rounded-xl border text-[10px] transition-all ${
              isdarkmode ? 'bg-[#252525] border-white/10 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setsearch(e.target.value)}
                className="bg-transparent outline-none w-full text-[11px] placeholder-gray-400"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setviewmode('grid')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewmode === 'grid'
                    ? 'bg-[#800000] text-white shadow-md'
                    : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setviewmode('list')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewmode === 'list'
                    ? 'bg-[#800000] text-white shadow-md'
                    : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className={`text-[10px] uppercase tracking-widest font-bold mb-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
          Showing {filtered.length} of {services.length} services
        </p>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-16 text-center`} style={cardshadow}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-sm font-bold mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>No services found</h3>
            <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter</p>
          </div>
        )}

        {/* Grid View */}
        {filtered.length > 0 && viewmode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(service => (
              <div
                key={service.id}
                className={`group rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}
                style={cardshadow}
              >
                {/* Card top gradient bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${service.color}`} />

                <div className="p-6 flex flex-col flex-grow">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                      {service.icon}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      isdarkmode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className={`text-[13px] font-black uppercase tracking-tight mb-2 group-hover:text-[#800000] transition-colors ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-[10px] leading-relaxed flex-grow ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {service.description}
                  </p>

                  {/* Footer */}
                  <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shadow-sm transition-colors ${activestatuses[service.id] ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-gray-400 shadow-gray-400/30'}`} />
                      <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${activestatuses[service.id] ? (isdarkmode ? 'text-emerald-400' : 'text-emerald-500') : (isdarkmode ? 'text-gray-600' : 'text-gray-400')}`}>
                        {activestatuses[service.id] ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button
                      onClick={() => togglestatus(service.id)}
                      className={`relative w-9 h-5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer active:scale-90 ${activestatuses[service.id] ? 'bg-emerald-400' : (isdarkmode ? 'bg-[#3a3a3a]' : 'bg-gray-200')}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${activestatuses[service.id] ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {filtered.length > 0 && viewmode === 'list' && (
          <div className="space-y-3">
            {filtered.map(service => (
              <div
                key={service.id}
                className={`group rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex items-center gap-5 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}
                style={cardshadow}
              >
                {/* Gradient indicator */}
                <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${service.color} shrink-0`} />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.color} text-white shrink-0 shadow-md`}>
                  {service.icon}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`text-[12px] font-black uppercase tracking-tight group-hover:text-[#800000] transition-colors ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {service.name}
                    </h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      isdarkmode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {service.badge}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-relaxed line-clamp-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {service.description}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shadow-sm transition-colors ${activestatuses[service.id] ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-gray-400 shadow-gray-400/30'}`} />
                    <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${activestatuses[service.id] ? (isdarkmode ? 'text-emerald-400' : 'text-emerald-500') : (isdarkmode ? 'text-gray-600' : 'text-gray-400')}`}>
                      {activestatuses[service.id] ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => togglestatus(service.id)}
                    className={`relative w-9 h-5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer active:scale-90 ${activestatuses[service.id] ? 'bg-emerald-400' : (isdarkmode ? 'bg-[#3a3a3a]' : 'bg-gray-200')}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${activestatuses[service.id] ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}