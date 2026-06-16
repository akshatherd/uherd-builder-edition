import { useState } from "react";
import { Search, TrendingUp, Flame, Hash, X } from "lucide-react";
import { POSTS, COMMUNITIES, USERS, formatNumber } from "./mockData";
import { PostCard } from "./PostCard";

const TRENDING_HASHTAGS = [
  { tag: "GPT5Launch", posts: "142K", color: "#7c3aed" },
  { tag: "GameAwards2024", posts: "89K", color: "#06b6d4" },
  { tag: "CryptoBreakout", posts: "67K", color: "#10b981" },
  { tag: "AnimeFinale", posts: "54K", color: "#f43f5e" },
  { tag: "StartupFunding", posts: "41K", color: "#f59e0b" },
  { tag: "WebDev", posts: "38K", color: "#3b82f6" },
  { tag: "FitnessMotivation", posts: "34K", color: "#f97316" },
  { tag: "MusicDrop", posts: "28K", color: "#8b5cf6" },
  { tag: "TravelDiary", posts: "22K", color: "#14b8a6" },
  { tag: "FashionWeek", posts: "19K", color: "#d946ef" },
];

const CATEGORIES = [
  { label: "All", emoji: "✨" },
  { label: "Technology", emoji: "💻" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Finance", emoji: "💰" },
  { label: "Music", emoji: "🎵" },
  { label: "Fitness", emoji: "💪" },
  { label: "Art", emoji: "🎨" },
];

export function Explore() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"top" | "people" | "communities" | "posts">("top");

  const hasQuery = query.trim().length > 0;

  const filteredPosts = POSTS.filter(p =>
    p.content.toLowerCase().includes(query.toLowerCase())
  );
  const filteredUsers = USERS.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.handle.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCommunities = COMMUNITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Sticky search header */}
      <div
        className="sticky top-0 z-20 px-6 pt-6 pb-4"
        style={{
          background: "rgba(7,7,14,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h1 className="text-white mb-4" style={{ fontWeight: 700, fontSize: 22 }}>Explore</h1>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts, people, communities..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f1f5f9",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15,
              transition: "border-color 0.2s",
            }}
            onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.5)")}
            onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)")}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "#64748b" }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search tabs (only when searching) */}
        {hasQuery && (
          <div className="flex gap-0">
            {["top", "people", "communities", "posts"].map(tab => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className="px-4 py-2.5 capitalize transition-all duration-150"
                  style={{
                    color: active ? "#f1f5f9" : "#475569",
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                    borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: active ? "#7c3aed" : "transparent",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {/* Category chips (only when not searching) */}
        {!hasQuery && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200"
                style={{
                  background: activeCategory === cat.label
                    ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                    : "rgba(255,255,255,0.05)",
                  border: activeCategory === cat.label ? "none" : "1px solid rgba(255,255,255,0.08)",
                  color: activeCategory === cat.label ? "#fff" : "#64748b",
                  fontWeight: activeCategory === cat.label ? 700 : 400,
                  fontSize: 13,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search results */}
      {hasQuery ? (
        <div>
          {(activeTab === "top" || activeTab === "people") && filteredUsers.length > 0 && (
            <div>
              <div
                className="px-6 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>People</h3>
              </div>
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-150"
                  style={{ borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--t-border)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <img src={user.avatar} alt="" className="w-11 h-11 rounded-full object-cover" style={{ border: "2px solid rgba(124,58,237,0.3)" }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</span>
                      {user.verified && <span style={{ color: "#7c3aed", fontSize: 12 }}>✓</span>}
                    </div>
                    <div style={{ color: "#475569", fontSize: 13 }}>@{user.handle} · {formatNumber(user.followers)} followers</div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{user.bio.slice(0, 60)}...</div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-full"
                    style={{
                      background: user.isFollowing ? "rgba(255,255,255,0.06)" : "rgba(124,58,237,0.2)",
                      border: user.isFollowing ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(124,58,237,0.4)",
                      color: user.isFollowing ? "#64748b" : "#a78bfa",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {(activeTab === "top" || activeTab === "communities") && filteredCommunities.length > 0 && (
            <div>
              <div
                className="px-6 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h3 className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>Communities</h3>
              </div>
              {filteredCommunities.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-150"
                  style={{ borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--t-border)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: c.color + "22", border: `1px solid ${c.color}44` }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                    <div style={{ color: "#475569", fontSize: 13 }}>{formatNumber(c.members)} members · {c.activity}</div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-full"
                    style={{
                      background: c.isJoined ? "rgba(255,255,255,0.06)" : `${c.color}22`,
                      border: c.isJoined ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${c.color}55`,
                      color: c.isJoined ? "#64748b" : c.color,
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {c.isJoined ? "Joined" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {(activeTab === "top" || activeTab === "posts") && filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {filteredPosts.length === 0 && filteredUsers.length === 0 && filteredCommunities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Search size={48} style={{ color: "#1e1e30" }} className="mb-4" />
              <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: 18 }}>No results found</h3>
              <p style={{ color: "#475569", fontSize: 15 }}>Try searching for something else</p>
            </div>
          )}
        </div>
      ) : (
        /* Discovery content */
        <div className="px-6 py-6 space-y-8">
          {/* Trending Hashtags */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{ color: "#a78bfa" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Trending Topics</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TRENDING_HASHTAGS.map((ht, i) => (
                <button
                  key={ht.tag}
                  onClick={() => setQuery(ht.tag)}
                  className="flex items-center gap-3 p-4 rounded-xl text-left cursor-pointer transition-all duration-150"
                  style={{
                    background: "rgba(13,13,26,0.8)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${ht.color}44`;
                    (e.currentTarget as HTMLElement).style.background = `${ht.color}0a`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.8)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: ht.color + "20", border: `1px solid ${ht.color}44` }}
                  >
                    <Hash size={16} style={{ color: ht.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white truncate" style={{ fontWeight: 600, fontSize: 13 }}>{ht.tag}</div>
                    <div style={{ color: "#475569", fontSize: 11 }}>{ht.posts} posts</div>
                  </div>
                  {i < 3 && <Flame size={14} style={{ color: "#f97316", marginLeft: "auto" }} />}
                </button>
              ))}
            </div>
          </section>

          {/* Featured Posts */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flame size={18} style={{ color: "#f97316" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Trending Posts</h2>
            </div>
            <div>
              {POSTS.slice(0, 4).map(post => <PostCard key={post.id} post={post} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
