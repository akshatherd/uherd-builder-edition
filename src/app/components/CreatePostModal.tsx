import { useState, useEffect } from "react";
import { X, Image as ImageIcon, BarChart2, Video, Smile, Loader2 } from "lucide-react";
import { supabase } from "../../supabase";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

const AVAILABLE_TAGS = [
  { id: 'ai', label: 'AI & ML' },
  { id: 'startups', label: 'Startups' },
  { id: 'coding', label: 'Coding' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'finance', label: 'Finance' },
];

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<"everyone" | "community" | "followers">("everyone");
  const [postType, setPostType] = useState<"text" | "poll" | "image" | "video">("text");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myCommunities, setMyCommunities] = useState<any[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");
  const [me, setMe] = useState<any>({
    name: "Loading...",
    handle: "@user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
  });

  useEffect(() => {
    if (!open) return;
    
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setMe({
          name: profile.persona || "Builder",
          handle: "@" + (profile.persona?.toLowerCase().replace(/\s+/g, '_') || "user"),
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
        });
      }

      const { data: memberships } = await supabase.from('community_members').select('community_id').eq('user_id', user.id);
      
      if (memberships && memberships.length > 0) {
        const commIds = memberships.map(m => m.community_id);
        const { data: comms } = await supabase.from('communities').select('*').in('id', commIds);
        if (comms) {
          setMyCommunities(comms);
          if (comms.length > 0) setSelectedCommunityId(comms[0].id);
        }
      } else {
        setMyCommunities([]);
      }
    };

    fetchUserData();
  }, [open]);

  if (!open) return null;

  const charLimit = 500;
  const remaining = charLimit - content.length;
  const pct = Math.min((content.length / charLimit) * 100, 100);

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const pollData = postType === "poll" 
        ? { question: content, options: pollOptions.filter(o => o.trim() !== ""), totalVotes: 0 }
        : null;

      const finalCommunityId = (audience === "community" && selectedCommunityId) ? selectedCommunityId : null;

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        community_id: finalCommunityId, 
        content: content,
        type: postType,
        image_url: postType === "image" ? mediaUrl : null,
        video_url: postType === "video" ? mediaUrl : null,
        poll_data: pollData,
        tags: selectedTags,
        likes_count: 0,
        comments_count: 0
      });

      if (error) throw error;

      setContent("");
      setPollOptions(["", ""]);
      setMediaUrl("");
      setPostType("text");
      setSelectedTags([]);
      onClose();
      
      setTimeout(() => window.location.reload(), 500);

    } catch (error: any) {
      console.error("Error posting:", error);
      alert("Failed to post. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Outfit', sans-serif" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>Create Post</h2>
          <button onClick={onClose} disabled={isSubmitting} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start gap-3 mb-5">
            <img src={me.avatar} alt={me.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid rgba(124,58,237,0.5)" }} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white" style={{ fontWeight: 600, fontSize: 14 }}>{me.name}</span>
                <span style={{ color: "#64748b", fontSize: 13 }}>{me.handle}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={audience} onChange={e => setAudience(e.target.value as typeof audience)} className="px-3 py-1.5 rounded-full text-xs outline-none cursor-pointer appearance-none" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa", fontWeight: 600 }}>
                  <option value="everyone">🌐 Everyone</option>
                  <option value="followers">👥 Followers</option>
                  <option value="community" disabled={myCommunities.length === 0}>{myCommunities.length === 0 ? '🏘️ Join a community first' : '🏘️ Community'}</option>
                </select>

                {audience === "community" && myCommunities.length > 0 && (
                  <select value={selectedCommunityId} onChange={e => setSelectedCommunityId(e.target.value)} className="px-3 py-1.5 rounded-full text-xs outline-none cursor-pointer appearance-none" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "#22d3ee", fontWeight: 600 }}>
                    {myCommunities.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>

          <textarea value={content} onChange={e => setContent(e.target.value.slice(0, charLimit))} disabled={isSubmitting} placeholder={postType === "poll" ? "Ask a question..." : "What's on your mind? Share your thoughts with the herd..."} rows={4} className="w-full resize-none outline-none bg-transparent disabled:opacity-50" style={{ color: "#f1f5f9", fontSize: 16, lineHeight: 1.6, caretColor: "#7c3aed" }} />

          <div className="mb-4">
             <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(tag => (
                <button key={tag.id} onClick={() => toggleTag(tag.id)} disabled={isSubmitting} className="px-3 py-1 rounded-full text-xs font-medium transition-colors" style={{ backgroundColor: selectedTags.includes(tag.id) ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", color: selectedTags.includes(tag.id) ? "#a78bfa" : "#64748b", border: `1px solid ${selectedTags.includes(tag.id) ? "rgba(124,58,237,0.5)" : "transparent"}` }}>
                  #{tag.label}
                </button>
              ))}
            </div>
          </div>

          {(postType === "image" || postType === "video") && (
            <div className="mt-2 mb-4">
              <input type="url" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder={`Paste ${postType} URL here (e.g., https://...)`} className="w-full px-4 py-2.5 rounded-xl outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", fontSize: 14 }} />
            </div>
          )}

          {postType === "poll" && (
            <div className="mt-2 space-y-2">
              <p style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>Poll Options</p>
              {pollOptions.map((opt, i) => (
                <input key={i} value={opt} onChange={e => { const updated = [...pollOptions]; updated[i] = e.target.value; setPollOptions(updated); }} disabled={isSubmitting} placeholder={`Option ${i + 1}`} className="w-full px-4 py-2.5 rounded-xl outline-none disabled:opacity-50" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", fontSize: 14 }} />
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} disabled={isSubmitting} style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>+ Add option</button>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-1">
            {[ { icon: ImageIcon, label: "Image", type: "image" }, { icon: Video, label: "Video", type: "video" }, { icon: BarChart2, label: "Poll", type: "poll" }, { icon: Smile, label: "Emoji", type: "text" }, ].map(({ icon: Icon, label, type }) => (
              <button key={label} title={label} disabled={isSubmitting} onClick={() => setPostType(postType === type ? "text" : type as any)} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200" style={{ color: postType === type ? "#7c3aed" : "#64748b", background: postType === type ? "rgba(124,58,237,0.15)" : "transparent", }}>
                <Icon size={18} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-8 h-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                <circle cx="16" cy="16" r="12" fill="none" stroke={remaining < 50 ? "#ef4444" : remaining < 100 ? "#f59e0b" : "#7c3aed"} strokeWidth="2.5" strokeDasharray={`${75.4 * pct / 100} 75.4`} />
              </svg>
            </div>

            <button onClick={handlePost} disabled={!content.trim() || isSubmitting} className="px-6 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2" style={{ background: content.trim() && !isSubmitting ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.07)", color: content.trim() && !isSubmitting ? "#fff" : "#475569", fontWeight: 700, fontSize: 14, cursor: content.trim() && !isSubmitting ? "pointer" : "not-allowed", boxShadow: content.trim() && !isSubmitting ? "0 0 20px rgba(124,58,237,0.35)" : "none", }}>
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}