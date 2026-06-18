import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Share2, Bookmark, MoreHorizontal, Play, BarChart2 } from "lucide-react";
import { supabase } from "../../supabase"; 

interface PostCardProps {
  post: any; 
}

export const formatNumber = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState<boolean>(post.isLiked || false);
  const [reposted, setReposted] = useState<boolean>(post.isReposted || false);
  const [saved, setSaved] = useState<boolean>(post.isSaved || false);
  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [reposts, setReposts] = useState<number>(post.reposts || 0);
  const [votedOption, setVotedOption] = useState<string | undefined>(post.poll?.voted);
  const [showFullContent, setShowFullContent] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const toggleLike = async () => {
    if (isLiking) return; 
    
    const newLikedState = !liked;
    const newLikesCount = newLikedState ? likes + 1 : Math.max(0, likes - 1);

    setLiked(newLikedState);
    setLikes(newLikesCount);
    setIsLiking(true);

    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: newLikesCount })
        .eq('id', post.id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to save like:", error);
      setLiked(!newLikedState);
      setLikes(likes);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleRepost = () => {
    setReposted((p: boolean) => !p);
    setReposts((p: number) => reposted ? Math.max(0, p - 1) : p + 1);
  };

  const handleVote = (optionId: string) => {
    if (!votedOption) setVotedOption(optionId);
  };

  const isLong = post.content && post.content.length > 280;
  const displayContent = isLong && !showFullContent
    ? post.content.slice(0, 280) + "..."
    : post.content;

  const totalVotes = post.poll?.totalVotes || 0;

  const safeAvatar = post.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format";
  const safeName = post.user?.name || "Anonymous";
  const safeHandle = post.user?.handle || "user";

  return (
    <article
      className="px-6 py-5 transition-all duration-150 cursor-pointer group"
      style={{
        borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--t-border, rgba(255,255,255,0.06))",
        fontFamily: "'Outfit', sans-serif",
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 relative">
          <img src={safeAvatar} alt={safeName} className="w-11 h-11 rounded-full object-cover" style={{ border: "2px solid rgba(124,58,237,0.3)" }} />
          {post.user?.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#7c3aed", fontSize: 8, color: "#fff" }}>
              ✓
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white" style={{ fontWeight: 700, fontSize: 14 }}>{safeName}</span>
              <span style={{ color: "#475569", fontSize: 13 }}>@{safeHandle}</span>
              {post.user?.badge && (
                <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", fontSize: 10, fontWeight: 700 }}>
                  {post.user.badge}
                </span>
              )}
              <span style={{ color: "#334155", fontSize: 13 }}>·</span>
              <span style={{ color: "#475569", fontSize: 13 }}>{post.timestamp || "Just now"}</span>
            </div>
            <button className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100" style={{ color: "#475569" }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
              <MoreHorizontal size={16} />
            </button>
          </div>

          {post.community && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: (post.community.color || "#7c3aed") + "20", border: `1px solid ${post.community.color || "#7c3aed"}40`, color: post.community.color || "#a78bfa", fontSize: 11, fontWeight: 600 }}>
                {post.community.icon} {post.community.name}
              </span>
            </div>
          )}

          {displayContent && (
            <div className="mb-3" style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {displayContent}
              {isLong && (
                <button onClick={e => { e.stopPropagation(); setShowFullContent((p: boolean) => !p); }} style={{ color: "#7c3aed", fontWeight: 600 }} className="ml-1">
                  {showFullContent ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className={`mb-3 rounded-xl overflow-hidden ${post.images.length > 1 ? "grid grid-cols-2 gap-0.5" : ""}`}>
              {post.images.map((img: string, i: number) => (
                <img key={i} src={img} alt="" className="w-full object-cover" style={{ maxHeight: post.images.length > 1 ? 240 : 400 }} />
              ))}
            </div>
          )}

          {post.type === "video" && post.videoThumb && (
            <div className="mb-3 rounded-xl overflow-hidden relative" style={{ maxHeight: 340 }}>
              <img src={post.videoThumb} alt="" className="w-full object-cover" style={{ maxHeight: 340 }} />
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.9)", backdropFilter: "blur(8px)" }}>
                  <Play size={22} className="text-white ml-1" />
                </div>
              </div>
              {post.videoDuration && (
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                  {post.videoDuration}
                </div>
              )}
            </div>
          )}

          {post.poll && (
            <div className="mb-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white mb-3" style={{ fontWeight: 600, fontSize: 14 }}>
                <BarChart2 size={14} className="inline mr-2" style={{ color: "#7c3aed" }} />
                {post.poll.question}
              </p>
              <div className="space-y-2">
                {post.poll.options.map((option: any) => {
                  const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                  const voted = votedOption === option.id;
                  const hasVoted = !!votedOption;
                  return (
                    <button key={option.id} onClick={e => { e.stopPropagation(); handleVote(option.id); }} disabled={hasVoted} className="relative w-full text-left px-4 py-2.5 rounded-lg overflow-hidden transition-all duration-200" style={{ background: "rgba(255,255,255,0.04)", border: voted ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.08)", cursor: hasVoted ? "default" : "pointer" }}>
                      {hasVoted && (
                        <div className="absolute inset-0 origin-left transition-all duration-700" style={{ width: `${pct}%`, background: voted ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)" }} />
                      )}
                      <div className="relative flex items-center justify-between">
                        <span style={{ color: voted ? "#a78bfa" : "#cbd5e1", fontWeight: voted ? 600 : 400, fontSize: 14 }}>{option.text}</span>
                        {hasVoted && <span style={{ color: "#64748b", fontSize: 13 }}>{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2" style={{ color: "#475569", fontSize: 12 }}>{formatNumber(totalVotes)} votes · {post.poll.endsIn || "24 hours"} remaining</p>
            </div>
          )}

          <div className="flex items-center gap-1">
            {[
              { id: "like", icon: Heart, count: likes, active: liked, toggle: toggleLike, activeColor: "#f43f5e", hoverBg: "rgba(244,63,94,0.1)" },
              { id: "comment", icon: MessageCircle, count: post.comments || 0, active: false, toggle: () => {}, activeColor: "#06b6d4", hoverBg: "rgba(6,182,212,0.1)" },
              { id: "repost", icon: Repeat2, count: reposts, active: reposted, toggle: toggleRepost, activeColor: "#10b981", hoverBg: "rgba(16,185,129,0.1)" },
              { id: "share", icon: Share2, count: post.shares || 0, active: false, toggle: () => {}, activeColor: "#7c3aed", hoverBg: "rgba(124,58,237,0.1)" },
            ].map(({ id, icon: Icon, count, active, toggle, activeColor, hoverBg }) => (
              <button key={id} onClick={e => { e.stopPropagation(); toggle(); }} disabled={id === 'like' && isLiking} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 group/btn disabled:opacity-50" onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                <Icon size={16} style={{ color: active ? activeColor : "#475569", fill: active ? activeColor : "none", transition: "all 0.15s" }} />
                <span style={{ color: active ? activeColor : "#475569", fontSize: 13 }}>{formatNumber(count)}</span>
              </button>
            ))}

            <button onClick={e => { e.stopPropagation(); setSaved((p: boolean) => !p); }} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150" onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.1)")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
              <Bookmark size={16} style={{ color: saved ? "#7c3aed" : "#475569", fill: saved ? "#7c3aed" : "none" }} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}