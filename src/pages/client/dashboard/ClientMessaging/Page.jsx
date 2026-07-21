import Messages from "./Messages";
const MOCK_CONVERSATIONS = [
  {
    id: "convo-1",
    participantId: "va-001",
    participantName: "Sarah Johnson",
    participantRole: "VA",
    participantAvatar: null,
    lastMessage: "I have completed the tasks for today. Please review.",
    lastMessageTime: new Date(Date.now() - 1e3 * 60 * 5),
    unreadCount: 2,
    messages: [
      {
        id: "msg-1",
        senderId: "va-001",
        senderName: "Sarah Johnson",
        content: "Good morning! I have started working on the reports you assigned.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60),
        isRead: true
      },
      {
        id: "msg-2",
        senderId: "current-user",
        senderName: "You",
        content: "Great, please make sure to include the Q2 figures.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 45),
        isRead: true
      },
      {
        id: "msg-3",
        senderId: "va-001",
        senderName: "Sarah Johnson",
        content: "Understood! I will include all Q2 figures in the summary.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 30),
        isRead: true
      },
      {
        id: "msg-4",
        senderId: "va-001",
        senderName: "Sarah Johnson",
        content: "I have completed the tasks for today. Please review.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 5),
        isRead: false
      }
    ]
  },
  {
    id: "convo-2",
    participantId: "admin-001",
    participantName: "Support Admin",
    participantRole: "Admin",
    participantAvatar: null,
    lastMessage: "Your subscription has been renewed successfully.",
    lastMessageTime: new Date(Date.now() - 1e3 * 60 * 60 * 3),
    unreadCount: 0,
    messages: [
      {
        id: "msg-5",
        senderId: "admin-001",
        senderName: "Support Admin",
        content: "Hello! We wanted to let you know your subscription has been renewed successfully.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 3),
        isRead: true
      },
      {
        id: "msg-6",
        senderId: "current-user",
        senderName: "You",
        content: "Thank you for the update!",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 2),
        isRead: true
      }
    ]
  },
  {
    id: "convo-3",
    participantId: "va-002",
    participantName: "Mark Rivera",
    participantRole: "VA",
    participantAvatar: null,
    lastMessage: "Can we schedule a call for tomorrow?",
    lastMessageTime: new Date(Date.now() - 1e3 * 60 * 60 * 24),
    unreadCount: 1,
    messages: [
      {
        id: "msg-7",
        senderId: "va-002",
        senderName: "Mark Rivera",
        content: "Hi! I wanted to check in on the social media tasks.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 25),
        isRead: true
      },
      {
        id: "msg-8",
        senderId: "current-user",
        senderName: "You",
        content: "Hi Mark! Yes, let us catch up soon.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 24.5),
        isRead: true
      },
      {
        id: "msg-9",
        senderId: "va-002",
        senderName: "Mark Rivera",
        content: "Can we schedule a call for tomorrow?",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 24),
        isRead: false
      }
    ]
  }
];
function ClientMessagingPage() {
  const currentUserId = "current-user";
  return <div style={{ height: "calc(100vh - 56px - 32px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e" }}>Messaging</h1>
        <p style={{ fontSize: 11.5, color: "#aaa", marginTop: 2 }}>
          Chat with your Virtual Assistants and support team.
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Messages
    currentUserId={currentUserId}
    conversations={MOCK_CONVERSATIONS}
  />
      </div>
    </div>;
}
export {
  ClientMessagingPage as default
};
