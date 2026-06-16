import { useState } from "react";
import { Search, TrendingUp, Zap, Plus, Clock, Users, Lock, Globe, Check, Flame, Star } from "lucide-react";
import { CommunityPage } from "./CommunityPage";
import { CreateCommunityModal } from "./CreateCommunityModal";
import {
  ExtendedCommunity, EXTENDED_COMMUNITIES, RECOMMENDED_COMMUNITY_IDS,
  ME_ID, formatMemberCount,
} from "./CommunityData";

// ── Community Card ────────────────────────────────────────────────────────────

function CommunityCard({
  community,
  onOpen,
  onJoin,
  onRequest,
}: {
  community: ExtendedCommunity;
  onOpen: (c: ExtendedCommunity) => void;
  onJoin: (id: string) => void;
  onRequest: (id: string) => void;
}) {
  const isAdmin = community.adminId === ME_ID;
  const isPending = community.myRequestStatus === "pending";
  const isDenied = community.myRequestStatus === "denied";

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (community.type === "public" && !community.isJoined) {
      onJoin(community.id);
    } else if (community.type === "private" && !community.isJoined && !isPending) {
      onRequest(community.id);
    }
  };

  const joinLabel = () => {
    if (community.isJoined) return isAdmin ? "👑 Admin" : "✓ Joined";
    if (isPending) return "⏳ Pending";
    if (isDenied) return "✗ Denied";
    if (community.type === "private") return "Request to Join";
    return "Join";
  };

  const joinBg = () => {
    if (community.isJoined) return isAdmin ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.07)";
    if (isPending) return "rgba(251,191,36,0.12)";
    if (isDenied) return "rgba(239,68,68,0.1)";
    return `${community.color}22`;
  };

  const joinBorder = () => {
    if (community.isJoined) return isAdmin ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.12)";
    if (isPending) return "1px solid rgba(251,191,36,0.4)";
    if (isDenied) return "1px solid rgba(239,68,68,0.3)";
    return `1px solid ${community.color}55`;
  };

  const joinColor = () => {
    if (community.isJoined) return isAdmin ? "#a78bfa" : "var(--t-text-3)";
    if (isPending) return "#fbbf24";
    if (isDenied) return "#f87171";
    return community.color;
  };

  return (
    <div
      onClick={() => onOpen(community)}
      style={{
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        background: "var(--t-bg-card)", border: "1px solid var(--t-border)",
        transition: "all 0.2s ease",
        fontFamily: "'Outfit', sans-serif",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = `1px solid ${community.color}50`;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 10px 30px ${community.color}18`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid var(--t-border)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Banner */}
      <div style={{ height: 88, position: "relative", overflow: "hidden" }}>
        <img src={community.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Type badge */}
        <div style={{
          position: "absolute", top: 8, left: 10,
          display: "flex", alignItems: "center", gap: 4,
          padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(8px)",
          background: community.type === "private" ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.15)",
          border: community.type === "private" ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.25)",
          color: community.type === "private" ? "#fbbf24" : "#fff",
          fontSize: 10, fontWeight: 700,
        }}>
          {community.type === "private" ? <Lock size={9} /> : <Globe size={9} />}
          {community.type === "private" ? "Private" : "Public"}
        </div>

        {/* Activity badge */}
        <div style={{ position: "absolute", top: 8, right: 10 }}>
          <div style={{
            padding: "3px 9px", borderRadius: 20, backdropFilter: "blur(8px)",
            background: community.activity === "Very Active" ? "rgba(16,185,129,0.25)" : community.activity === "Active" ? "rgba(6,182,212,0.25)" : "rgba(245,158,11,0.25)",
            border: `1px solid ${community.activity === "Very Active" ? "rgba(16,185,129,0.5)" : community.activity === "Active" ? "rgba(6,182,212,0.5)" : "rgba(245,158,11,0.5)"}`,
            color: community.activity === "Very Active" ? "#34d399" : community.activity === "Active" ? "#22d3ee" : "#fbbf24",
            fontSize: 10, fontWeight: 700,
          }}>
            {community.activity === "Very Active" ? "🔥 Hot" : community.activity === "Active" ? "⚡ Active" : "📈 Growing"}
          </div>
        </div>

        {community.isNew && (
          <div style={{ position: "absolute", bottom: 8, left: 10, padding: "2px 8px", borderRadius: 20, background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 800 }}>
            NEW
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              background: community.color + "1a", border: `1.5px solid ${community.color}40`,
            }}>
              {community.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {community.name}
              </div>
              <div style={{ color: "var(--t-text-4)", fontSize: 11 }}>
                <Users size={9} style={{ display: "inline", marginRight: 3 }} />
                {formatMemberCount(community.totalMembers)} members
              </div>
            </div>
          </div>
          <button
            onClick={handleJoinClick}
            disabled={isDenied || (community.isJoined && !isAdmin) || isPending}
            style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 20,
              background: joinBg(), border: joinBorder(), color: joinColor(),
              fontWeight: 700, fontSize: 12, fontFamily: "'Outfit', sans-serif",
              cursor: community.isJoined || isPending || isDenied ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {joinLabel()}
          </button>
        </div>

        <p style={{ color: "var(--t-text-3)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
          {community.description.length > 80 ? community.description.slice(0, 80) + "…" : community.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {community.postsToday !== undefined && (
            <span style={{ color: "var(--t-text-4)", fontSize: 11 }}>
              <Zap size={10} style={{ display: "inline", color: "#a78bfa", marginRight: 3 }} />
              {community.postsToday} today
            </span>
          )}
          {community.growthRate && (
            <span style={{ fontSize: 11, color: "#34d399" }}>
              <TrendingUp size={10} style={{ display: "inline", marginRight: 3 }} />
              {community.growthRate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ title, icon, communities, onOpen, onJoin, onRequest }: {
  title: string;
  icon: React.ReactNode;
  communities: ExtendedCommunity[];
  onOpen: (c: ExtendedCommunity) => void;
  onJoin: (id: string) => void;
  onRequest: (id: string) => void;
}) {
  if (communities.length === 0) return null;
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {icon}
        <h2 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 18, fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
      </div>
      <div className="uherd-community-grid">
        {communities.map(c => (
          <CommunityCard key={c.id} community={c} onOpen={onOpen} onJoin={onJoin} onRequest={onRequest} />
        ))}
      </div>
    </section>
  );
}

// ── Main Communities Component ────────────────────────────────────────────────

export function Communities() {
  const [allCommunities, setAllCommunities] = useState<ExtendedCommunity[]>(EXTENDED_COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState<ExtendedCommunity | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Technology", "Gaming", "Finance", "Fitness", "Music", "Entertainment", "Fashion"];

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleJoin = (id: string) => {
    setAllCommunities(prev =>
      prev.map(c => c.id === id ? { ...c, isJoined: true, totalMembers: c.totalMembers + 1 } : c)
    );
  };

  const handleRequest = (id: string) => {
    setAllCommunities(prev =>
      prev.map(c => c.id === id ? { ...c, myRequestStatus: "pending" } : c)
    );
  };

  const handleCreate = (newCommunity: ExtendedCommunity) => {
    setAllCommunities(prev => [newCommunity, ...prev]);
    setSelectedCommunity(newCommunity);
  };

  const handleUpdateCommunity = (updated: ExtendedCommunity) => {
    setAllCommunities(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedCommunity(updated);
  };

  const handleOpen = (community: ExtendedCommunity) => {
    const latest = allCommunities.find(c => c.id === community.id) || community;
    setSelectedCommunity(latest);
  };

  // ── Community page view ──────────────────────────────────────────────────────

  if (selectedCommunity) {
    return (
      <CommunityPage
        community={selectedCommunity}
        onBack={() => setSelectedCommunity(null)}
        onUpdate={handleUpdateCommunity}
      />
    );
  }

  // ── Filter logic ─────────────────────────────────────────────────────────────

  const filtered = allCommunities.filter(c =>
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())) &&
    (activeCategory === "All" || c.category === activeCategory)
  );

  const recommended  = filtered.filter(c => RECOMMENDED_COMMUNITY_IDS.includes(c.id) && !c.isJoined).slice(0, 4);
  const yourComms    = filtered.filter(c => c.isJoined || c.adminId === ME_ID).slice(0, 4);
  const trending     = [...filtered].sort((a, b) => (b.postsToday || 0) - (a.postsToday || 0)).slice(0, 4);
  const fastGrowing  = filtered.filter(c => c.growthRate).slice(0, 4);
  const newComms     = filtered.filter(c => c.isNew).slice(0, 4);
  const privateComms = filtered.filter(c => c.type === "private").slice(0, 4);

  const sharedProps = { onOpen: handleOpen, onJoin: handleJoin, onRequest: handleRequest };

  return (
    <>
      <div style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "var(--t-bg)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--t-border)", padding: "20px 24px 0",
        }}>
          {/* Title + create button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h1 style={{ color: "var(--t-text-1)", fontWeight: 800, fontSize: 22 }}>Communities</h1>
            <button
              onClick={() => setCreateOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 20, cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none", color: "#fff", fontWeight: 700, fontSize: 14,
                fontFamily: "'Outfit', sans-serif",
                boxShadow: "0 0 18px rgba(124,58,237,0.35)",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(124,58,237,0.55)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(124,58,237,0.35)")}
            >
              <Plus size={16} /> Create Community
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--t-text-4)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search communities..."
              style={{
                width: "100%", padding: "11px 14px 11px 38px", borderRadius: 16, outline: "none",
                background: "var(--t-surface)", border: "1px solid var(--t-border)",
                color: "var(--t-text-1)", fontFamily: "'Outfit', sans-serif", fontSize: 14,
                transition: "border-color 0.2s",
              }}
              onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.45)")}
              onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--t-border)")}
            />
          </div>

          {/* Category chips */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 16px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0,
                  background: activeCategory === cat ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "var(--t-surface)",
                  border: activeCategory === cat ? "none" : "1px solid var(--t-border)",
                  color: activeCategory === cat ? "#fff" : "var(--t-text-3)",
                  fontWeight: activeCategory === cat ? 700 : 400, fontSize: 13,
                  fontFamily: "'Outfit', sans-serif", cursor: "pointer",
                  boxShadow: activeCategory === cat ? "0 0 12px rgba(124,58,237,0.3)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 24px" }}>
          {(search || activeCategory !== "All") ? (
            // Search results
            <div>
              <h2 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 18, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
                Results ({filtered.length})
              </h2>
              <div className="uherd-community-grid">
                {filtered.map(c => (
                  <CommunityCard key={c.id} community={c} {...sharedProps} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <p style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 18 }}>No communities found</p>
                  <p style={{ color: "var(--t-text-4)", fontSize: 14, marginTop: 6 }}>Try a different search or create your own!</p>
                </div>
              )}
            </div>
          ) : (
            // Default sections
            <>
              {/* Recommended */}
              {recommended.length > 0 && (
                <section style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Star size={18} style={{ color: "#fbbf24" }} />
                    <h2 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 18, fontFamily: "'Outfit', sans-serif" }}>Recommended For You</h2>
                    <div style={{
                      padding: "2px 10px", borderRadius: 20,
                      background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)",
                      color: "#fbbf24", fontSize: 11, fontWeight: 700,
                    }}>
                      AI-Picked
                    </div>
                  </div>
                  <div className="uherd-community-grid">
                    {recommended.map(c => <CommunityCard key={c.id} community={c} {...sharedProps} />)}
                  </div>
                </section>
              )}

              {/* Your communities */}
              {yourComms.length > 0 && (
                <Section title="Your Communities" icon={<Check size={18} style={{ color: "#10b981" }} />} communities={yourComms} {...sharedProps} />
              )}

              {/* Trending */}
              <Section title="Trending Now" icon={<Flame size={18} style={{ color: "#f97316" }} />} communities={trending} {...sharedProps} />

              {/* Private communities */}
              {privateComms.length > 0 && (
                <section style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Lock size={18} style={{ color: "#fbbf24" }} />
                    <h2 style={{ color: "var(--t-text-1)", fontWeight: 700, fontSize: 18, fontFamily: "'Outfit', sans-serif" }}>Private Communities</h2>
                  </div>
                  <div style={{
                    padding: "12px 16px", borderRadius: 14, marginBottom: 16,
                    background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <Lock size={16} style={{ color: "#fbbf24", flexShrink: 0 }} />
                    <p style={{ color: "var(--t-text-2)", fontSize: 13, lineHeight: 1.5 }}>
                      Private communities require admin approval. Send a join request and wait for the admin to accept.
                    </p>
                  </div>
                  <div className="uherd-community-grid">
                    {privateComms.map(c => <CommunityCard key={c.id} community={c} {...sharedProps} />)}
                  </div>
                </section>
              )}

              {/* Fast Growing */}
              {fastGrowing.length > 0 && (
                <Section title="Fast Growing" icon={<TrendingUp size={18} style={{ color: "#34d399" }} />} communities={fastGrowing} {...sharedProps} />
              )}

              {/* New */}
              {newComms.length > 0 && (
                <Section title="New Communities" icon={<Clock size={18} style={{ color: "#fbbf24" }} />} communities={newComms} {...sharedProps} />
              )}
            </>
          )}
        </div>
      </div>

      <CreateCommunityModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
