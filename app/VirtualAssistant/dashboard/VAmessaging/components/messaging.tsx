'use client'

// File location: app/VirtualAssistant/dashboard/VAmessaging/components/Messaging.tsx

import { useState, useRef, useEffect } from 'react'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const BG        = '#FFFFFF'
const NEU_OUT   = '0px 4px 16px rgba(0,0,0,0.10), 0px 1px 4px rgba(0,0,0,0.06)'
const NEU_IN    = 'inset 0px 2px 6px rgba(0,0,0,0.08), inset 0px 1px 2px rgba(0,0,0,0.05)'
const TEXT_MAIN = '#2a2a2a'
const TEXT_SUB  = '#888'
const PRIMARY   = '#800000'

// ─── ICON HELPER ──────────────────────────────────────────────────────────────
const Ico = ({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
)

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Message = {
  id: number
  sender: 'user' | 'va'
  text: string
  timestamp: Date
  avatar: string
}

type CustomerDetails = {
  email: string
  phone: string
  location: string
  flag: string
  browser: string
  os: string
  ip: string
}

type Conversation = {
  id: number
  name: string
  avatar: string
  avatarColor: string
  lastMessage: string
  time: string
  unread: number
  status: 'online' | 'offline' | 'away'
  email?: string
  category: 'ongoing' | 'queued'
  source?: 'instagram' | 'whatsapp' | 'web'
  messages: Message[]
  customerDetails?: CustomerDetails
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Lachlan McDonald',
    avatar: 'LM',
    avatarColor: '#6366f1',
    lastMessage: "That's okay. So the issue seems to b...",
    time: '10:55 AM',
    unread: 0,
    status: 'online',
    email: 'lachlan.mcdonald@acme.com',
    category: 'ongoing',
    source: 'web',
    customerDetails: {
      email: 'lachlan.mcdonald@acme.com',
      phone: 'N/A',
      location: 'Edinburgh, United Kingdom',
      flag: '🇬🇧',
      browser: 'Chrome 127.0.0',
      os: 'Windows 10',
      ip: '88.211.124.234',
    },
    messages: [
      { id: 1, sender: 'user', text: 'Hi, I have an issue purchasing the item listed on the product page', timestamp: new Date('2024-08-02T10:50:00'), avatar: 'LM' },
      { id: 2, sender: 'va',   text: 'Hi there! Sorry to hear that. Let me take a look at the issue.', timestamp: new Date('2024-08-02T10:51:00'), avatar: 'DK' },
      { id: 3, sender: 'user', text: 'Cheers!', timestamp: new Date('2024-08-02T10:51:00'), avatar: 'LM' },
      { id: 4, sender: 'va',   text: 'Hi Lachlan! Are you still there?', timestamp: new Date('2024-08-02T10:55:00'), avatar: 'DK' },
      { id: 5, sender: 'user', text: 'Hil yes sorry, I got disconnected briefly', timestamp: new Date('2024-08-02T10:55:00'), avatar: 'LM' },
    ],
  },
  {
    id: 2,
    name: 'Amy Schmidt',
    avatar: 'AS',
    avatarColor: '#10b981',
    lastMessage: 'Have you switched on the setting...',
    time: '10:30 AM',
    unread: 0,
    status: 'online',
    category: 'ongoing',
    source: 'whatsapp',
    messages: [
      { id: 1, sender: 'va', text: 'Have you switched on the setting?', timestamp: new Date(), avatar: 'DK' },
    ],
  },
  {
    id: 3,
    name: 'Jake Jarman',
    avatar: 'JJ',
    avatarColor: '#f59e0b',
    lastMessage: 'Hey 👋 Could you help me with som...',
    time: '9:58 AM',
    unread: 0,
    status: 'online',
    category: 'queued',
    source: 'instagram',
    messages: [
      { id: 1, sender: 'user', text: 'Hey 👋 Could you help me with something?', timestamp: new Date(), avatar: 'JJ' },
    ],
  },
  {
    id: 4,
    name: 'Chad Jones',
    avatar: 'CJ',
    avatarColor: '#8b5cf6',
    lastMessage: 'How do I find files in the account?',
    time: '9:45 AM',
    unread: 3,
    status: 'online',
    category: 'queued',
    messages: [
      { id: 1, sender: 'user', text: 'How do I find files in the account?', timestamp: new Date(), avatar: 'CJ' },
    ],
  },
  {
    id: 5,
    name: 'Carmen Leung',
    avatar: 'CL',
    avatarColor: '#ef4444',
    lastMessage: "I've got an issue with my messages",
    time: '9:12 AM',
    unread: 2,
    status: 'away',
    category: 'queued',
    messages: [
      { id: 1, sender: 'user', text: "I've got an issue with my messages", timestamp: new Date(), avatar: 'CL' },
    ],
  },
  {
    id: 6,
    name: 'Heinz Heinrich',
    avatar: 'HH',
    avatarColor: '#64748b',
    lastMessage: 'Hi there',
    time: 'Yesterday',
    unread: 0,
    status: 'offline',
    category: 'queued',
    messages: [
      { id: 1, sender: 'user', text: 'Hi there', timestamp: new Date(), avatar: 'HH' },
    ],
  },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const SourceBadge = ({ source }: { source?: string }) => {
  if (source === 'instagram')
    return (
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="8" height="8" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </span>
    )
  if (source === 'whatsapp')
    return (
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#25d366', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="8" height="8" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </span>
    )
  return null
}

const StatusDot = ({ status }: { status: string }) => {
  const color = status === 'online' ? '#22c55e' : status === 'away' ? '#f59e0b' : '#94a3b8'
  return <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: color, border: `2px solid ${BG}` }} />
}

