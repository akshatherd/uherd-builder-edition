import { useState, useEffect } from "react";
import { TrendingUp, Star, Users, Flame, Calendar, Zap, Globe, ChevronRight, Loader2 } from "lucide-react";
import { CommunityPage } from "./CommunityPage";
import { supabase } from "../../supabase";

// Formatting utility for follower/member counts
export const formatNumber = (n: number): string => {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

// ── Static Mock Data (Preserved for UI integrity) ──
const USERS = [
  { id: "1", name: "Nova Chen", handle: "nova_chen", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", verified: true, badge: "Creator", followers: 45200, coverBanner: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800" },
  { id: "2", name: "Rex Rodriguez", handle: "gamer_rex", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", verified: true, badge: "Creator", followers: 128000, coverBanner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800" },
  { id: "3", name: "Sarah Kim", handle: "startup_sarah", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", verified: false, badge: "Founder", followers: 22400 },
  { id: "4", name: "Alex Rivera", handle: "codewitch_dev", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", verified: true, badge: "Developer", followers: 8400 },
  { id: "5", name: "Lucia Fernandez", handle: "lens_lucia", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", verified: true, badge: "Photographer", followers: 67000, coverBanner: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800" },
  { id: "6", name: "Felix Wagner", handle: "felix_fit", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", verified: false, badge: "Athlete", followers: 89000 },
];

const TOP_POSTS_THIS_WEEK = [
  { rank: 1, user: USERS[5], content: "6 months transformation. Same person, different mindset, completely different body.", likes: 31200, community: "FitnessFam", emoji: "💪" },
  { rank: 2, user: USERS[2], content: "🚀 We just crossed $1M ARR bootstrapped in 18 months. No VC, no debt.", likes: 12400, community: "IndieHackers", emoji: "🚀" },
  { rank: 3, user: USERS[4], content: "Golden hour in Santorini. No filter, no editing. Just pure magic 🌅", likes: 24680, community: "PhotographyPro", emoji: "📸" },
  { rank: 4, user: USERS[0], content: "GPT-5 just dropped and I've been running evals for the past 6 hours straight.", likes: 2847, community: "AI & ML", emoji: "🤖" },
];

function TrendingPeopleCard({ user }: { user: typeof USERS[0] }) {
  const [following, setFollowing] = useState(false);
  return (
    <div
      className="flex-shrink-0 w-48 p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer"
      style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}
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
        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" style={{ border: "2px solid rgba(124,58,237,0.4)" }} />
        {user.verified && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: "#7c3aed", fontSize: 10 }}>✓</div>
        )}
      </div>
      <div className="text-white mb-0.5" style={{ fontWeight: 700, fontSize: 13 }}>{user.name}</div>
      <div style={{ color: "#475569", fontSize: 11, marginBottom: 4 }}>@{user.handle}</div>
      {user.badge && (
        <div className="px-2 py-0.5 rounded-full mb-3" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", fontSize: 10, fontWeight: 700 }}>
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
          color: following ? "#94a3b8" : "#fff", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
        }}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

// ── Main Page Component ──
export function HerdSphere() {
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  
  // Real Database States
  const [realCommunities, setRealCommunities] = useState<any[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedCommunityId) return;

    const fetchSphereData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Popular Communities straight from Supabase
        const { data: comms } = await supabase.from('communities').select('*').limit(5);
        if (comms) setRealCommunities(comms);

        // 2. Fetch Live Events straight from database
        const { data: events } = await supabase.from('herd_events').select('*').order('created_at', { ascending: true });
        if (events) setLiveEvents(events);

      } catch (error) {
        console.error("Error loading HerdSphere infrastructure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSphereData();

    // 3. Realtime Listener for Event RSVPs!
    const channel = supabase.channel('events_channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'herd_events' }, (payload) => {
        setLiveEvents(current => current.map(e => e.id === payload.new.id ? payload.new : e));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedCommunityId]);

  const handleToggleRSVP = async (eventId: string, currentCount: number) => {
    const hasRsvped = rsvpedEvents.has(eventId);
    const newCount = hasRsvped ? Math.max(0, currentCount - 1) : currentCount + 1;

    // Optimistic UI Update
    setRsvpedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });

    // Database push
    await supabase.from('herd_events').update({ attending_count: newCount }).eq('id', eventId);
  };

  // ── ROUTING: Render Chat Room if a community is clicked ──
  if (selectedCommunityId) {
    return <CommunityPage communityId={selectedCommunityId} onBack={() => setSelectedCommunityId(null)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#07070E]">
        <Loader2 className="animate-spin text-cyan-500 w-10 h-10 mb-4" />
        <span className="text-gray-400 text-sm font-medium">Analyzing UHerd Trends...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070E] custom-scrollbar overflow-y-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-6 pt-6 pb-4"
        style={{ background: "rgba(7,7,14,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
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
            {USERS.filter(u => u.badge === "Creator" || u.badge === "Photographer").slice(0, 4).map(user => (
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
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid rgba(124,58,237,0.5)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white" style={{ fontWeight: 700, fontSize: 13 }}>{user.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 11 }}>{formatNumber(user.followers)} followers</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(124,58,237,0.8)", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                    ↑ Rising
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── LIVE DATABASE: Popular Communities ── */}
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
            {realCommunities.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm bg-[#13131a] rounded-xl border border-white/5">No active communities found. Create one to get started!</div>
            ) : (
              realCommunities.map((community, i) => (
                <div
                  key={community.id}
                  onClick={() => setSelectedCommunityId(community.id)} // Routes to Chat Room!
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                >
                  <span style={{ color: "#475569", fontWeight: 700, fontSize: 16, minWidth: 28 }}>#{i + 1}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden" style={{ background: (community.color || '#7c3aed') + "22", border: `1px solid ${community.color || '#7c3aed'}44` }}>
                    {community.avatar_url ? <img src={community.avatar_url} className="w-full h-full object-cover" /> : community.icon || '🏘️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white" style={{ fontWeight: 600, fontSize: 14 }}>{community.name}</span>
                      <Flame size={12} style={{ color: "#f97316" }} />
                    </div>
                    <div style={{ color: "#475569", fontSize: 12 }}>
                      {formatNumber(community.totalMembers || 1)} members · active today
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "#475569" }} />
                </div>
              ))
            )}
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
                style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.95)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.8)")}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: post.rank === 1 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : post.rank === 2 ? "rgba(203,213,225,0.15)" : post.rank === 3 ? "rgba(180,83,9,0.2)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  {post.rank === 1 ? "🥇" : post.rank === 2 ? "🥈" : post.rank === 3 ? "🥉" : `#${post.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={post.user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-white" style={{ fontWeight: 600, fontSize: 13 }}>{post.user.name}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", fontSize: 10, fontWeight: 700 }}>
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

        {/* ── LIVE DATABASE: Events ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: "#22d3ee" }} />
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Live Events</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {liveEvents.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm bg-[#13131a] rounded-xl border border-white/5">No upcoming events scheduled.</div>
            ) : (
              liveEvents.map((event) => {
                const isRsvped = rsvpedEvents.has(event.id);
                return (
                  <div
                    key={event.id}
                    className="relative p-5 rounded-2xl flex items-center gap-5 overflow-hidden cursor-pointer transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${event.color_theme}15, rgba(13,13,26,0.8))`,
                      border: `1px solid ${event.color_theme}30`,
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.border = `1px solid ${event.color_theme}60`)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.border = `1px solid ${event.color_theme}30`)}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: event.color_theme + "30", border: `1px solid ${event.color_theme}50` }}
                    >
                      {event.icon_emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white" style={{ fontWeight: 700, fontSize: 16 }}>{event.title}</h3>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        📅 {event.event_date} · 👥 {formatNumber(event.attending_count)} attending
                      </div>
                    </div>
                    <div>
                      <span
                        className="px-3 py-1.5 rounded-full block mb-2"
                        style={{
                          background: event.status_label === "Today" ? "rgba(239,68,68,0.2)" : `${event.color_theme}20`,
                          border: `1px solid ${event.status_label === "Today" ? "rgba(239,68,68,0.4)" : event.color_theme + "50"}`,
                          color: event.status_label === "Today" ? "#f87171" : event.color_theme,
                          fontSize: 11, fontWeight: 700, textAlign: "center", textTransform: "uppercase"
                        }}
                      >
                        {event.status_label}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleRSVP(event.id, event.attending_count); }}
                        className="w-full px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: isRsvped ? "rgba(255,255,255,0.1)" : event.color_theme,
                          color: isRsvped ? "white" : "#fff",
                          border: isRsvped ? "1px solid rgba(255,255,255,0.3)" : "none",
                          fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {isRsvped ? "✓ RSVP'd" : "RSVP"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
              { topic: "Is AGI actually coming in 2026?", replies: 2341, community: "AI & ML", hot: true },
              { topic: "Best game of the decade is...", replies: 1890, community: "Gaming", hot: true },
              { topic: "Bull or bear market? The data says...", replies: 1234, community: "Finance" },
              { topic: "Frieren finale ruined me emotionally", replies: 3456, community: "Anime", hot: true },
            ].map((disc, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl cursor-pointer transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
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
                  <span style={{ color: "#64748b", fontSize: 11 }}>💬 {formatNumber(disc.replies)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}