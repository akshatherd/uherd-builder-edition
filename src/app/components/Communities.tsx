import { useState, useEffect } from "react";
import { Search, TrendingUp, Zap, Plus, Clock, Users, Lock, Globe, Check, Flame, Star, CreditCard, Loader2 } from "lucide-react";
import { CommunityPage } from "./CommunityPage";
import { CreateCommunityModal } from "./CreateCommunityModal";
import { supabase } from "../../supabase";

export const formatMemberCount = (n: number): string => {
  if (!n) return "1";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

function CommunityCard({ community, myId, onOpen, onAction }: any) {
  const isAdmin = community.owner_id === myId;
  const isPending = community.isRequested;
  const isJoined = community.isJoined;

  const joinLabel = () => {
    if (isJoined) return isAdmin ? "👑 Admin" : "✓ Joined";
    if (isPending) return "⏳ Requested";
    if (community.privacy_type === "private") return "Request Access";
    if (community.privacy_type === "paid") return `Pay $${community.price}`;
    return "Join";
  };

  const joinBg = () => {
    if (isJoined) return isAdmin ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.07)";
    if (isPending) return "rgba(245, 158, 11, 0.2)";
    return `${community.color || '#7c3aed'}22`;
  };

  const joinBorder = () => {
    if (isJoined) return isAdmin ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.12)";
    if (isPending) return "1px solid rgba(245, 158, 11, 0.4)";
    return `1px solid ${community.color || '#7c3aed'}55`;
  };

  const joinColor = () => {
    if (isJoined) return isAdmin ? "#a78bfa" : "var(--t-text-3, #94a3b8)";
    if (isPending) return "#f59e0b";
    return community.color || '#7c3aed';
  };

  const isNew = new Date(community.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // WIDE HORIZONTAL LAYOUT
  return (
    <div
      onClick={() => onOpen(community)}
      style={{
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        background: "var(--t-bg-card, #0d0d1a)", border: "1px solid var(--t-border, rgba(255,255,255,0.08))",
        transition: "all 0.2s ease", fontFamily: "'Outfit', sans-serif",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = `1px solid ${community.color || '#7c3aed'}50`;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 10px 30px ${community.color || '#7c3aed'}18`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid var(--t-border, rgba(255,255,255,0.08))";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Banner */}
      <div style={{ height: 100, position: "relative", overflow: "hidden", backgroundColor: "#1e293b" }}>
        {community.banner_url ? (
          <img src={community.banner_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(to right, ${community.color || '#4c1d95'}, #0f172a)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Type badge */}
        <div style={{
          position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 4,
          padding: "4px 12px", borderRadius: 20, backdropFilter: "blur(8px)",
          background: community.privacy_type === "private" ? "rgba(245,158,11,0.25)" : community.privacy_type === "paid" ? "rgba(6,182,212,0.25)" : "rgba(255,255,255,0.15)",
          border: community.privacy_type === "private" ? "1px solid rgba(245,158,11,0.5)" : community.privacy_type === "paid" ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.25)",
          color: community.privacy_type === "private" ? "#fbbf24" : community.privacy_type === "paid" ? "#22d3ee" : "#fff",
          fontSize: 11, fontWeight: 700, textTransform: "capitalize"
        }}>
          {community.privacy_type === "private" ? <Lock size={10} /> : community.privacy_type === "paid" ? <CreditCard size={10} /> : <Globe size={10} />}
          {community.privacy_type}
        </div>

        {isNew && (
          <div style={{ position: "absolute", bottom: 12, left: 14, padding: "2px 8px", borderRadius: 20, background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 800 }}>
            NEW
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, overflow: "hidden",
              background: (community.color || '#7c3aed') + "1a", border: `1.5px solid ${community.color || '#7c3aed'}40`,
            }}>
              {community.avatar_url ? <img src={community.avatar_url} className="w-full h-full object-cover" /> : community.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "var(--t-text-1, #fff)", fontWeight: 700, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {community.name}
              </div>
              <div style={{ color: "var(--t-text-4, #64748b)", fontSize: 12, marginTop: 2 }}>
                <Users size={10} style={{ display: "inline", marginRight: 4 }} />
                {formatMemberCount(community.totalMembers)} members
              </div>
            </div>
          </div>
          <button
            onClick={(e) => onAction(community, e)}
            style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: 20,
              background: joinBg(), border: joinBorder(), color: joinColor(),
              fontWeight: 700, fontSize: 13, fontFamily: "'Outfit', sans-serif",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {joinLabel()}
          </button>
        </div>

        <p style={{ color: "var(--t-text-3, #94a3b8)", fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {community.description}
        </p>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ title, icon, communities, myId, onOpen, onAction }: any) {
  if (communities.length === 0) return null;
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {icon}
        <h2 style={{ color: "var(--t-text-1, #fff)", fontWeight: 700, fontSize: 18, fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
      </div>
      {/* RESTORED: Horizontal Rows Layout instead of Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {communities.map((c: any) => (
          <CommunityCard key={c.id} community={c} myId={myId} onOpen={onOpen} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}

// ── Main Communities Component ────────────────────────────────────────────────

export function Communities() {
  const [allCommunities, setAllCommunities] = useState<any[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedPaidComm, setSelectedPaidComm] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);

  const categories = ["All", "Technology", "Gaming", "Finance", "Fitness", "Music", "Entertainment", "Fashion", "Art", "Education", "Other"];

  useEffect(() => {
    if (selectedCommunityId) return;

    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setMyId(user.id);

        const { data: comms, error: commsError } = await supabase.from('communities').select('*').order('created_at', { ascending: false });
        if (commsError) throw commsError;

        const { data: memberships } = await supabase.from('community_members').select('community_id').eq('user_id', user.id);
        const joinedIds = new Set((memberships || []).map(m => m.community_id));

        const { data: myRequests } = await supabase.from('community_requests').select('community_id').eq('user_id', user.id);
        const requestedIds = new Set((myRequests || []).map(r => r.community_id));

        const formattedComms = (comms || []).map(c => ({
          ...c,
          isJoined: joinedIds.has(c.id),
          isRequested: requestedIds.has(c.id),
          totalMembers: 1 
        }));

        setAllCommunities(formattedComms);
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [selectedCommunityId]);

  const handleCommunityAction = async (comm: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (comm.isJoined) {
        await supabase.from('community_members').delete().match({ community_id: comm.id, user_id: user.id });
        setAllCommunities(p => p.map(c => c.id === comm.id ? { ...c, isJoined: false } : c));
      
      } else if (comm.isRequested) {
        await supabase.from('community_requests').delete().match({ community_id: comm.id, user_id: user.id });
        setAllCommunities(p => p.map(c => c.id === comm.id ? { ...c, isRequested: false } : c));
      
      } else if (comm.privacy_type === 'private') {
        await supabase.from('community_requests').insert({ community_id: comm.id, user_id: user.id });
        setAllCommunities(p => p.map(c => c.id === comm.id ? { ...c, isRequested: true } : c));
      
      } else if (comm.privacy_type === 'paid') {
        setSelectedPaidComm(comm);
        setQrModalOpen(true);
      
      } else {
        await supabase.from('community_members').insert({ community_id: comm.id, user_id: user.id });
        setAllCommunities(p => p.map(c => c.id === comm.id ? { ...c, isJoined: true } : c));
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleSimulatePayment = async () => {
    if (!selectedPaidComm || !myId) return;
    await supabase.from('community_members').insert({ community_id: selectedPaidComm.id, user_id: myId });
    setAllCommunities(p => p.map(c => c.id === selectedPaidComm.id ? { ...c, isJoined: true } : c));
    setQrModalOpen(false);
    setSelectedPaidComm(null);
  };

  const handleOpen = (community: any) => {
    if (community.isJoined || community.owner_id === myId) {
      setSelectedCommunityId(community.id);
    } else {
      if (community.privacy_type === 'private') alert("🔒 This is a Private community. You must request access and be approved by the admin.");
      else if (community.privacy_type === 'paid') alert("💳 This is a Paid community. Click 'Pay' to get access.");
      else alert("👋 Please click 'Join' to enter this community!");
    }
  };

  if (selectedCommunityId) {
    return <CommunityPage communityId={selectedCommunityId} onBack={() => setSelectedCommunityId(null)} />;
  }

  const filtered = allCommunities.filter(c =>
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase())) &&
    (activeCategory === "All" || c.category === activeCategory)
  );

  const yourComms    = filtered.filter(c => c.isJoined || c.owner_id === myId).slice(0, 4);
  const newComms     = filtered.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).slice(0, 4);
  const privateComms = filtered.filter(c => c.privacy_type === "private").slice(0, 4);
  const publicComms  = filtered.filter(c => c.privacy_type === "public" && !c.isJoined && c.owner_id !== myId).slice(0, 8);

  const sharedProps = { myId, onOpen: handleOpen, onAction: handleCommunityAction };

  return (
    <>
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh" }}>
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "var(--t-bg, #07070E)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--t-border, rgba(255,255,255,0.06))", padding: "20px 24px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h1 style={{ color: "var(--t-text-1, #fff)", fontWeight: 800, fontSize: 22 }}>Communities</h1>
            <button
              onClick={() => setCreateOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 20, cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none", color: "#fff", fontWeight: 700, fontSize: 14,
                fontFamily: "'Outfit', sans-serif", boxShadow: "0 0 18px rgba(124,58,237,0.35)",
              }}
            >
              <Plus size={16} /> Create Community
            </button>
          </div>

          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--t-text-4, #64748b)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search communities..."
              style={{
                width: "100%", padding: "11px 14px 11px 38px", borderRadius: 16, outline: "none",
                background: "var(--t-surface, #13131a)", border: "1px solid var(--t-border, rgba(255,255,255,0.08))",
                color: "var(--t-text-1, #fff)", fontFamily: "'Outfit', sans-serif", fontSize: 14,
              }}
            />
          </div>

          <div className="custom-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
            {categories.map(cat => (
              <button
                key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 16px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0,
                  background: activeCategory === cat ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "var(--t-surface, #13131a)",
                  border: activeCategory === cat ? "none" : "1px solid var(--t-border, rgba(255,255,255,0.08))",
                  color: activeCategory === cat ? "#fff" : "var(--t-text-3, #94a3b8)",
                  fontWeight: activeCategory === cat ? 700 : 400, fontSize: 13,
                  fontFamily: "'Outfit', sans-serif", cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 24px" }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
               <span className="text-gray-500 text-sm">Loading communities...</span>
            </div>
          ) : (search || activeCategory !== "All") ? (
            <div>
              <h2 style={{ color: "var(--t-text-1, #fff)", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Results ({filtered.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filtered.map(c => <CommunityCard key={c.id} community={c} {...sharedProps} />)}
              </div>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <p style={{ color: "var(--t-text-1, #fff)", fontWeight: 700, fontSize: 18 }}>No communities found</p>
                  <p style={{ color: "var(--t-text-4, #64748b)", fontSize: 14, marginTop: 6 }}>Try a different search or create your own!</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {yourComms.length > 0 && <Section title="Your Communities" icon={<Check size={18} style={{ color: "#10b981" }} />} communities={yourComms} {...sharedProps} />}
              {newComms.length > 0 && <Section title="New Communities" icon={<Clock size={18} style={{ color: "#fbbf24" }} />} communities={newComms} {...sharedProps} />}
              {privateComms.length > 0 && <Section title="Private Groups" icon={<Lock size={18} style={{ color: "#f59e0b" }} />} communities={privateComms} {...sharedProps} />}
              {publicComms.length > 0 && <Section title="Discover Public" icon={<Globe size={18} style={{ color: "#06b6d4" }} />} communities={publicComms} {...sharedProps} />}
            </>
          )}
        </div>
      </div>

      {qrModalOpen && selectedPaidComm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
           <div className="bg-[#0d0d1a] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold text-white mb-2">Join {selectedPaidComm.name}</h3>
              <p className="text-cyan-400 mb-6 font-bold text-lg">Entry Fee: ${selectedPaidComm.price}</p>
              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-lg">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pay_${selectedPaidComm.id}`} alt="QR Code" />
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Scan this code with your mobile payment app to unlock permanent access to the community.</p>
              <div className="flex gap-3">
                <button onClick={() => { setQrModalOpen(false); setSelectedPaidComm(null); }} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={handleSimulatePayment} className="flex-1 py-3 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">Simulate Paid</button>
              </div>
           </div>
        </div>
      )}

      <CreateCommunityModal open={createOpen} onClose={() => { setCreateOpen(false); }} />
    </>
  );
}