// ─── CONVERSATION ITEM ────────────────────────────────────────────────────────
function ConvItem({ c, selected, onSelect }: { c: Conversation; selected: boolean; onSelect: () => void }) {
  return (
    <div onClick={onSelect}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderLeft: `3px solid ${selected ? PRIMARY : 'transparent'}`, background: selected ? 'rgba(128,0,0,0.04)' : 'transparent', transition: 'all 0.15s' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, boxShadow: selected ? NEU_IN : NEU_OUT }}>
          {c.avatar}
        </div>
        <StatusDot status={c.status} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_MAIN, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>{c.name}</span>
            <SourceBadge source={c.source} />
          </div>
          <span style={{ fontSize: 10, color: TEXT_SUB, flexShrink: 0 }}>{c.time}</span>
        </div>
        <p style={{ fontSize: 10.5, color: TEXT_SUB, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{c.lastMessage}</p>
      </div>
      {c.unread > 0 && (
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: PRIMARY, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.unread}</span>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Messaging() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS)
  const [selectedId, setSelectedId]       = useState<number>(1)
  const [input, setInput]                 = useState('')
  const [search, setSearch]               = useState('')
  const [activeTab, setActiveTab]         = useState<'details' | 'notes'>('details')
  const [ongoingOpen, setOngoingOpen]     = useState(true)
  const [queuedOpen, setQueuedOpen]       = useState(true)
  // Mobile navigation: 'list' | 'chat' | 'details'
  const [mobilePanel, setMobilePanel]     = useState<'list' | 'chat' | 'details'>('list')
  const bottomRef = useRef<HTMLDivElement>(null)

  const selected = conversations.find(c => c.id === selectedId)!
  const filtered = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const ongoing  = filtered.filter(c => c.category === 'ongoing')
  const queued   = filtered.filter(c => c.category === 'queued')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [selected?.messages])

  const handleSelect = (id: number) => {
    setSelectedId(id)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
    setMobilePanel('chat')
  }

  const handleSend = () => {
    if (!input.trim()) return
    const msg: Message = { id: Date.now(), sender: 'va', text: input.trim(), timestamp: new Date(), avatar: 'DK' }
    setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, msg], lastMessage: input.trim(), time: 'Just now' } : c))
    setInput('')
  }

  const groupedMessages = (() => {
    const groups: { date: string; items: ({ type: 'msg'; msg: Message } | { type: 'sys'; text: string })[] }[] = []
    const SYSTEM_EVENTS: Record<number, string[]> = {
      3: ['Lachlan left the chat at 10:52', 'Lachlan joined the conversation at 10:55'],
    }
    selected.messages.forEach(msg => {
      const dateStr = fmtDate(msg.timestamp)
      let group = groups.find(g => g.date === dateStr)
      if (!group) { group = { date: dateStr, items: [] }; groups.push(group) }
      group.items.push({ type: 'msg', msg })
      if (SYSTEM_EVENTS[msg.id] && selected.id === 1) {
        SYSTEM_EVENTS[msg.id].forEach(text => group!.items.push({ type: 'sys', text }))
      }
    })
    return groups
  })()

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', background: BG, overflow: 'hidden', fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

        /* Desktop: all 3 columns */
        .msg-sidebar  { width: 280px; min-width: 280px; border-right: 1px solid rgba(0,0,0,0.07); display: flex; flex-direction: column; flex-shrink: 0; }
        .msg-chat     { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .msg-right    { width: 260px; min-width: 260px; border-left: 1px solid rgba(0,0,0,0.07); display: flex; flex-direction: column; flex-shrink: 0; }
        .msg-back-btn { display: none !important; }

        /* Tablet: hide right panel */
        @media (max-width: 1023px) {
          .msg-right   { display: none !important; }
          .msg-sidebar { width: 240px; min-width: 240px; }
        }

        /* Mobile: one panel at a time */
        @media (max-width: 767px) {
          .msg-sidebar { width: 100% !important; min-width: 0 !important; border-right: none !important; }
          .msg-chat    { width: 100% !important; min-width: 0 !important; }
          .msg-right   { width: 100% !important; min-width: 0 !important; border-left: none !important; display: flex !important; flex-direction: column; }
          .msg-back-btn { display: flex !important; }
        }
      `}</style>

      {/* ── LEFT SIDEBAR ── */}
      <div className="msg-sidebar" style={{ display: mobilePanel === 'list' ? undefined : undefined }}
        {...({} as object)}
      >
        <style>{`@media (max-width: 767px) { .msg-sidebar { display: ${mobilePanel === 'list' ? 'flex' : 'none'} !important; } }`}</style>

        <div style={{ padding: '14px 14px 10px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: BG, borderRadius: 10, padding: '7px 12px', boxShadow: NEU_IN }}>
              <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={13} sw={1.5} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 11.5, color: TEXT_MAIN, width: '100%', fontFamily: 'inherit' }} />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: BG, border: 'none', borderRadius: 10, padding: '7px 10px', fontSize: 11, color: TEXT_SUB, cursor: 'pointer', boxShadow: NEU_OUT, fontFamily: 'inherit', flexShrink: 0 }}>
              <Ico d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" size={12} sw={1.5} /> Filter (3)
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <button onClick={() => setOngoingOpen(!ongoingOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: TEXT_SUB, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'inherit' }}>
            <span>Ongoing Conversations ({ongoing.length})</span>
            <Ico d={ongoingOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={11} sw={2} />
          </button>
          {ongoingOpen && ongoing.map(c => <ConvItem key={c.id} c={c} selected={selectedId === c.id} onSelect={() => handleSelect(c.id)} />)}

          <button onClick={() => setQueuedOpen(!queuedOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: TEXT_SUB, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'inherit' }}>
            <span>Queued ({queued.length})</span>
            <Ico d={queuedOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={11} sw={2} />
          </button>
          {queuedOpen && queued.map(c => <ConvItem key={c.id} c={c} selected={selectedId === c.id} onSelect={() => handleSelect(c.id)} />)}

          {[{ label: 'Spam', count: 10 }, { label: 'Resolved', count: 41 }].map(({ label, count }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: TEXT_SUB, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
              <span style={{ fontSize: 10.5, color: TEXT_SUB }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className="msg-chat">
        <style>{`@media (max-width: 767px) { .msg-chat { display: ${mobilePanel === 'chat' ? 'flex' : 'none'} !important; } }`}</style>

        {/* Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Mobile back to list */}
            <button className="msg-back-btn" onClick={() => setMobilePanel('list')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SUB, alignItems: 'center', padding: '0 4px 0 0', flexShrink: 0 }}>
              <Ico d="M15 18l-6-6 6-6" size={18} sw={2} />
            </button>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: selected.avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, boxShadow: NEU_OUT }}>
                {selected.avatar}
              </div>
              <StatusDot status={selected.status} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>{selected.name}</div>
              {selected.email && <div style={{ fontSize: 10.5, color: TEXT_SUB }}>{selected.email}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.54 16z', onClick: undefined },
              { d: 'M15 10l4.553-2.069A1 1 0 0 1 21 8.876V15.12a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z', onClick: undefined },
              { d: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z', onClick: () => setMobilePanel('details') },
            ].map((btn, i) => (
              <button key={i} onClick={btn.onClick}
                style={{ width: 32, height: 32, borderRadius: 9, background: BG, border: 'none', cursor: 'pointer', color: TEXT_SUB, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: NEU_OUT }}>
                <Ico d={btn.d} size={14} sw={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {groupedMessages.map(group => (
            <div key={group.date}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                <span style={{ fontSize: 10, color: TEXT_SUB, background: BG, padding: '3px 10px', borderRadius: 99, boxShadow: NEU_IN }}>{group.date}</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
              </div>
              {group.items.map((item, idx) => {
                if (item.type === 'sys') {
                  return (
                    <div key={`sys-${group.date}-${idx}`} style={{ textAlign: 'center', margin: '6px 0' }}>
                      <span style={{ fontSize: 10, color: TEXT_SUB, fontStyle: 'italic' }}>{item.text}</span>
                    </div>
                  )
                }
                const { msg } = item
                const isVA = msg.sender === 'va'
                return (
                  <div key={`msg-${group.date}-${msg.id}`} style={{ display: 'flex', flexDirection: isVA ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: isVA ? PRIMARY : selected.avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0, boxShadow: NEU_OUT }}>
                      {msg.avatar}
                    </div>
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{ fontSize: 10, color: TEXT_SUB, marginBottom: 3, textAlign: isVA ? 'right' : 'left' }}>
                        {isVA ? 'Dean Kowalski (You)' : selected.name} · {fmtTime(msg.timestamp)}
                      </div>
                      <div style={{ background: isVA ? PRIMARY : BG, color: isVA ? '#fff' : TEXT_MAIN, padding: '10px 14px', borderRadius: isVA ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 12, lineHeight: 1.6, boxShadow: isVA ? `3px 3px 10px rgba(128,0,0,0.25)` : NEU_OUT }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG, borderRadius: 14, padding: '8px 14px', boxShadow: NEU_IN }}>
            {[
              'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
              'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
            ].map((d, i) => (
              <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SUB, display: 'flex', padding: 4 }}>
                <Ico d={d} size={15} sw={1.5} />
              </button>
            ))}
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: TEXT_MAIN, fontFamily: 'inherit' }} />
            <button onClick={handleSend} disabled={!input.trim()}
              style={{ width: 32, height: 32, borderRadius: 10, background: input.trim() ? PRIMARY : BG, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', color: input.trim() ? '#fff' : TEXT_SUB, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: input.trim() ? `3px 3px 10px rgba(128,0,0,0.3)` : NEU_IN, transition: 'all 0.15s' }}>
              <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" size={13} sw={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="msg-right">
        <style>{`@media (max-width: 767px) { .msg-right { display: ${mobilePanel === 'details' ? 'flex' : 'none'} !important; } }`}</style>

        {/* Mobile back to chat */}
        <div className="msg-back-btn" style={{ alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          <button onClick={() => setMobilePanel('chat')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SUB, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'inherit' }}>
            <Ico d="M15 18l-6-6 6-6" size={16} sw={2} /> Back to chat
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          {(['details', 'notes'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '13px 0', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? PRIMARY : 'transparent'}`, cursor: 'pointer', fontSize: 11.5, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? PRIMARY : TEXT_SUB, fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {tab === 'details' ? 'Customer Details' : 'Notes'}
            </button>
          ))}
        </div>

        {activeTab === 'details' ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {selected.customerDetails ? (
              <>
                {/* Profile Header */}
                <div style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: selected.avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, marginBottom: 14, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                    {selected.avatar}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_MAIN, marginBottom: 3, textAlign: 'center' }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 10 }}>Customer</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEXT_SUB, marginBottom: 16, textAlign: 'center' }}>
                    <span>📍</span>
                    <span>{selected.customerDetails.flag} {selected.customerDetails.location}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#25d366', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </span>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(253,29,29,0.3)' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </span>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#1877f2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(24,119,242,0.35)' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </span>
                  </div>
                </div>

                {/* Info Rows */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { fieldIcon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.54 16z', label: 'Phone:', value: selected.customerDetails.phone },
                      { fieldIcon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', fieldIconD2: 'M22 6l-10 7L2 6', label: 'E-mail:', value: selected.customerDetails.email },
                      { fieldIcon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', label: 'DOB:', value: '01.01.2000' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: TEXT_SUB, marginTop: 1 }}>
                          <Ico d={item.fieldIcon} d2={'fieldIconD2' in item ? item.fieldIconD2 : undefined} size={12} sw={1.5} />
                        </div>
                        <div>
                          <div style={{ fontSize: 9.5, color: TEXT_SUB, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 11.5, color: TEXT_MAIN, wordBreak: 'break-all', lineHeight: 1.4 }}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: TEXT_SUB, gap: 8 }}>
                <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={32} sw={1} />
                <span style={{ fontSize: 11 }}>No customer data</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, padding: 14 }}>
            <textarea placeholder="Add notes about this customer..."
              style={{ width: '100%', height: '100%', resize: 'none', border: 'none', background: 'transparent', outline: 'none', fontSize: 11.5, color: TEXT_MAIN, fontFamily: 'inherit', lineHeight: 1.6 }} />
          </div>
        )}
      </div>
    </div>
  )
}