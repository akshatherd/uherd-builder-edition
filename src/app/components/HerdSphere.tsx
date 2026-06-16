import { useState } from "react";
import { TrendingUp, Star, Users, Flame, Calendar, Zap, Globe, ChevronRight } from "lucide-react";
import { USERS, COMMUNITIES, POSTS, ROOMS, formatNumber } from "./mockData";

function TrendingPeopleCard({ user }: { user: typeof USERS[0] }) {
  const [following, setFollowing] = useState(user.isFollowing);
  return (
    <div
      className="flex-shrink-0 w-48 p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer"
      style={{
        background: "rgba(13,13,26,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(124,58,237,0.35)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div className="relative mb-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover"
          style={{ border: "2px solid rgba(124,58,237,0.4)" }}
        />
        {user.verified && (
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
            style={{ background: "#7c3aed", fontSize: 10 }}
          >
            ✓
          </div>
        )}
      </div>
      <div className="text-white mb-0.5" style={{ fontWeight: 700, fontSize: 13 }}>{user.name}</div>
      <div style={{ color: "#475569", fontSize: 11, marginBottom: 4 }}>@{user.handle}</div>
      {user.badge && (
        <div
          className="px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {user.badge}
        </div>
      )}
      <div style={{ color: "#64748b", fontSize: 11, marginBottom: 12 }}>
        {formatNumber(user.followers)} followers
      </div>
      <button
        onClick={() => setFollowing(p => !p)}
        className="w-full py-1.5 rounded-full transition-all duration-200"
        style={{
          background: following ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #7c3aed, #a78bfa)",
          border: following ? "1px solid rgba(255,255,255,0.1)" : "none",
          color: following ? "#94a3b8" : "#fff",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

const TOP_POSTS_THIS_WEEK = [
  {
    rank: 1,
    user: USERS[6],
    content: "6 months transformation. Same person, different mindset, completely different body.",
    likes: 31200,
    community: "FitnessFam",
    emoji: "💪",
  },
  {
    rank: 2,
    user: USERS[2],
    content: "🚀 We just crossed $1M ARR bootstrapped in 18 months. No VC, no debt.",
    likes: 12400,
    community: "IndieHackers",
    emoji: "🚀",
  },
  {
    rank: 3,
    user: USERS[4],
    content: "Golden hour in Santorini. No filter, no editing. Just pure magic 🌅",
    likes: 24680,
    community: "PhotographyPro",
    emoji: "📸",
  },
  {
    rank: 4,
    user: USERS[0],
    content: "GPT-5 just dropped and I've been running evals for the past 6 hours straight.",
    likes: 2847,
    community: "AI & ML",
    emoji: "🤖",
  },
];

const LIVE_EVENTS = [
  { title: "UHerd Creator Summit 2024", date: "June 20, 2024", attendees: 2341, status: "Upcoming", color: "#7c3aed", emoji: "🚀" },
  { title: "AI vs Humanity: The Big Debate", date: "June 18, 2024", attendees: 8902, status: "Tomorrow", color: "#06b6d4", emoji: "🤖" },
  { title: "Indie Game Showcase", date: "June 17, 2024", attendees: 1234, status: "Today", color: "#f59e0b", emoji: "🎮" },
];

export function HerdSphere() {
  const [activeSection, setActiveSection] = useState("all");

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-6 pt-6 pb-4"
        style={{
          background: "rgba(7,7,14,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Globe size={22} style={{ color: "#22d3ee" }} />
          <h1 className="text-white" style={{ fontWeight: 700, fontSize: 22 }}>HerdSphere</h1>
        </div>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Discover what's trending across the entire UHerd universe
        </p>
      </div>

      <div className="px-6 py-6 space-y-10">

        {/* Trending People */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} style={{ color: "#a78bfa" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Trending People</h2>
            </div>
            <button className="flex items-center gap-1" style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {USERS.map(user => <TrendingPeopleCard key={user.id} user={user} />)}
          </div>
        </section>

        {/* Rising Creators */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={18} style={{ color: "#fbbf24" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Rising Creators</h2>
            </div>
            <button className="flex items-center gap-1" style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {USERS.filter(u => u.badge === "Creator").slice(0, 4).map(user => (
              <div
                key={user.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                style={{ height: 160 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
              >
                {user.coverBanner ? (
                  <img src={user.coverBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a1a2e, #0d0d1a)" }} />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(7,7,14,0) 30%, rgba(7,7,14,0.95) 100%)" }}
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    style={{ border: "2px solid rgba(124,58,237,0.5)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white" style={{ fontWeight: 700, fontSize: 13 }}>{user.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 11 }}>{formatNumber(user.followers)} followers</div>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: "rgba(124,58,237,0.8)",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    ↑ Rising
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Communities */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} style={{ color: "#22d3ee" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Popular Communities</h2>
            </div>
            <button className="flex items-center gap-1" style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {COMMUNITIES.sort((a, b) => b.members - a.members).slice(0, 5).map((community, i) => (
              <div
                key={community.id}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              >
                <span style={{ color: "#475569", fontWeight: 700, fontSize: 16, minWidth: 28 }}>#{i + 1}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: community.color + "22", border: `1px solid ${community.color}44` }}
                >
                  {community.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white" style={{ fontWeight: 600, fontSize: 14 }}>{community.name}</span>
                    {community.activity === "Very Active" && (
                      <Flame size={12} style={{ color: "#f97316" }} />
                    )}
                  </div>
                  <div style={{ color: "#475569", fontSize: 12 }}>
                    {formatNumber(community.members)} members · {community.postsToday || 0} posts today
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "#475569" }} />
              </div>
            ))}
          </div>
        </section>

        {/* Top Posts This Week */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame size={18} style={{ color: "#f97316" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Top Posts This Week</h2>
            </div>
          </div>
          <div className="space-y-3">
            {TOP_POSTS_THIS_WEEK.map(post => (
              <div
                key={post.rank}
                className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(13,13,26,0.8)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.95)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.8)")}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: post.rank === 1
                      ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                      : post.rank === 2
                        ? "rgba(203,213,225,0.15)"
                        : post.rank === 3
                          ? "rgba(180,83,9,0.2)"
                          : "rgba(255,255,255,0.05)",
                  }}
                >
                  {post.rank === 1 ? "🥇" : post.rank === 2 ? "🥈" : post.rank === 3 ? "🥉" : `#${post.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={post.user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-white" style={{ fontWeight: 600, fontSize: 13 }}>{post.user.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", fontSize: 10, fontWeight: 700 }}
                    >
                      {post.emoji} {post.community}
                    </span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.4 }}>{post.content}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1" style={{ color: "#f43f5e" }}>
                    <span style={{ fontSize: 14 }}>❤️</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{formatNumber(post.likes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: "#22d3ee" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Live Events</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {LIVE_EVENTS.map((event, i) => (
              <div
                key={i}
                className="relative p-5 rounded-2xl flex items-center gap-5 overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${event.color}15, rgba(13,13,26,0.8))`,
                  border: `1px solid ${event.color}30`,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.border = `1px solid ${event.color}60`)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.border = `1px solid ${event.color}30`)}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: event.color + "30", border: `1px solid ${event.color}50` }}
                >
                  {event.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-white" style={{ fontWeight: 700, fontSize: 16 }}>{event.title}</h3>
                  <div style={{ color: "#64748b", fontSize: 13 }}>
                    📅 {event.date} · 👥 {formatNumber(event.attendees)} attending
                  </div>
                </div>
                <div>
                  <span
                    className="px-3 py-1.5 rounded-full block mb-2"
                    style={{
                      background: event.status === "Today" ? "rgba(239,68,68,0.2)" : `${event.color}20`,
                      border: `1px solid ${event.status === "Today" ? "rgba(239,68,68,0.4)" : event.color + "50"}`,
                      color: event.status === "Today" ? "#f87171" : event.color,
                      fontSize: 11,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {event.status}
                  </span>
                  <button
                    className="w-full px-3 py-1.5 rounded-full"
                    style={{
                      background: event.color,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    RSVP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Discussions */}
        <section className="pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} style={{ color: "#a78bfa" }} />
            <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Trending Discussions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { topic: "Is AGI actually coming in 2025?", replies: 2341, community: "AI & ML", hot: true },
              { topic: "Best game of the decade is...", replies: 1890, community: "Gaming", hot: true },
              { topic: "Bull or bear market? The data says...", replies: 1234, community: "Finance" },
              { topic: "Frieren finale ruined me emotionally", replies: 3456, community: "Anime", hot: true },
            ].map((disc, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              >
                {disc.hot && (
                  <span className="text-orange-400 text-xs font-bold mb-1 block">🔥 Hot</span>
                )}
                <p className="text-white mb-2" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>
                  {disc.topic}
                </p>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#475569", fontSize: 11 }}>#{disc.community}</span>
                  <span style={{ color: "#64748b", fontSize: 11 }}>
                    💬 {formatNumber(disc.replies)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
