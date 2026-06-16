import { useState } from "react";
import { X, Image, BarChart2, Video, Globe, Users, Lock, Smile } from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

const ME = {
  name: "Alex Rivera",
  handle: "@codewitch_dev",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
};

const COMMUNITIES = [
  { id: "1", name: "WebDevHub", icon: "💻" },
  { id: "2", name: "AI & Machine Learning", icon: "🤖" },
  { id: "3", name: "GamersUnite", icon: "🎮" },
  { id: "4", name: "FitnessFam", icon: "💪" },
];

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<"everyone" | "community" | "followers">("everyone");
  const [selectedCommunity, setSelectedCommunity] = useState(COMMUNITIES[0]);
  const [postType, setPostType] = useState<"text" | "poll">("text");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  if (!open) return null;

  const charLimit = 500;
  const remaining = charLimit - content.length;
  const pct = Math.min((content.length / charLimit) * 100, 100);

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };

  const handlePost = () => {
    if (content.trim()) {
      onClose();
      setContent("");
      setPollOptions(["", ""]);
      setPostType("text");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: "#0d0d1a",
          border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h2 className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* User info + community selector */}
          <div className="flex items-start gap-3 mb-5">
            <img
              src={ME.avatar}
              alt={ME.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              style={{ border: "2px solid rgba(124,58,237,0.5)" }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white" style={{ fontWeight: 600, fontSize: 14 }}>{ME.name}</span>
                <span style={{ color: "#64748b", fontSize: 13 }}>{ME.handle}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Audience selector */}
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value as typeof audience)}
                  className="px-3 py-1.5 rounded-full text-xs outline-none cursor-pointer appearance-none"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.4)",
                    color: "#a78bfa",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  <option value="everyone">🌐 Everyone</option>
                  <option value="followers">👥 Followers</option>
                  <option value="community">🏘️ Community</option>
                </select>

                {/* Community selector */}
                <select
                  value={selectedCommunity.id}
                  onChange={e => setSelectedCommunity(COMMUNITIES.find(c => c.id === e.target.value) || COMMUNITIES[0])}
                  className="px-3 py-1.5 rounded-full text-xs outline-none cursor-pointer appearance-none"
                  style={{
                    background: "rgba(6,182,212,0.12)",
                    border: "1px solid rgba(6,182,212,0.35)",
                    color: "#22d3ee",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {COMMUNITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Text area */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, charLimit))}
            placeholder="What's on your mind? Share your thoughts with the herd..."
            rows={5}
            className="w-full resize-none outline-none bg-transparent"
            style={{
              color: "#f1f5f9",
              fontSize: 16,
              fontFamily: "'Outfit', sans-serif",
              lineHeight: 1.6,
              caretColor: "#7c3aed",
            }}
          />

          {/* Poll options */}
          {postType === "poll" && (
            <div className="mt-4 space-y-2">
              <p style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>Poll Options</p>
              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={e => {
                    const updated = [...pollOptions];
                    updated[i] = e.target.value;
                    setPollOptions(updated);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="w-full px-4 py-2.5 rounded-xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f1f5f9",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 14,
                  }}
                />
              ))}
              {pollOptions.length < 4 && (
                <button
                  onClick={addPollOption}
                  style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}
                  className="transition-colors hover:text-purple-300"
                >
                  + Add option
                </button>
              )}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1">
            {[
              { icon: Image, label: "Image", type: "text" },
              { icon: Video, label: "Video", type: "text" },
              { icon: BarChart2, label: "Poll", type: "poll" },
              { icon: Smile, label: "Emoji", type: "text" },
            ].map(({ icon: Icon, label, type }) => (
              <button
                key={label}
                title={label}
                onClick={() => type === "poll" && setPostType(postType === "poll" ? "text" : "poll")}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  color: (label === "Poll" && postType === "poll") ? "#7c3aed" : "#64748b",
                  background: (label === "Poll" && postType === "poll") ? "rgba(124,58,237,0.15)" : "transparent",
                }}
                onMouseEnter={e => {
                  if (!(label === "Poll" && postType === "poll")) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  }
                }}
                onMouseLeave={e => {
                  if (!(label === "Poll" && postType === "poll")) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#64748b";
                  }
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Char counter */}
            <div className="relative w-8 h-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                <circle
                  cx="16" cy="16" r="12"
                  fill="none"
                  stroke={remaining < 50 ? "#ef4444" : remaining < 100 ? "#f59e0b" : "#7c3aed"}
                  strokeWidth="2.5"
                  strokeDasharray={`${75.4 * pct / 100} 75.4`}
                />
              </svg>
              {remaining < 50 && (
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ fontSize: 8, color: remaining < 20 ? "#ef4444" : "#f59e0b", fontWeight: 700 }}
                >
                  {remaining}
                </span>
              )}
            </div>

            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className="px-6 py-2.5 rounded-full transition-all duration-200"
              style={{
                background: content.trim()
                  ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                  : "rgba(255,255,255,0.07)",
                color: content.trim() ? "#fff" : "#475569",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Outfit', sans-serif",
                cursor: content.trim() ? "pointer" : "not-allowed",
                boxShadow: content.trim() ? "0 0 20px rgba(124,58,237,0.35)" : "none",
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
