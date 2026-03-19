'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '../layout'

interface Applicant {
  _id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  dob?: string
  gender?: string
  services?: string[]
  experienceLevel?: string
  availability?: string
  timezone?: string
  rate?: string
  startDate?: string
  coverLetter?: string
  resumeUrl?: string
  resumeOriginalName?: string
  appliedAt: string
  status: 'pending' | 'approved' | 'rejected'
  confirmCode?: string
}

const poppins: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function ApplicantModal({
  applicant,
  isdarkmode,
  onClose,
  onApprove,
  onReject,
  actionLoading,
}: {
  applicant: Applicant
  isdarkmode: boolean
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  actionLoading: string | null
}) {
  const card = `rounded-2xl p-4 ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`
  const label = `text-gray-400 mb-1`
  const value = `${isdarkmode ? 'text-white' : 'text-gray-800'} font-medium`

  const Row = ({ l, v }: { l: string; v?: string }) => (
    <div>
      <p style={{ ...poppins, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em' }} className={label}>{l}</p>
      <p style={{ ...poppins, fontSize: '12px' }} className={value}>{v || '—'}</p>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${isdarkmode ? 'bg-[#181818]' : 'bg-white'}`}
        style={poppins}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl bg-[#800000]/10 text-[#800000] flex items-center justify-center font-semibold shrink-0"
              style={{ ...poppins, fontSize: '13px' }}
            >
              {applicant.firstName?.[0]}{applicant.lastName?.[0]}
            </div>
            <div>
              <p style={{ ...poppins, fontSize: '14px', fontWeight: 600 }} className={isdarkmode ? 'text-white' : 'text-gray-800'}>
                {applicant.firstName} {applicant.middleName ? applicant.middleName + ' ' : ''}{applicant.lastName}
              </p>
              <p style={{ ...poppins, fontSize: '11px' }} className="text-gray-400">{applicant.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Status + Confirm code */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wide ${
              applicant.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              applicant.status === 'rejected' ? 'bg-red-100 text-red-600' :
              isdarkmode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
            }`} style={poppins}>{applicant.status}</span>
            {applicant.confirmCode && (
              <span style={{ ...poppins, fontSize: '10px' }} className="text-gray-400">
                Ref: <span className={isdarkmode ? 'text-gray-300' : 'text-gray-600'}>{applicant.confirmCode}</span>
              </span>
            )}
          </div>

          {/* Personal Info */}
          <div className={card}>
            <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }} className="text-[#800000] mb-3">Personal Information</p>
            <div className="grid grid-cols-2 gap-4">
              <Row l="Phone" v={applicant.phone} />
              <Row l="Date of Birth" v={applicant.dob} />
              <Row l="Gender" v={applicant.gender} />
              <Row l="Country" v={applicant.country} />
              <div className="col-span-2">
                <Row l="Address" v={[applicant.address, applicant.city, applicant.state, applicant.zip].filter(Boolean).join(', ')} />
              </div>
            </div>
          </div>

          {/* Services / Position */}
          <div className={card}>
            <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }} className="text-[#800000] mb-3">Services & Availability</p>
            <div className="grid grid-cols-2 gap-4">
              <Row l="Experience Level" v={applicant.experienceLevel} />
              <Row l="Availability" v={applicant.availability} />
              <Row l="Expected Rate" v={applicant.rate} />
              <Row l="Start Date" v={applicant.startDate} />
              <Row l="Timezone" v={applicant.timezone} />
            </div>
            {applicant.services && applicant.services.length > 0 && (
              <div className="mt-3">
                <p style={{ ...poppins, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em' }} className={label}>Desired Positions / Services</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {applicant.services.map(s => (
                    <span key={s} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${isdarkmode ? 'bg-[#800000]/20 text-[#ff6666]' : 'bg-[#800000]/10 text-[#800000]'}`} style={poppins}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <div className={card}>
              <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }} className="text-[#800000] mb-2">Cover Letter</p>
              <p style={{ ...poppins, fontSize: '12px', lineHeight: 1.7 }} className={isdarkmode ? 'text-gray-300' : 'text-gray-600'}>
                {applicant.coverLetter}
              </p>
            </div>
          )}

          {/* Resume */}
          {applicant.resumeUrl && (
            <div className={card}>
              <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }} className="text-[#800000] mb-2">Resume / CV</p>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}${applicant.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#800000] no-underline hover:underline"
                style={{ ...poppins, fontSize: '12px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {applicant.resumeOriginalName || 'Download Resume'}
              </a>
            </div>
          )}

          {/* Action buttons (if pending) */}
          {applicant.status === 'pending' && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { onApprove(applicant._id); onClose() }}
                disabled={!!actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white border-none cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                style={{ ...poppins, fontSize: '12px', fontWeight: 500 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Approve Applicant
              </button>
              <button
                onClick={() => { onReject(applicant._id); onClose() }}
                disabled={!!actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white border-none cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                style={{ ...poppins, fontSize: '12px', fontWeight: 500 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Reject Applicant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ApplicantsList() {
  const { isdarkmode } = useDarkMode()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchApplicants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        setApplicants(data)
      }
    } catch (error) {
      console.error('Error fetching applicants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchApplicants() }, [])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(`${id}-${action}`)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${id}/${action}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        showToast(action === 'approve' ? 'Applicant approved successfully.' : 'Applicant rejected.', 'success')
        setApplicants(prev =>
          prev.map(a => a._id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a)
        )
        // Update modal if open
        setSelectedApplicant(prev =>
          prev?._id === id ? { ...prev, status: action === 'approve' ? 'approved' : 'rejected' } : prev
        )
      } else {
        showToast('Action failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error performing action:', error)
      showToast('Something went wrong.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = applicants.filter(a => filterStatus === 'all' || a.status === filterStatus)

  const statusBadge = (status: Applicant['status']) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide'
    if (status === 'approved') return `${base} bg-emerald-100 text-emerald-700`
    if (status === 'rejected') return `${base} bg-red-100 text-red-600`
    return `${base} ${isdarkmode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="space-y-6" style={poppins}>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] px-5 py-3 rounded-2xl shadow-xl text-white text-[11px] font-medium transition-all animate-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
          style={poppins}
        >
          {toast.message}
        </div>
      )}

      {/* Modal */}
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          isdarkmode={isdarkmode}
          onClose={() => setSelectedApplicant(null)}
          onApprove={(id) => handleAction(id, 'approve')}
          onReject={(id) => handleAction(id, 'reject')}
          actionLoading={actionLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={isdarkmode ? 'text-white' : 'text-gray-800'} style={{ ...poppins, fontSize: '18px', fontWeight: 600 }}>
            List of Applicants
          </h1>
          <p className="text-gray-400 mt-0.5" style={{ ...poppins, fontSize: '11px' }}>
            Review and manage job applicants
          </p>
        </div>
        <div className={`flex items-center gap-1 p-1 rounded-2xl ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-100'}`}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize border-none cursor-pointer transition-all active:scale-95 ${
                filterStatus === tab ? 'bg-[#800000] text-white shadow-sm'
                : isdarkmode ? 'bg-transparent text-gray-400 hover:text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={{ ...poppins, fontSize: '10px', fontWeight: filterStatus === tab ? 600 : 400 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-3xl overflow-hidden shadow-sm border ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-100'}`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-[#800000] border-r-transparent" />
              <p className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>Loading applicants…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <p className="text-gray-400" style={{ ...poppins, fontSize: '12px' }}>
              No applicants found{filterStatus !== 'all' ? ` for "${filterStatus}"` : ''}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
                  {['Applicant', 'Desired Position(s)', 'Applied', 'Status', 'Actions'].map(col => (
                    <th
                      key={col}
                      className={`px-6 py-4 text-left ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                      style={{ ...poppins, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((applicant) => (
                  <tr
                    key={applicant._id}
                    className={`border-b transition-colors ${isdarkmode ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/60'}`}
                  >
                    {/* Applicant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl bg-[#800000]/10 text-[#800000] flex items-center justify-center shrink-0 font-semibold"
                          style={{ ...poppins, fontSize: '11px' }}
                        >
                          {applicant.firstName?.[0]}{applicant.lastName?.[0]}
                        </div>
                        <div>
                          <p className={isdarkmode ? 'text-white' : 'text-gray-800'} style={{ ...poppins, fontSize: '12px', fontWeight: 500 }}>
                            {applicant.firstName} {applicant.lastName}
                          </p>
                          <p className="text-gray-400" style={{ ...poppins, fontSize: '10px' }}>{applicant.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Desired Position */}
                    <td className="px-6 py-4 max-w-[220px]">
                      {applicant.services && applicant.services.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {applicant.services.slice(0, 2).map(s => (
                            <span
                              key={s}
                              className={`px-2 py-0.5 rounded-md text-[9px] font-medium ${isdarkmode ? 'bg-[#800000]/20 text-[#ff6666]' : 'bg-[#800000]/10 text-[#800000]'}`}
                              style={poppins}
                            >
                              {s}
                            </span>
                          ))}
                          {applicant.services.length > 2 && (
                            <span className="text-gray-400 text-[9px]" style={poppins}>
                              +{applicant.services.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>
                        {applicant.appliedAt ? formatDate(applicant.appliedAt) : '—'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={statusBadge(applicant.status)} style={poppins}>{applicant.status}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* View button — always visible */}
                        <button
                          onClick={() => setSelectedApplicant(applicant)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all active:scale-95 ${isdarkmode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          style={{ ...poppins, fontSize: '10px', fontWeight: 500 }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>

                        {/* Approve / Reject — only if pending */}
                        {applicant.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(applicant._id, 'approve')}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-none cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ ...poppins, fontSize: '10px', fontWeight: 500 }}
                            >
                              {actionLoading === `${applicant._id}-approve`
                                ? <div className="w-3 h-3 border-2 border-white border-r-transparent rounded-full animate-spin" />
                                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              }
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(applicant._id, 'reject')}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white border-none cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ ...poppins, fontSize: '10px', fontWeight: 500 }}
                            >
                              {actionLoading === `${applicant._id}-reject`
                                ? <div className="w-3 h-3 border-2 border-white border-r-transparent rounded-full animate-spin" />
                                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              }
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-gray-400 text-right" style={{ ...poppins, fontSize: '10px' }}>
          Showing {filtered.length} of {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}