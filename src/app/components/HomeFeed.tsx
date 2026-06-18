import { useState, useEffect } from "react";
import { Flame, Zap, Users, Loader2, Check, Globe, Lock, CreditCard } from "lucide-react";
import { PostCard } from "./PostCard";
import { CreatePostModal } from "./CreatePostModal";
import { CommunityPage } from "./CommunityPage";
import { supabase } from "../../supabase";

const ME = {
  name: "Builder",
  handle: "@user_dev",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
};

const TABS = [
  { id: "for-you", label: "For You", icon: Zap },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "communities", label: "Communities", icon: Users },
] as const;

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState<string>("for-you");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedPaidComm, setSelectedPaidComm] = useState<any>(null);

  const [posts, setPosts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null); // NEW: To strictly track the logged-in user

  useEffect(() => {
    if (selectedCommunityId) return;

    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setMyId(user.id);

        if (activeTab === "communities") {
          const { data: comms, error: commsError } = await supabase.from('communities').select('*');
          if (commsError) throw commsError;

          const { data: memberships } = await supabase.from('community_members').select('community_id').eq('user_id', user.id);
          const joinedIds = new Set((memberships || []).map(m => m.community_id));

          const { data: myRequests } = await supabase.from('community_requests').select('community_id').eq('user_id', user.id);
          const requestedIds = new Set((myRequests || []).map(r => r.community_id));

          const formattedComms = (comms || []).map(c => ({
            ...c,
            isJoined: joinedIds.has(c.id),
            isRequested: requestedIds.has(c.id)
          }));

          setCommunities(formattedComms);
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase.from('profiles').select('interests, persona').eq('id', user.id).single();
        let query = supabase.from('posts').select('*');

        if (activeTab === "for-you") {
          const userInterests = profile?.interests || [];
          if (userInterests.length > 0) {
            const formattedInterests = `{${userInterests.join(',')}}`;
            query = query.or(`tags.ov.${formattedInterests},user_id.eq.${user.id}`);
          } else {
            query = query.eq('user_id', user.id);
          }
          query = query.order('created_at', { ascending: false });
        } else if (activeTab === "trending") {
          query = query.order('likes_count', { ascending: false });
        }

        const { data: fetchedPosts, error } = await query;
        if (error) throw error;

        const formattedPosts = (fetchedPosts || []).map(post => ({
          id: post.id,
          user: {
            id: post.user_id,
            name: profile?.persona || "Builder",
            handle: (profile?.persona?.toLowerCase().replace(/\s+/g, '_') || "user"),
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
            verified: true,
            badge: "Creator"
          },
          content: post.content,
          timestamp: "Just now",
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          reposts: 0,
          shares: 0,
          isLiked: false,
          isSaved: false,
          type: post.type || "text",
          images: post.image_url ? [post.image_url] : undefined,
          videoThumb: post.video_url || undefined,
          poll: post.poll_data,
        }));

        setPosts(formattedPosts);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [activeTab, selectedCommunityId]);

  const handleCommunityAction = async (comm: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (comm.isJoined) {
        await supabase.from('community_members').delete().match({ community_id: comm.id, user_id: user.id });
        setCommunities(p => p.map(c => c.id === comm.id ? { ...c, isJoined: false } : c));
      } else if (comm.isRequested) {
        await supabase.from('community_requests').delete().match({ community_id: comm.id, user_id: user.id });
        setCommunities(p => p.map(c => c.id === comm.id ? { ...c, isRequested: false } : c));
      } else if (comm.privacy_type === 'private') {
        await supabase.from('community_requests').insert({ community_id: comm.id, user_id: user.id });
        setCommunities(p => p.map(c => c.id === comm.id ? { ...c, isRequested: true } : c));
      } else if (comm.privacy_type === 'paid') {
        setSelectedPaidComm(comm);
        setQrModalOpen(true);
      } else {
        await supabase.from('community_members').insert({ community_id: comm.id, user_id: user.id });
        setCommunities(p => p.map(c => c.id === comm.id ? { ...c, isJoined: true } : c));
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleSimulatePayment = async () => {
    if (!selectedPaidComm) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('community_members').insert({ community_id: selectedPaidComm.id, user_id: user.id });
      setCommunities(p => p.map(c => c.id === selectedPaidComm.id ? { ...c, isJoined: true } : c));
    }
    setQrModalOpen(false);
    setSelectedPaidComm(null);
  };

  if (selectedCommunityId) {
    return <CommunityPage communityId={selectedCommunityId} onBack={() => setSelectedCommunityId(null)} />;
  }

  return (
    <>
      <div className="min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="sticky top-0 z-20" style={{ background: "rgba(7,7,14,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
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

        {activeTab !== "communities" && (
          <div className="px-6 py-4 flex items-start gap-3 cursor-pointer" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} onClick={() => setCreateOpen(true)}>
            <img src={ME.avatar} alt="User" className="w-11 h-11 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid rgba(124,58,237,0.4)" }} />
            <div className="flex-1">
              <div className="px-5 py-3.5 rounded-2xl w-full text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569", fontSize: 15 }}>
                What's buzzing with the herd today?
              </div>
            </div>
          </div>
        )}

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
               <span className="text-gray-500 text-sm">Curating your feed...</span>
            </div>
          ) : activeTab === "communities" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 py-6">
                {communities.map(comm => (
                  <div 
                    key={comm.id} 
                    onClick={() => {
                      // STRICT ACCESS CHECK
                      if (comm.isJoined || comm.owner_id === myId) {
                        setSelectedCommunityId(comm.id);
                      } else {
                        if (comm.privacy_type === 'private') alert("🔒 This is a Private community. You must request access and be approved by the admin.");
                        else if (comm.privacy_type === 'paid') alert("💳 This is a Paid community. Click 'Pay' to get access.");
                        else alert("👋 Please click 'Join' to enter this community!");
                      }
                    }}
                    className="bg-[#0d0d1a] border border-white/10 rounded-2xl cursor-pointer overflow-hidden hover:border-purple-500/50 transition-all group" 
                  >
                     <div className="h-24 w-full relative bg-gray-800">
                        {comm.banner_url ? (
                          <img src={comm.banner_url} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-900 to-cyan-900 opacity-60" />
                        )}
                        
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-white font-bold tracking-wider uppercase">
                          {comm.privacy_type === 'public' ? <Globe size={10} /> : comm.privacy_type === 'paid' ? <CreditCard size={10} /> : <Lock size={10} />}
                          {comm.privacy_type === 'public' ? 'Public' : comm.privacy_type === 'paid' ? 'Paid' : 'Private'}
                        </div>

                        <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-[#0d0d1a] border-2 border-[#0d0d1a] flex items-center justify-center text-2xl overflow-hidden shadow-lg z-10" style={{ backgroundColor: comm.color + '20' }}>
                          {comm.avatar_url ? <img src={comm.avatar_url} className="w-full h-full object-cover" /> : comm.icon}
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCommunityAction(comm); }}
                          className="absolute -bottom-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold transition-all z-10 shadow-lg"
                          style={{
                            background: comm.isJoined ? "rgba(255,255,255,0.1)" : comm.isRequested ? "rgba(245, 158, 11, 0.2)" : "rgba(255,255,255,0.9)",
                            color: comm.isJoined ? "white" : comm.isRequested ? "#f59e0b" : "black",
                            border: comm.isJoined ? "1px solid rgba(255,255,255,0.2)" : comm.isRequested ? "1px solid rgba(245, 158, 11, 0.4)" : "none"
                          }}
                        >
                          {comm.isJoined ? <><Check size={12} className="inline mr-1"/> Joined</> 
                           : comm.isRequested ? 'Requested' 
                           : comm.privacy_type === 'private' ? 'Request Access'
                           : comm.privacy_type === 'paid' ? `Pay $${comm.price}`
                           : 'Join'}
                        </button>
                     </div>
                     
                     <div className="pt-8 px-5 pb-5">
                       <h3 className="text-white font-bold text-lg mb-1">{comm.name}</h3>
                       <p className="text-gray-400 text-xs mb-3 font-medium">👥 {comm.totalMembers || 1} members</p>
                       <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{comm.description}</p>
                     </div>
                  </div>
                ))}
             </div>
          ) : posts.length > 0 ? (
            posts.map((post: any) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
               <span className="text-4xl mb-3">👀</span>
               <p>No posts to show here.</p>
            </div>
          )}
        </div>
      </div>

      {qrModalOpen && selectedPaidComm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
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

      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}