import { useState } from "react";
import { Flame, Star, Zap, Users } from "lucide-react";
import { PostCard } from "./PostCard";
import { CreatePostModal } from "./CreatePostModal";
import { POSTS } from "./mockData";

const ME = {
  name: "Alex Rivera",
  handle: "@codewitch_dev",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
};

const TABS = [
  { id: "for-you", label: "For You", icon: Zap },
  { id: "following", label: "Following", icon: Star },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "communities", label: "Communities", icon: Users },
] as const;

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState<string>("for-you");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div
        className="min-h-screen"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Sticky header */}
        <div
          className="sticky top-0 z-20"
          style={{
            background: "rgba(7,7,14,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="px-6 pt-4 pb-0">
            <h1 className="text-white mb-4" style={{ fontWeight: 700, fontSize: 22 }}>Home</h1>
            <div className="flex items-center gap-0">
              {TABS.map(tab => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex items-center gap-2 px-5 py-3 text-sm transition-all duration-200"
                    style={{
                      color: active ? "#f1f5f9" : "#475569",
                      fontWeight: active ? 600 : 400,
                      borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: active ? "#7c3aed" : "transparent",
                    }}
                  >
                    <Icon size={14} style={{ color: active ? "#a78bfa" : "#475569" }} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compose area */}
        <div
          className="px-6 py-4 flex items-start gap-3 cursor-pointer"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          onClick={() => setCreateOpen(true)}
        >
          <img
            src={ME.avatar}
            alt={ME.name}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
            style={{ border: "2px solid rgba(124,58,237,0.4)" }}
          />
          <div className="flex-1">
            <div
              className="px-5 py-3.5 rounded-2xl w-full text-left"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#475569",
                fontSize: 15,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.4)";
                (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.06)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
            >
              What's buzzing with the herd today?
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          {POSTS.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load more placeholder */}
        <div className="flex items-center justify-center py-8">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#7c3aed",
                  opacity: 0.6,
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </>
  );
}
