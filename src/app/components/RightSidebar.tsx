import { useState } from "react";
import { TrendingUp, Radio, Calendar, ChevronRight, Flame } from "lucide-react";
import { USERS, COMMUNITIES, ROOMS, formatNumber } from "./mockData";

interface RightSidebarProps {
  onNavigate?: (view: string) => void;
}

const TRENDING_TOPICS = [
  { tag: "#GPT5Launch", posts: "142K", category: "Technology", hot: true },
  { tag: "#GameAwards2024", posts: "89K", category: "Gaming", hot: true },
  { tag: "#CryptoBreakout", posts: "67K", category: "Finance" },
  { tag: "#AnimeFinale", posts: "54K", category: "Entertainment" },
  { tag: "#StartupFunding", posts: "41K", category: "Business" },
  { tag: "#WebDev", posts: "38K", category: "Technology" },
];

const EVENTS = [
  { name: "UHerd Creator Summit", date: "June 20", attendees: 2341, emoji: "🚀" },
  { name: "AI & ML Hackathon", date: "June 22", attendees: 891, emoji: "🤖" },
  { name: "Gaming Championship", date: "June 25", attendees: 5670, emoji: "🎮" },
];

export function RightSidebar({ onNavigate }: RightSidebarProps) {
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);

  const toggleFollow = (id: string) =>
    setFollowedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleJoin = (id: string) =>
    setJoinedCommunities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const suggestedUsers = USERS.filter(u => !u.isFollowing).slice(0, 3);
  const suggestedCommunities = COMMUNITIES.filter(c => !c.isJoined).slice(0, 3);
  const liveRooms = ROOMS.filter(r => r.isLive).slice(0, 2);

  return (
    <aside
      className="fixed right-0 top-0 h-screen overflow-y-auto"
      style={{
        width: 300,
        background: "#07070e",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Outfit', sans-serif",
        scrollbarWidth: "none",
      }}
    >
      <div className="p-4 space-y-5 pt-6">

        {/* Trending Topics */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "#a78bfa" }} />
              <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>Trending</h3>
            </div>
            <button style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600 }}>See all</button>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {TRENDING_TOPICS.map((topic, i) => (
              <button
                key={i}
                className="w-full flex items-start justify-between px-4 py-3 text-left transition-all duration-150 group"
                style={{ borderBottom: i < TRENDING_TOPICS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{topic.tag}</span>
                    {topic.hot && <Flame size={12} style={{ color: "#f97316" }} />}
                  </div>
                  <div style={{ color: "#475569", fontSize: 11 }}>{topic.category} · {topic.posts} posts</div>
                </div>
                <ChevronRight size={14} style={{ color: "#475569" }} className="mt-1 group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </div>
        </section>

        {/* Suggested Users */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>People For You</h3>
            <button style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600 }}>See all</button>
          </div>
          <div className="space-y-3">
            {suggestedUsers.map(user => {
              const followed = followedUsers.includes(user.id);
              return (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ border: "2px solid rgba(124,58,237,0.3)" }}
                    />
                    {user.verified && (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "#7c3aed", fontSize: 8 }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-white truncate" style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</span>
                    </div>
                    <div style={{ color: "#475569", fontSize: 11 }}>@{user.handle} · {formatNumber(user.followers)} followers</div>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className="px-3 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: followed ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.07)",
                      border: followed ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      color: followed ? "#a78bfa" : "#94a3b8",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {followed ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Suggested Communities */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>Communities For You</h3>
            <button style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600 }}>See all</button>
          </div>
          <div className="space-y-3">
            {suggestedCommunities.map(community => {
              const joined = joinedCommunities.includes(community.id) || community.isJoined;
              return (
                <div key={community.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: community.color + "22", border: `1px solid ${community.color}44` }}
                  >
                    {community.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate" style={{ fontWeight: 600, fontSize: 13 }}>{community.name}</div>
                    <div style={{ color: "#475569", fontSize: 11 }}>{formatNumber(community.members)} members</div>
                  </div>
                  <button
                    onClick={() => toggleJoin(community.id)}
                    className="px-3 py-1.5 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: joined ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.07)",
                      border: joined ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      color: joined ? "#22d3ee" : "#94a3b8",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {joined ? "Joined" : "Join"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Herds Now */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio size={16} style={{ color: "#f43f5e" }} />
              <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>Live Now</h3>
            </div>
          </div>
          <div className="space-y-2">
            {liveRooms.map(room => (
              <div
                key={room.id}
                className="p-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white" style={{ fontWeight: 600, fontSize: 12, flex: 1, lineHeight: 1.4 }}>
                    {room.name}
                  </p>
                  <div
                    className="flex items-center gap-1 ml-2 flex-shrink-0"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "1px 6px" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ animation: "pulse 1.5s infinite" }} />
                    <span style={{ color: "#f87171", fontSize: 9, fontWeight: 700 }}>LIVE</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {room.speakers.slice(0, 3).map((s, i) => (
                      <img
                        key={i}
                        src={s.avatar}
                        alt={s.name}
                        className="w-5 h-5 rounded-full object-cover"
                        style={{ border: "1.5px solid #07070e" }}
                      />
                    ))}
                  </div>
                  <span style={{ color: "#64748b", fontSize: 11 }}>
                    {formatNumber(room.listeners)} listening
                    {room.friendsIn ? ` · ${room.friendsIn} friends` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="pb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: "#22d3ee" }} />
              <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>Upcoming Events</h3>
            </div>
          </div>
          <div className="space-y-2">
            {EVENTS.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
                >
                  {event.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white" style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{event.name}</div>
                  <div style={{ color: "#475569", fontSize: 11 }}>{event.date} · {formatNumber(event.attendees)} going</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        aside::-webkit-scrollbar { display: none; }
      `}</style>
    </aside>
  );
}
