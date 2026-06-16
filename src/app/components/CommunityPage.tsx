import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Send, Paperclip, Smile, Image as ImageIcon,
  Users, Info, Shield, Trash2, Ban, UserCheck, UserX,
  Lock, Globe, Hash, Crown, Star, Search, X, Check,
  ChevronDown, Volume2, AlertTriangle, MoreHorizontal, Download,
} from "lucide-react";
import {
  ExtendedCommunity, CommunityMessage, CommunityMember, JoinRequest,
  ME_ID, ME, MsgReaction, FILE_ICONS, formatMemberCount
} from "./CommunityData";

// ── Helpers ─────────────────────────────────────────────────────────────────

function getFileIcon(fileType?: string) {
  return FILE_ICONS[fileType || "default"] || FILE_ICONS.default;
}

function ReactionPill({ r, onToggle }: { r: MsgReaction; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 8px", borderRadius: 20, cursor: "pointer",
        background: r.reacted ? "rgba(124,58,237,0.2)" : "var(--t-surface)",
        border: `1px solid ${r.reacted ? "rgba(124,58,237,0.45)" : "var(--t-border)"}`,
        fontSize: 12, fontFamily: "'Outfit', sans-serif",
        color: r.reacted ? "#a78bfa" : "var(--t-text-3)",
        transition: "all 0.15s",
      }}
    >
      {r.emoji} <span style={{ fontWeight: 600 }}>{r.count}</span>
    </button>
  );
}

// ── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg, isAdmin, isMe, onDelete, onReact,
}: {
  msg: CommunityMessage;
  isAdmin: boolean;
  isMe: boolean;
  onDelete: (id: string) => void;
  onReact: (msgId: string, emoji: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const isMine = msg.senderId === ME_ID;

  if (msg.type === "system") {
    return (
      <div style={{ textAlign: "center", margin: "12px 0" }}>
        <span style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 20,
          background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)",
          color: "#a78bfa", fontSize: 12, fontFamily: "'Outfit', sans-serif",
        }}>
          {msg.content}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", gap: 10, marginBottom: 16, opacity: msg.isDeleted ? 0.4 : 1 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0, position: "relative" }}>
        <img
          src={msg.senderAvatar}
          alt={msg.senderName}
          style={{
            width: 36, height: 36, borderRadius: "50%", objectFit: "cover",
            border: msg.senderRole === "admin"
              ? "2px solid rgba(124,58,237,0.7)"
              : msg.senderRole === "moderator"
                ? "2px solid rgba(6,182,212,0.6)"
                : "2px solid var(--t-border)",
          }}
        />
        {msg.senderRole === "admin" && (
          <div style={{
            position: "absolute", bottom: -2, right: -2, width: 14, height: 14,
            borderRadius: "50%", background: "#7c3aed", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 7,
            border: "1.5px solid var(--t-bg-card)",
          }}>
            <Crown size={8} color="#fff" />
          </div>
        )}
        {msg.senderRole === "moderator" && (
          <div style={{
            position: "absolute", bottom: -2, right: -2, width: 14, height: 14,
            borderRadius: "50%", background: "#06b6d4", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 7,
            border: "1.5px solid var(--t-bg-card)",
          }}>
            <Shield size={8} color="#fff" />
          </div>
        )}
      </div>

      {/* Bubble content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
            {msg.senderName}
          </span>
          {msg.senderRole !== "member" && (
            <span style={{
              padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              background: msg.senderRole === "admin" ? "rgba(124,58,237,0.2)" : "rgba(6,182,212,0.15)",
              color: msg.senderRole === "admin" ? "#a78bfa" : "#22d3ee",
              border: msg.senderRole === "admin" ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(6,182,212,0.3)",
            }}>
              {msg.senderRole === "admin" ? "Admin" : "Mod"}
            </span>
          )}
          <span style={{ color: "var(--t-text-4)", fontSize: 11 }}>{msg.timestamp}</span>

          {/* Action buttons on hover */}
          {hover && !msg.isDeleted && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {["❤️", "😂", "🔥", "👍"].map(em => (
                <button
                  key={em}
                  onClick={() => onReact(msg.id, em)}
                  style={{
                    width: 26, height: 26, borderRadius: 8, border: "1px solid var(--t-border)",
                    background: "var(--t-surface)", cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.12s",
                  }}
                >
                  {em}
                </button>
              ))}
              {(isAdmin || isMine) && (
                <button
                  onClick={() => onDelete(msg.id)}
                  style={{
                    width: 26, height: 26, borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.1)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#f87171",
                  }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {msg.isDeleted ? (
          <p style={{ color: "var(--t-text-4)", fontSize: 13, fontStyle: "italic", fontFamily: "'Outfit', sans-serif" }}>
            Message deleted
          </p>
        ) : (
          <>
            {/* Text content */}
            {(msg.type === "text" || msg.type === "image" || msg.type === "file") && msg.content && msg.type === "text" && (
              <p style={{ color: "var(--t-text-2)", fontSize: 14, lineHeight: 1.6, fontFamily: "'Outfit', sans-serif", whiteSpace: "pre-line" }}>
                {msg.content}
              </p>
            )}

            {/* Image */}
            {msg.type === "image" && (
              <div>
                {msg.content && (
                  <p style={{ color: "var(--t-text-2)", fontSize: 14, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{msg.content}</p>
                )}
                <div style={{ borderRadius: 12, overflow: "hidden", display: "inline-block", maxWidth: 380 }}>
                  <img src={msg.imageUrl} alt="" style={{ width: "100%", display: "block", maxHeight: 280, objectFit: "cover" }} />
                </div>
              </div>
            )}

            {/* File attachment */}
            {msg.type === "file" && (
              <div>
                {msg.content && (
                  <p style={{ color: "var(--t-text-2)", fontSize: 14, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{msg.content}</p>
                )}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                  background: "var(--t-surface)", border: "1px solid var(--t-border)",
                  maxWidth: 320, transition: "background 0.15s",
                }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--t-surface-hover)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--t-surface)")}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                    background: "var(--t-surface-hover)",
                  }}>
                    {getFileIcon(msg.fileType)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "var(--t-text-1)", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif" }}>
                      {msg.fileName}
                    </div>
                    <div style={{ color: "var(--t-text-4)", fontSize: 11 }}>{msg.fileSize}</div>
                  </div>
                  <Download size={16} style={{ color: "var(--t-text-3)", flexShrink: 0 }} />
                </div>
              </div>
            )}

            {/* Reactions */}
            {msg.reactions.length > 0 && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                {msg.reactions.map(r => (
                  <ReactionPill key={r.emoji} r={r} onToggle={() => onReact(msg.id, r.emoji)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({ req, onAccept, onDeny }: {
  req: JoinRequest;
  onAccept: (id: string) => void;
  onDeny: (id: string) => void;
}) {
  return (
    <div style={{
      padding: 16, borderRadius: 16,
      background: "var(--t-surface)", border: "1px solid var(--t-border)",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <img src={req.avatar} alt={req.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--t-border)" }} />
        <div>
          <div style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{req.name}</div>
          <div style={{ color: "var(--t-text-4)", fontSize: 12 }}>@{req.handle} · {formatMemberCount(req.followersCount)} followers · {req.requestedAt}</div>
        </div>
      </div>
      {req.message && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, marginBottom: 12,
          background: "var(--t-bg)", border: "1px solid var(--t-border)",
          color: "var(--t-text-2)", fontSize: 13, lineHeight: 1.5,
          fontFamily: "'Outfit', sans-serif", fontStyle: "italic",
        }}>
          "{req.message}"
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onAccept(req.id)}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 10, cursor: "pointer",
            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
            color: "#34d399", fontWeight: 700, fontSize: 13,
            fontFamily: "'Outfit', sans-serif", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <UserCheck size={15} /> Accept
        </button>
        <button
          onClick={() => onDeny(req.id)}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 10, cursor: "pointer",
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
            color: "#f87171", fontWeight: 700, fontSize: 13,
            fontFamily: "'Outfit', sans-serif", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <UserX size={15} /> Deny
        </button>
      </div>
    </div>
  );
}

// ── CommunityPage ─────────────────────────────────────────────────────────────

interface CommunityPageProps {
  community: ExtendedCommunity;
  onBack: () => void;
  onUpdate: (c: ExtendedCommunity) => void;
}

type MainTab = "chat" | "members" | "about" | "admin";

export function CommunityPage({ community: initCommunity, onBack, onUpdate }: CommunityPageProps) {
  const [community, setCommunity] = useState<ExtendedCommunity>(initCommunity);
  const [activeTab, setActiveTab] = useState<MainTab>("chat");
  const [adminSubTab, setAdminSubTab] = useState<"requests" | "banned" | "settings">("requests");
  const [messages, setMessages] = useState<CommunityMessage[]>(community.messages);
  const [members, setMembers] = useState<CommunityMember[]>(community.members);
  const [requests, setRequests] = useState<JoinRequest[]>(community.pendingRequests);
  const [memberSearch, setMemberSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = community.adminId === ME_ID;
  const myMembership = members.find(m => m.id === ME_ID);
  const isMod = myMembership?.role === "moderator";
  const canManage = isAdmin || isMod;
  const pendingCount = requests.length;
  const bannedMembers = members.filter(m => m.isBanned);
  const activeMembers = members.filter(m => !m.isBanned);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const syncUp = (updated: Partial<ExtendedCommunity>) => {
    const next = { ...community, ...updated };
    setCommunity(next);
    onUpdate(next);
  };

  // ── Chat actions ────────────────────────────────────────────────────────────

  const handleSend = () => {
    if (!newMessage.trim() && !attachedFile && !attachedImage) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const base = {
      id: `msg-${Date.now()}`,
      senderId: ME_ID,
      senderName: ME.name,
      senderHandle: ME.handle,
      senderAvatar: ME.avatar,
      senderRole: (myMembership?.role || "member") as "admin" | "moderator" | "member",
      timestamp: timeStr,
      reactions: [] as MsgReaction[],
    };

    if (attachedImage) {
      setMessages(p => [...p, {
        ...base,
        id: base.id + "-img",
        content: newMessage,
        type: "image",
        imageUrl: attachedImage,
      }]);
    } else if (attachedFile) {
      setMessages(p => [...p, {
        ...base,
        id: base.id + "-file",
        content: newMessage,
        type: "file",
        fileName: attachedFile.name,
        fileSize: attachedFile.size,
        fileType: attachedFile.type,
      }]);
    } else {
      setMessages(p => [...p, { ...base, content: newMessage, type: "text" }]);
    }

    setNewMessage("");
    setAttachedFile(null);
    setAttachedImage(null);
  };

  const handleDelete = (id: string) => {
    setMessages(p => p.map(m => m.id === id ? { ...m, isDeleted: true } : m));
  };

  const handleReact = (msgId: string, emoji: string) => {
    setMessages(p => p.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions.find(r => r.emoji === emoji);
      if (existing) {
        return {
          ...m, reactions: m.reactions.map(r =>
            r.emoji === emoji ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted } : r
          ),
        };
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1, reacted: true }] };
    }));
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() || "default";
    const typeMap: Record<string, string> = { ts: "typescript", js: "javascript", pdf: "pdf", xlsx: "excel", xls: "excel", zip: "zip" };
    setAttachedFile({
      name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
      type: typeMap[ext] || "default",
    });
    setAttachedImage(null);
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachedImage(url);
    setAttachedFile(null);
  };

  // ── Admin actions ────────────────────────────────────────────────────────────

  const handleBan = (memberId: string) => {
    setMembers(p => p.map(m => m.id === memberId ? { ...m, isBanned: true } : m));
    setMessages(p => [...p, {
      id: `sys-${Date.now()}`, senderId: "system", senderName: "System",
      senderHandle: "", senderAvatar: "", senderRole: "member",
      content: `🚫 A member has been banned from this community by the admin.`,
      type: "system", timestamp: "now", reactions: [],
    }]);
  };

  const handleUnban = (memberId: string) => {
    setMembers(p => p.map(m => m.id === memberId ? { ...m, isBanned: false } : m));
  };

  const handleAcceptRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    setRequests(p => p.filter(r => r.id !== reqId));
    const newMember: CommunityMember = {
      id: req.userId, name: req.name, handle: req.handle,
      avatar: req.avatar, role: "member",
      joinedAt: "Just now", isBanned: false, isOnline: true,
    };
    setMembers(p => [...p, newMember]);
    setMessages(p => [...p, {
      id: `sys-${Date.now()}`, senderId: "system", senderName: "System",
      senderHandle: "", senderAvatar: "", senderRole: "member",
      content: `🎉 ${req.name} has joined the community!`,
      type: "system", timestamp: "now", reactions: [],
    }]);
    syncUp({ totalMembers: community.totalMembers + 1 });
  };

  const handleDenyRequest = (reqId: string) => {
    setRequests(p => p.filter(r => r.id !== reqId));
  };

  const handlePromote = (memberId: string) => {
    setMembers(p => p.map(m => m.id === memberId ? { ...m, role: "moderator" } : m));
  };

  // ── Filtered members ─────────────────────────────────────────────────────────

  const filteredMembers = activeMembers.filter(m =>
    memberSearch === "" ||
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.handle.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // ── Tabs config ─────────────────────────────────────────────────────────────

  const tabs: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "chat", label: "Chat", icon: <Volume2 size={15} /> },
    { id: "members", label: "Members", icon: <Users size={15} />, badge: activeMembers.length },
    { id: "about", label: "About", icon: <Info size={15} /> },
    ...(canManage ? [{ id: "admin" as MainTab, label: "Admin", icon: <Shield size={15} />, badge: pendingCount || undefined }] : []),
  ];

  const accentColor = community.color;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Outfit', sans-serif", background: "var(--t-bg)" }}>

      {/* ── Banner + header ── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ height: 130, overflow: "hidden", position: "relative" }}>
          <img src={community.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%)" }} />
        </div>

        {/* Back + actions */}
        <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 20, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
              borderRadius: 20, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
              border: community.type === "private" ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.2)",
              color: community.type === "private" ? "#fbbf24" : "rgba(255,255,255,0.9)",
              fontSize: 12, fontWeight: 700,
            }}>
              {community.type === "private" ? <Lock size={11} /> : <Globe size={11} />}
              {community.type === "private" ? "Private" : "Public"}
            </div>
            {isAdmin && (
              <div style={{
                display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
                borderRadius: 20, background: "rgba(124,58,237,0.6)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(167,139,250,0.5)", color: "#fff",
                fontSize: 12, fontWeight: 700,
              }}>
                <Crown size={11} /> Admin
              </div>
            )}
          </div>
        </div>

        {/* Community identity row */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 20px 16px",
          display: "flex", alignItems: "flex-end", gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, background: accentColor + "30",
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}40`,
          }}>
            {community.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{community.name}</h1>
            <div style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              <span>👥 {formatMemberCount(community.totalMembers)} members</span>
              <span>⚡ {community.postsToday || 0} posts today</span>
              {community.activity === "Very Active" && <span style={{ color: "#34d399" }}>🟢 Very Active</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: "flex", background: "var(--t-bg-card)",
        borderBottom: "1px solid var(--t-border)", flexShrink: 0, paddingLeft: 8,
      }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "12px 18px", cursor: "pointer",
                color: active ? "var(--t-text-1)" : "var(--t-text-4)",
                fontWeight: active ? 700 : 400, fontSize: 14,
                background: "transparent", border: "none",
                borderBottomWidth: 2, borderBottomStyle: "solid",
                borderBottomColor: active ? accentColor : "transparent",
                fontFamily: "'Outfit', sans-serif",
                position: "relative",
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{
                  padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                  background: tab.id === "admin" ? "#ef4444" : "rgba(124,58,237,0.2)",
                  color: tab.id === "admin" ? "#fff" : "#a78bfa",
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* ──── CHAT ──── */}
        {activeTab === "chat" && (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", scrollbarWidth: "none" }}>
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id} msg={msg}
                  isAdmin={canManage} isMe={msg.senderId === ME_ID}
                  onDelete={handleDelete} onReact={handleReact}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachment preview */}
            {(attachedFile || attachedImage) && (
              <div style={{
                padding: "8px 20px", background: "var(--t-surface)",
                borderTop: "1px solid var(--t-border)", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                {attachedImage ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={attachedImage} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
                    <button onClick={() => setAttachedImage(null)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>×</button>
                  </div>
                ) : attachedFile ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <span style={{ fontSize: 24 }}>{getFileIcon(attachedFile.type)}</span>
                    <div>
                      <div style={{ color: "var(--t-text-1)", fontWeight: 600, fontSize: 13 }}>{attachedFile.name}</div>
                      <div style={{ color: "var(--t-text-4)", fontSize: 11 }}>{attachedFile.size}</div>
                    </div>
                    <button onClick={() => setAttachedFile(null)} style={{ marginLeft: "auto", color: "var(--t-text-4)", background: "none", border: "none", cursor: "pointer" }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--t-border)", background: "var(--t-bg-card)", flexShrink: 0 }}>
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 10,
                padding: "10px 14px", borderRadius: 18,
                background: "var(--t-surface)", border: "1px solid var(--t-border)",
              }}>
                {/* Attach file */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ color: "var(--t-text-3)", cursor: "pointer", background: "none", border: "none", flexShrink: 0, padding: "2px" }}
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>
                {/* Attach image */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  style={{ color: "var(--t-text-3)", cursor: "pointer", background: "none", border: "none", flexShrink: 0, padding: "2px" }}
                  title="Attach image"
                >
                  <ImageIcon size={18} />
                </button>

                <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileAttach} />
                <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageAttach} />

                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={`Message ${community.name}...`}
                  rows={1}
                  style={{
                    flex: 1, resize: "none", background: "transparent", border: "none",
                    outline: "none", color: "var(--t-text-1)", fontSize: 14,
                    fontFamily: "'Outfit', sans-serif", lineHeight: 1.5, maxHeight: 100,
                    caretColor: accentColor,
                  }}
                />

                <button
                  onClick={() => setShowEmojiPicker(p => !p)}
                  style={{ color: "var(--t-text-3)", cursor: "pointer", background: "none", border: "none", flexShrink: 0 }}
                >
                  <Smile size={18} />
                </button>

                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() && !attachedFile && !attachedImage}
                  style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: (newMessage.trim() || attachedFile || attachedImage)
                      ? `linear-gradient(135deg, ${accentColor}, #06b6d4)`
                      : "var(--t-surface-hover)",
                    border: "none", cursor: (newMessage.trim() || attachedFile || attachedImage) ? "pointer" : "not-allowed",
                    boxShadow: (newMessage.trim() || attachedFile || attachedImage) ? `0 0 12px ${accentColor}40` : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Send size={15} color={(newMessage.trim() || attachedFile || attachedImage) ? "#fff" : "var(--t-text-4)"} />
                </button>
              </div>
              {showEmojiPicker && (
                <div style={{
                  display: "flex", gap: 6, flexWrap: "wrap",
                  padding: "10px 14px", background: "var(--t-surface)",
                  borderRadius: 14, border: "1px solid var(--t-border)", marginTop: 8,
                }}>
                  {["😂", "🔥", "❤️", "👍", "😮", "🎉", "💯", "🚀", "👏", "✨", "🤔", "😭"].map(e => (
                    <button key={e} onClick={() => { setNewMessage(p => p + e); setShowEmojiPicker(false); }}
                      style={{ fontSize: 22, cursor: "pointer", background: "none", border: "none", padding: 2 }}>
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ──── MEMBERS ──── */}
        {activeTab === "members" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", scrollbarWidth: "none" }}>
            {/* Search */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--t-text-4)" }} />
              <input
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                placeholder="Search members..."
                style={{
                  width: "100%", padding: "10px 14px 10px 36px", borderRadius: 14, outline: "none",
                  background: "var(--t-surface)", border: "1px solid var(--t-border)",
                  color: "var(--t-text-1)", fontFamily: "'Outfit', sans-serif", fontSize: 14,
                }}
              />
            </div>

            {/* Member count summary */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { label: "Total", count: activeMembers.length, color: accentColor },
                { label: "Online", count: activeMembers.filter(m => m.isOnline).length, color: "#10b981" },
                { label: "Admins", count: activeMembers.filter(m => m.role === "admin").length, color: "#7c3aed" },
                { label: "Mods", count: activeMembers.filter(m => m.role === "moderator").length, color: "#06b6d4" },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "8px 16px", borderRadius: 12,
                  background: s.color + "15", border: `1px solid ${s.color}35`,
                  textAlign: "center",
                }}>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: 20 }}>{s.count}</div>
                  <div style={{ color: "var(--t-text-4)", fontSize: 11 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Member list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 14,
                    background: "var(--t-surface)", border: "1px solid var(--t-border)",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--t-surface-hover)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--t-surface)")}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img src={member.avatar} alt={member.name} style={{
                      width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                      border: member.role === "admin"
                        ? "2px solid rgba(124,58,237,0.7)"
                        : member.role === "moderator"
                          ? "2px solid rgba(6,182,212,0.6)"
                          : "2px solid var(--t-border)",
                    }} />
                    {member.isOnline && (
                      <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: "#10b981", border: "2px solid var(--t-bg-card)" }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 14 }}>{member.name}</span>
                      {member.role !== "member" && (
                        <span style={{
                          padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: member.role === "admin" ? "rgba(124,58,237,0.2)" : "rgba(6,182,212,0.15)",
                          color: member.role === "admin" ? "#a78bfa" : "#22d3ee",
                          border: `1px solid ${member.role === "admin" ? "rgba(124,58,237,0.35)" : "rgba(6,182,212,0.3)"}`,
                        }}>
                          {member.role === "admin" ? "👑 Admin" : "🛡️ Mod"}
                        </span>
                      )}
                      {member.id === ME_ID && (
                        <span style={{ padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
                          You
                        </span>
                      )}
                    </div>
                    <div style={{ color: "var(--t-text-4)", fontSize: 12 }}>
                      @{member.handle} · Joined {member.joinedAt} · {member.isOnline ? "🟢 Online" : "⚫ Offline"}
                    </div>
                  </div>

                  {/* Admin controls */}
                  {isAdmin && member.id !== ME_ID && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {member.role === "member" && (
                        <button
                          onClick={() => handlePromote(member.id)}
                          title="Promote to Moderator"
                          style={{
                            width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                            background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "#22d3ee",
                          }}
                        >
                          <Star size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleBan(member.id)}
                        title="Ban Member"
                        style={{
                          width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171",
                        }}
                      >
                        <Ban size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──── ABOUT ──── */}
        {activeTab === "about" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", scrollbarWidth: "none" }}>
            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>About</h3>
              <p style={{ color: "var(--t-text-2)", fontSize: 14, lineHeight: 1.7 }}>{community.description}</p>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Type",      value: community.type === "private" ? "🔒 Private" : "🌐 Public" },
                { label: "Category",  value: `📂 ${community.category}` },
                { label: "Created",   value: `📅 ${community.createdAt}` },
                { label: "Activity",  value: community.activity === "Very Active" ? "🔥 Very Active" : community.activity === "Active" ? "⚡ Active" : "📈 Growing" },
              ].map(info => (
                <div key={info.label} style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: "var(--t-surface)", border: "1px solid var(--t-border)",
                }}>
                  <div style={{ color: "var(--t-text-4)", fontSize: 11, marginBottom: 4 }}>{info.label}</div>
                  <div style={{ color: "var(--t-text-1)", fontWeight: 600, fontSize: 13 }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 15, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Hash size={14} style={{ color: accentColor }} /> Tags
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {community.tags.map(tag => (
                  <span key={tag} style={{
                    padding: "5px 14px", borderRadius: 20,
                    background: accentColor + "18", border: `1px solid ${accentColor}35`,
                    color: accentColor, fontSize: 13, fontWeight: 600,
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Rules */}
            {community.rules.length > 0 && (
              <div>
                <h3 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={14} style={{ color: "#f59e0b" }} /> Community Rules
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {community.rules.map((rule, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12,
                      background: "var(--t-surface)", border: "1px solid var(--t-border)",
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: accentColor + "20", color: accentColor,
                        fontSize: 12, fontWeight: 800,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ color: "var(--t-text-2)", fontSize: 14, lineHeight: 1.5, flex: 1 }}>{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──── ADMIN PANEL ──── */}
        {activeTab === "admin" && canManage && (
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
            {/* Admin sub-tabs */}
            <div style={{
              display: "flex", gap: 0, padding: "0 20px",
              borderBottom: "1px solid var(--t-border)", background: "var(--t-bg-card)",
            }}>
              {[
                { id: "requests" as const, label: "Join Requests", badge: requests.length },
                { id: "banned" as const, label: "Banned Users", badge: bannedMembers.length },
                { id: "settings" as const, label: "Settings" },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setAdminSubTab(sub.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "12px 16px", cursor: "pointer",
                    color: adminSubTab === sub.id ? "var(--t-text-1)" : "var(--t-text-4)",
                    fontWeight: adminSubTab === sub.id ? 700 : 400, fontSize: 13,
                    background: "transparent", border: "none",
                    borderBottomWidth: 2, borderBottomStyle: "solid",
                    borderBottomColor: adminSubTab === sub.id ? "#ef4444" : "transparent",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {sub.label}
                  {sub.badge !== undefined && sub.badge > 0 && (
                    <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "#ef4444", color: "#fff" }}>
                      {sub.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ padding: "20px" }}>

              {/* Join Requests */}
              {adminSubTab === "requests" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <h3 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 16 }}>Pending Join Requests</h3>
                    {requests.length > 0 && (
                      <span style={{ padding: "2px 10px", borderRadius: 20, background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        {requests.length}
                      </span>
                    )}
                  </div>

                  {requests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                      <p style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>All caught up!</p>
                      <p style={{ color: "var(--t-text-4)", fontSize: 14 }}>No pending join requests.</p>
                    </div>
                  ) : (
                    requests.map(req => (
                      <RequestCard
                        key={req.id} req={req}
                        onAccept={handleAcceptRequest}
                        onDeny={handleDenyRequest}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Banned Users */}
              {adminSubTab === "banned" && (
                <div>
                  <h3 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
                    Banned Members ({bannedMembers.length})
                  </h3>

                  {bannedMembers.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🕊️</div>
                      <p style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No bans</p>
                      <p style={{ color: "var(--t-text-4)", fontSize: 14 }}>Your community is clean!</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {bannedMembers.map(member => (
                        <div key={member.id} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 14px", borderRadius: 14,
                          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                        }}>
                          <img src={member.avatar} alt={member.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", opacity: 0.5 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "var(--t-text-2)", fontWeight: 600, fontSize: 14, textDecoration: "line-through" }}>{member.name}</div>
                            <div style={{ color: "#f87171", fontSize: 11 }}>@{member.handle} · BANNED</div>
                          </div>
                          <button
                            onClick={() => handleUnban(member.id)}
                            style={{
                              padding: "6px 14px", borderRadius: 10, cursor: "pointer",
                              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                              color: "#34d399", fontWeight: 700, fontSize: 12,
                              fontFamily: "'Outfit', sans-serif",
                            }}
                          >
                            Unban
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings */}
              {adminSubTab === "settings" && (
                <div>
                  <h3 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Community Settings</h3>

                  {/* Type toggle */}
                  <div style={{
                    padding: "16px", borderRadius: 14, marginBottom: 12,
                    background: "var(--t-surface)", border: "1px solid var(--t-border)",
                  }}>
                    <div style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Community Type</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["public", "private"].map(type => (
                        <button
                          key={type}
                          onClick={() => syncUp({ type: type as "public" | "private" })}
                          style={{
                            flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                            background: community.type === type
                              ? (type === "public" ? "rgba(16,185,129,0.15)" : "rgba(251,191,36,0.15)")
                              : "var(--t-surface-hover)",
                            border: community.type === type
                              ? (type === "public" ? "1.5px solid rgba(16,185,129,0.5)" : "1.5px solid rgba(251,191,36,0.5)")
                              : "1px solid var(--t-border)",
                            color: community.type === type
                              ? (type === "public" ? "#34d399" : "#fbbf24")
                              : "var(--t-text-3)",
                            fontWeight: community.type === type ? 700 : 400,
                            fontSize: 14, fontFamily: "'Outfit', sans-serif",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}
                        >
                          {type === "public" ? <Globe size={14} /> : <Lock size={14} />}
                          {type === "public" ? "Public" : "Private"}
                        </button>
                      ))}
                    </div>
                    <p style={{ color: "var(--t-text-4)", fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
                      {community.type === "public"
                        ? "Anyone can discover and join this community without approval."
                        : "New members must be approved by an admin before joining."}
                    </p>
                  </div>

                  {/* Stats */}
                  <div style={{
                    padding: "16px", borderRadius: 14,
                    background: "var(--t-surface)", border: "1px solid var(--t-border)",
                  }}>
                    <div style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Community Stats</div>
                    {[
                      { label: "Total Members", value: formatMemberCount(community.totalMembers) },
                      { label: "Posts Today", value: community.postsToday || 0 },
                      { label: "Active Members", value: activeMembers.filter(m => m.isOnline).length },
                      { label: "Pending Requests", value: requests.length },
                      { label: "Banned Users", value: bannedMembers.length },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--t-border)" }}>
                        <span style={{ color: "var(--t-text-3)", fontSize: 13 }}>{s.label}</span>
                        <span style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 13 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
