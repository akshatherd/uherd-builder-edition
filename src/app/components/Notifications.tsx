import { useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Repeat2, AtSign, Users, Radio, Settings } from "lucide-react";
import { NOTIFICATIONS, Notification } from "./mockData";

const TABS = [
  { id: "all", label: "All" },
  { id: "mentions", label: "Mentions" },
  { id: "reactions", label: "Reactions" },
  { id: "communities", label: "Communities" },
  { id: "live", label: "Live" },
] as const;

function NotificationIcon({ type }: { type: Notification["type"] }) {
  const map = {
    like: { icon: Heart, color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
    comment: { icon: MessageCircle, color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
    follow: { icon: UserPlus, color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    repost: { icon: Repeat2, color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
    mention: { icon: AtSign, color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
    community: { icon: Users, color: "#22d3ee", bg: "rgba(34,211,238,0.15)" },
    live: { icon: Radio, color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  };
  const { icon: Icon, color, bg } = map[type];
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: bg, border: `1px solid ${color}33` }}
    >
      <Icon size={14} style={{ color }} />
    </div>
  );
}

export function Notifications() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filterMap: Record<string, Notification["type"][]> = {
    all: ["like", "comment", "follow", "repost", "mention", "community", "live"],
    mentions: ["mention"],
    reactions: ["like", "repost"],
    communities: ["community"],
    live: ["live"],
  };

  const filtered = notifications.filter(n => filterMap[activeTab].includes(n.type));
  const unreadCount = filtered.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-6 pt-6 pb-0"
        style={{
          background: "rgba(7,7,14,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: 22 }}>Notifications</h1>
            {unreadCount > 0 && (
              <div
                className="px-2.5 py-0.5 rounded-full"
                style={{ background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700 }}
              >
                {unreadCount}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}
              >
                Mark all read
              </button>
            )}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}
            >
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const count = notifications.filter(n =>
              filterMap[tab.id].includes(n.type) && !n.read
            ).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1.5 px-4 py-3 transition-all duration-150"
                style={{
                  color: active ? "#f1f5f9" : "#475569",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: active ? "#7c3aed" : "transparent",
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#7c3aed", fontSize: 9, color: "#fff", fontWeight: 700 }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications list */}
      <div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell size={48} style={{ color: "#1e1e30" }} className="mb-4" />
            <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: 18 }}>All caught up!</h3>
            <p style={{ color: "#475569", fontSize: 15 }}>No {activeTab === "all" ? "" : activeTab} notifications yet.</p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-4 px-6 py-4 cursor-pointer transition-all duration-150 relative"
              style={{
                borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--t-border)",
                background: notif.read ? "transparent" : "rgba(124,58,237,0.04)",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = notif.read ? "transparent" : "rgba(124,58,237,0.04)")}
            >
              {/* Unread dot */}
              {!notif.read && (
                <div
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#7c3aed" }}
                />
              )}

              {/* User avatar or icon */}
              <div className="relative flex-shrink-0">
                {notif.user ? (
                  <div className="relative">
                    <img
                      src={notif.user.avatar}
                      alt={notif.user.name}
                      className="w-11 h-11 rounded-full object-cover"
                      style={{ border: "2px solid rgba(255,255,255,0.07)" }}
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <NotificationIcon type={notif.type} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.1)" }}
                  >
                    <NotificationIcon type={notif.type} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.5 }}>
                  {notif.user && (
                    <span className="text-white" style={{ fontWeight: 700 }}>
                      {notif.user.name}{" "}
                    </span>
                  )}
                  {notif.content}
                </p>
                {notif.postPreview && (
                  <div
                    className="mt-2 px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#64748b",
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    "{notif.postPreview}"
                  </div>
                )}
                <span style={{ color: "#334155", fontSize: 12, marginTop: 4, display: "block" }}>
                  {notif.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
