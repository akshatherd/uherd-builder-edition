import { useState } from "react";
import {
  Home, Compass, Users, Radio, Globe, MessageCircle,
  Bell, User, Plus, Zap, TrendingUp
} from "lucide-react";
import { CreatePostModal } from "./CreatePostModal";

type View = "home" | "explore" | "communities" | "live" | "sphere" | "messages" | "notifications" | "profile";

interface LeftSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  notificationCount?: number;
  messageCount?: number;
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "communities", label: "Communities", icon: Users },
  { id: "live", label: "Live Herds", icon: Radio },
  { id: "sphere", label: "HerdSphere", icon: Globe },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
] as const;

const ME = {
  name: "Alex Rivera",
  handle: "@codewitch_dev",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
};

export function LeftSidebar({ currentView, onNavigate, notificationCount = 3, messageCount = 4 }: LeftSidebarProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-screen flex flex-col z-40"
        style={{
          width: 260,
          background: "#07070e",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>
            U<span style={{ color: "#a78bfa" }}>Herd</span>
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = currentView === item.id;
            const Icon = item.icon;
            const badge =
              item.id === "notifications" ? notificationCount :
              item.id === "messages" ? messageCount : 0;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as View)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.1))"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(124,58,237,0.3)"
                    : "1px solid transparent",
                }}
              >
                {active && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #7c3aed, #06b6d4)" }}
                  />
                )}
                <div className="relative">
                  <Icon
                    size={20}
                    style={{ color: active ? "#a78bfa" : "#64748b" }}
                    className="transition-colors group-hover:text-slate-300"
                  />
                  {badge > 0 && (
                    <div
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#7c3aed", fontSize: 9, color: "#fff", fontWeight: 700 }}
                    >
                      {badge > 9 ? "9+" : badge}
                    </div>
                  )}
                </div>
                <span
                  className="transition-colors"
                  style={{
                    color: active ? "#f1f5f9" : "#94a3b8",
                    fontWeight: active ? 600 : 400,
                    fontSize: 15,
                  }}
                >
                  {item.label}
                </span>
                {item.id === "live" && (
                  <div
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ animation: "pulse 1.5s infinite" }} />
                    <span style={{ color: "#f87171", fontSize: 10, fontWeight: 600 }}>LIVE</span>
                  </div>
                )}
                {item.id === "sphere" && (
                  <TrendingUp size={13} className="ml-auto" style={{ color: "#22d3ee" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Create Post Button */}
        <div className="px-4 py-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 group"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              boxShadow: "0 0 20px rgba(124,58,237,0.35)",
              fontWeight: 600,
              color: "#fff",
              fontSize: 15,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(124,58,237,0.55)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,58,237,0.35)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <Plus size={18} />
            Create Post
          </button>
        </div>

        {/* User profile strip */}
        <div
          className="mx-3 mb-4 px-3 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onClick={() => onNavigate("profile")}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
        >
          <img
            src={ME.avatar}
            alt={ME.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            style={{ border: "2px solid rgba(124,58,237,0.5)" }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-white truncate" style={{ fontWeight: 600, fontSize: 14 }}>
              {ME.name}
            </div>
            <div className="truncate" style={{ color: "#64748b", fontSize: 12 }}>
              {ME.handle}
            </div>
          </div>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "#10b981" }}
          />
        </div>
      </aside>

      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
}
