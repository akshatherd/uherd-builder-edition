import { useState } from "react";
import { MapPin, Link2, Calendar, Settings, Share2, ChevronRight, Users } from "lucide-react";
import { USERS, POSTS, COMMUNITIES, formatNumber } from "./mockData";
import { PostCard } from "./PostCard";

const ME = USERS[3]; // codewitch_dev is our logged-in user

const MY_COMMUNITIES = COMMUNITIES.filter(c => c.isJoined);

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const myPosts = POSTS.filter((_, i) => i % 3 === 0);
  const mediaImages = [
    "https://images.unsplash.com/photo-1461749280687-aa659517da5b?w=300&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=300&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606983940588-4f5b2bce4dc4?w=300&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop&auto=format",
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Cover banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={ME.coverBanner || "https://images.unsplash.com/photo-1461749280687-aa659517da5b?w=800&h=200&fit=crop&auto=format"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(7,7,14,0) 50%, rgba(7,7,14,0.8) 100%)" }}
        />
      </div>

      {/* Profile info */}
      <div className="px-6 pb-0">
        <div className="flex items-end justify-between" style={{ marginTop: -40 }}>
          {/* Avatar */}
          <div className="relative">
            <img
              src={ME.avatar}
              alt={ME.name}
              className="w-24 h-24 rounded-full object-cover"
              style={{
                border: "4px solid #07070e",
                boxShadow: "0 0 24px rgba(124,58,237,0.4)",
              }}
            />
            {ME.verified && (
              <div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ background: "#7c3aed", fontSize: 12, border: "2px solid #07070e" }}
              >
                ✓
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-4">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
              }}
            >
              <Share2 size={16} />
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
              }}
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setIsFollowing(p => !p)}
              className="px-5 py-2 rounded-full transition-all duration-200"
              style={{
                background: isFollowing ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: isFollowing ? "1px solid rgba(255,255,255,0.1)" : "none",
                color: isFollowing ? "#94a3b8" : "#fff",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Outfit', sans-serif",
                boxShadow: isFollowing ? "none" : "0 0 16px rgba(124,58,237,0.35)",
              }}
            >
              {isFollowing ? "Following ✓" : "Follow"}
            </button>
          </div>
        </div>

        {/* Name + bio */}
        <div className="mt-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: 22 }}>{ME.name}</h2>
            {ME.badge && (
              <span
                className="px-2.5 py-0.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))",
                  border: "1px solid rgba(124,58,237,0.4)",
                  color: "#a78bfa",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {ME.badge}
              </span>
            )}
          </div>
          <div style={{ color: "#64748b", fontSize: 15, marginBottom: 10 }}>@{ME.handle}</div>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6 }}>{ME.bio}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-3">
            {ME.location && (
              <div className="flex items-center gap-1.5" style={{ color: "#64748b", fontSize: 13 }}>
                <MapPin size={13} />
                {ME.location}
              </div>
            )}
            {ME.website && (
              <div className="flex items-center gap-1.5" style={{ color: "#22d3ee", fontSize: 13 }}>
                <Link2 size={13} />
                {ME.website}
              </div>
            )}
            {ME.joinedDate && (
              <div className="flex items-center gap-1.5" style={{ color: "#64748b", fontSize: 13 }}>
                <Calendar size={13} />
                Joined {ME.joinedDate}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-6 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[
            { label: "Posts", value: ME.posts || 0 },
            { label: "Followers", value: ME.followers },
            { label: "Following", value: ME.following },
          ].map(stat => (
            <button key={stat.label} className="text-left group">
              <div className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>
                {formatNumber(stat.value)}
              </div>
              <div style={{ color: "#475569", fontSize: 13 }} className="group-hover:text-slate-400 transition-colors">
                {stat.label}
              </div>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {USERS.slice(0, 3).map(u => (
                <img key={u.id} src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" style={{ border: "1.5px solid #07070e" }} />
              ))}
            </div>
            <span style={{ color: "#64748b", fontSize: 12 }}>3 mutual friends</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-0">
          {["posts", "media", "communities", "about"].map(tab => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-4 capitalize transition-all duration-150"
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
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "posts" && (
          <div>
            {myPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {activeTab === "media" && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-3 gap-2">
              {mediaImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden cursor-pointer group" style={{ aspectRatio: "1" }}>
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "communities" && (
          <div className="px-6 py-6 space-y-3">
            {MY_COMMUNITIES.map(community => (
              <div
                key={community.id}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(13,13,26,0.8)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.95)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.8)")}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: community.color + "22", border: `1px solid ${community.color}44` }}
                >
                  {community.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white" style={{ fontWeight: 600, fontSize: 15 }}>{community.name}</div>
                  <div style={{ color: "#475569", fontSize: 13 }}>
                    <Users size={11} className="inline mr-1" />
                    {formatNumber(community.members)} members
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "#475569" }} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="px-6 py-6 space-y-5">
            {[
              { label: "Bio", value: ME.bio },
              { label: "Location", value: ME.location },
              { label: "Website", value: ME.website },
              { label: "Joined", value: ME.joinedDate },
              { label: "User type", value: "Developer" },
              { label: "Looking for", value: "Communities, Networking, Learning" },
            ].map(item => item.value && (
              <div key={item.label}>
                <div style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: "#cbd5e1", fontSize: 15 }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
