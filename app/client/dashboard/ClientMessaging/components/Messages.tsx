'use client'
import { useState, useRef, useEffect } from 'react'

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type Message = {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string | null
  content: string
  timestamp: Date
  isRead: boolean
}

export type Conversation = {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string | null
  participantRole: 'VA' | 'Admin'
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
}

// ─── ICON HELPERS ─────────────────────────────────────────────────────────────
const Ico = ({ d, d2, size = 16, sw = 1.5 }: { d: string; d2?: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
)

const SendIco      = () => <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" size={15} />
const SearchIco    = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} />
const AttachIco    = () => <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" size={15} />
const EmptyIco     = () => <Ico d="M8 9h8M8 13h6M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={40} sw={1} />
const BackIco      = () => <Ico d="M15 18l-6-6 6-6" size={16} />

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ name, src, size = 36, role }: { name: string; src?: string | null; size?: number; role?: string }) {
  const letter = name.charAt(0).toUpperCase()
  const bg = role === 'Admin' ? '#1a1a2e' : '#800000'
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, flexShrink: 0, overflow: 'hidden' }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : letter}
    </div>
  )
}

// ─── FORMAT TIME ──────────────────────────────────────────────────────────────
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}
function formatDate(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return formatTime(date)
  if (days === 1) return 'Yesterday'
  if (days < 7)  return date.toLocaleDateString('en-US', { weekday: 'short' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── CONVERSATION LIST ITEM ───────────────────────────────────────────────────
function ConvoItem({
  convo,
  active,
  onClick,
}: {
  convo: Conversation
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', cursor: 'pointer', borderRadius: 10,
        background: active ? '#fff5f5' : 'transparent',
        borderLeft: active ? '3px solid #800000' : '3px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      <Avatar name={convo.participantName} src={convo.participantAvatar} size={38} role={convo.participantRole} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: active ? '#800000' : '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
            {convo.participantName}
          </span>
          <span style={{ fontSize: 10, color: '#bbb', flexShrink: 0 }}>{formatDate(convo.lastMessageTime)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <span style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
            {convo.lastMessage}
          </span>
          {convo.unreadCount > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, background: '#800000', color: '#fff', borderRadius: '50%', minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', flexShrink: 0 }}>
              {convo.unreadCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: 9.5, color: convo.participantRole === 'Admin' ? '#1a1a2e' : '#800000', background: convo.participantRole === 'Admin' ? '#e8eaf6' : '#fff0f0', borderRadius: 4, padding: '1px 5px', marginTop: 3, display: 'inline-block' }}>
          {convo.participantRole}
        </span>
      </div>
    </div>
  )
}

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────
function Bubble({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: isOwn ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
      {!isOwn && <Avatar name={msg.senderName} src={msg.senderAvatar} size={28} />}
      <div style={{ maxWidth: '68%' }}>
        {!isOwn && (
          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 3, paddingLeft: 4 }}>{msg.senderName}</div>
        )}
        <div style={{
          padding: '9px 13px',
          borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          background: isOwn ? '#800000' : '#f4f2f2',
          color: isOwn ? '#fff' : '#222',
          fontSize: 12.5,
          lineHeight: 1.55,
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 9.5, color: '#bbb', marginTop: 3, textAlign: isOwn ? 'right' : 'left', paddingRight: isOwn ? 2 : 0, paddingLeft: isOwn ? 0 : 4 }}>
          {formatTime(msg.timestamp)}
          {isOwn && <span style={{ marginLeft: 4 }}>{msg.isRead ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  )
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
function EmptyChat() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', gap: 10 }}>
      <EmptyIco />
      <p style={{ fontSize: 13, color: '#bbb' }}>Select a conversation to start messaging</p>
    </div>
  )
}

// ─── MAIN MESSAGES COMPONENT ─────────────────────────────────────────────────
export default function Messages({
  currentUserId,
  conversations: initialConversations,
}: {
  currentUserId: string
  conversations: Conversation[]
}) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId]           = useState<string | null>(null)
  const [input, setInput]                 = useState('')
  const [search, setSearch]               = useState('')
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const activeConvo = conversations.find((c) => c.id === activeId) ?? null

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConvo?.messages.length])

  const filteredConvos = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectConvo = (id: string) => {
    setActiveId(id)
    setMobileChatOpen(true)
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    )
  }

  const handleSend = () => {
    if (!input.trim() || !activeId) return
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      content: input.trim(),
      timestamp: new Date(),
      isRead: false,
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.content, lastMessageTime: newMsg.timestamp }
          : c
      )
    )
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── SIDEBAR (conversation list) ────────────────────────────────────────────
  const sidebar = (
    <div style={{
      width: 280, minWidth: 280, borderRight: '1px solid #f0eeee',
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#fff',
    }}
      className="msg-sidebar"
    >
      {/* Header */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #f5f2f2' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>Messages</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f5f5', border: '1px solid #ece8e8', borderRadius: 8, padding: '6px 10px' }}>
          <SearchIco />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            style={{ border: 'none', background: 'transparent', fontSize: 11.5, color: '#333', outline: 'none', flex: 1 }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
        {filteredConvos.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: '#bbb' }}>No conversations found</div>
        ) : (
          filteredConvos.map((c) => (
            <ConvoItem key={c.id} convo={c} active={activeId === c.id} onClick={() => handleSelectConvo(c.id)} />
          ))
        )}
      </div>
    </div>
  )

  // ── CHAT PANEL ─────────────────────────────────────────────────────────────
  const chatPanel = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#fafafa' }}>
      {activeConvo ? (
        <>
          {/* Chat header */}
          <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: '#fff', borderBottom: '1px solid #f0eeee' }}>
            <button
              className="msg-back-btn"
              onClick={() => setMobileChatOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#800000', display: 'flex', padding: 4 }}
            >
              <BackIco />
            </button>
            <Avatar name={activeConvo.participantName} src={activeConvo.participantAvatar} size={34} role={activeConvo.participantRole} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{activeConvo.participantName}</div>
              <div style={{ fontSize: 10, color: activeConvo.participantRole === 'Admin' ? '#1a1a2e' : '#800000' }}>{activeConvo.participantRole}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {activeConvo.messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} isOwn={msg.senderId === currentUserId} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{ padding: '10px 16px', background: '#fff', borderTop: '1px solid #f0eeee', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 6, flexShrink: 0 }}>
              <AttachIco />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              style={{
                flex: 1, border: '1px solid #ece8e8', borderRadius: 10, padding: '8px 12px',
                fontSize: 12.5, resize: 'none', outline: 'none', background: '#f7f5f5',
                lineHeight: 1.5, maxHeight: 120, overflowY: 'auto', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: input.trim() ? '#800000' : '#e0dede',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <SendIco />
            </button>
          </div>
        </>
      ) : (
        <EmptyChat />
      )}
    </div>
  )

  return (
    <>
      <style>{`
        .msg-container { display: flex; height: 100%; }
        .msg-sidebar   { display: flex; }
        .msg-back-btn  { display: none; }
        @media (max-width: 640px) {
          .msg-sidebar { width: 100% !important; min-width: 100% !important; border-right: none !important; }
          .msg-container.chat-open .msg-sidebar { display: none !important; }
          .msg-container.chat-open .msg-chat   { display: flex !important; }
          .msg-chat { display: none; flex: 1; flex-direction: column; }
          .msg-back-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .msg-chat { display: flex; flex: 1; flex-direction: column; }
        }
      `}</style>

      <div
        className={`msg-container ${mobileChatOpen ? 'chat-open' : ''}`}
        style={{ height: '100%', border: '1px solid #f0eeee', borderRadius: 12, overflow: 'hidden', background: '#fff' }}
      >
        {sidebar}
        <div className="msg-chat">
          {chatPanel}
        </div>
      </div>
    </>
  )
}