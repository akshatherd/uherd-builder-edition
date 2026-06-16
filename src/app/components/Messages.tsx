import { useState } from "react";
import { Search, Send, Plus, Smile, Phone, Video, MoreHorizontal } from "lucide-react";
import { CONVERSATIONS, THREAD_MESSAGES, Message, Conversation } from "./mockData";

const ME_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format";

export function Messages() {
  const [search, setSearch] = useState("");
  const [activeConvo, setActiveConvo] = useState<Conversation>(CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(THREAD_MESSAGES);
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(true);

  const filteredConvos = CONVERSATIONS.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "me",
      content: input.trim(),
      timestamp: "just now",
    }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="h-screen flex"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Conversation List */}
      <div
        className="flex-shrink-0 flex flex-col h-full"
        style={{
          width: 320,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "#07070e",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-white mb-4" style={{ fontWeight: 700, fontSize: 22 }}>Messages</h1>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f1f5f9",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filteredConvos.map(convo => {
            const active = activeConvo.id === convo.id;
            return (
              <button
                key={convo.id}
                onClick={() => { setActiveConvo(convo); setShowList(false); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-150"
                style={{
                  background: active ? "rgba(124,58,237,0.1)" : "transparent",
                  borderLeft: active ? "3px solid #7c3aed" : "3px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={convo.user.avatar}
                    alt={convo.user.name}
                    className="w-11 h-11 rounded-full object-cover"
                    style={{ border: "2px solid rgba(124,58,237,0.2)" }}
                  />
                  {convo.online && (
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                      style={{ background: "#10b981", border: "2px solid #07070e" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white" style={{ fontWeight: convo.unread > 0 ? 700 : 500, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
                      {convo.user.name}
                    </span>
                    <span style={{ color: "#475569", fontSize: 11 }}>{convo.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="truncate"
                      style={{
                        color: convo.unread > 0 ? "#94a3b8" : "#475569",
                        fontSize: 13,
                        fontWeight: convo.unread > 0 ? 500 : 400,
                        maxWidth: "180px",
                      }}
                    >
                      {convo.lastMessage}
                    </span>
                    {convo.unread > 0 && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1"
                        style={{ background: "#7c3aed", fontSize: 10, color: "#fff", fontWeight: 700 }}
                      >
                        {convo.unread}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* New message button */}
        <div className="p-4">
          <button
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <Plus size={16} />
            New Message
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
          style={{
            background: "rgba(7,7,14,0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="relative flex-shrink-0">
            <img
              src={activeConvo.user.avatar}
              alt={activeConvo.user.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid rgba(124,58,237,0.3)" }}
            />
            {activeConvo.online && (
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                style={{ background: "#10b981", border: "2px solid #07070e" }}
              />
            )}
          </div>
          <div className="flex-1">
            <div className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>{activeConvo.user.name}</div>
            <div style={{ color: activeConvo.online ? "#10b981" : "#475569", fontSize: 12 }}>
              {activeConvo.online ? "Online" : "Offline"}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[Phone, Video, MoreHorizontal].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ color: "#64748b" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#64748b";
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
          style={{ scrollbarWidth: "none" }}
        >
          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {!isMe && (
                  <img
                    src={activeConvo.user.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-auto"
                  />
                )}
                {isMe && (
                  <img
                    src={ME_AVATAR}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-auto"
                  />
                )}
                <div className={`flex flex-col gap-1 max-w-xs ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className="px-4 py-2.5 rounded-2xl"
                    style={{
                      background: isMe
                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                        : "rgba(255,255,255,0.06)",
                      color: "#f1f5f9",
                      fontSize: 14,
                      lineHeight: 1.5,
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      boxShadow: isMe ? "0 4px 12px rgba(124,58,237,0.25)" : "none",
                    }}
                  >
                    {msg.content}
                  </div>
                  <span style={{ color: "#334155", fontSize: 11 }}>{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div
          className="px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-end gap-3 p-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button className="mb-1 transition-all duration-150" style={{ color: "#475569" }}>
              <Smile size={20} />
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              className="flex-1 resize-none outline-none bg-transparent"
              style={{
                color: "#f1f5f9",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15,
                lineHeight: 1.5,
                caretColor: "#7c3aed",
                maxHeight: 120,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="mb-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: input.trim() ? "#7c3aed" : "rgba(255,255,255,0.05)",
                color: input.trim() ? "#fff" : "#475569",
                boxShadow: input.trim() ? "0 0 12px rgba(124,58,237,0.4)" : "none",
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
