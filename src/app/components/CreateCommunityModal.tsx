import { useState, useRef } from "react";
import { X, Lock, Globe, ChevronRight, Check, CreditCard, Loader2, UploadCloud } from "lucide-react";
import { supabase } from "../../supabase";

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Technology", "Gaming", "Finance", "Music", "Sports", "Art", "Fashion", "Fitness", "Travel", "Entertainment", "Education", "Other"];

const PRESET_COLORS = [
  "#7c3aed", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#8b5cf6", "#3b82f6",
  "#f97316", "#14b8a6", "#d946ef", "#84cc16",
];

const PRESET_ICONS = ["💻", "🎮", "🚀", "🎵", "📸", "💰", "💪", "✈️", "🌸", "🎨", "📚", "🔬", "🏀", "🎬", "🍕", "🌍", "🎯", "⚡"];

const PRESET_BANNERS = [
  "https://images.unsplash.com/photo-1461749280687-aa659517da5b?w=800&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=220&fit=crop&auto=format",
];

export function CreateCommunityModal({ open, onClose }: CreateCommunityModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"public" | "private" | "paid">("public");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Technology");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);
  
  // Banner States
  const [selectedBanner, setSelectedBanner] = useState(PRESET_BANNERS[0]);
  const [customBannerFile, setCustomBannerFile] = useState<File | null>(null);
  const [customBannerPreview, setCustomBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>(["Be respectful to all members", "Keep content relevant to the topic"]);
  const [newRule, setNewRule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const canProceed = step === 1 
    ? name.trim().length > 0 && description.trim().length > 0 && (type !== "paid" || price !== "") 
    : true;

  const addTag = () => {
    const t = tagsInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags((p: string[]) => [...p, t]);
      setTagsInput("");
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      setRules((p: string[]) => [...p, newRule.trim()]);
      setNewRule("");
    }
  };

  const handleCustomBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomBannerFile(file);
      setCustomBannerPreview(URL.createObjectURL(file));
      setSelectedBanner(""); // Clear preset selection
    }
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      let finalBannerUrl = selectedBanner;

      // 1. Upload Custom Banner if provided
      if (customBannerFile) {
        const fileExt = customBannerFile.name.split('.').pop();
        const filePath = `community_banners/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community_media')
          .upload(filePath, customBannerFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('community_media').getPublicUrl(filePath);
        finalBannerUrl = data.publicUrl;
      }

      // 2. Create Community Row
      const { data: community, error: commError } = await supabase
        .from('communities')
        .insert({
          name: name.trim(),
          description: description.trim(),
          privacy_type: type,
          price: type === "paid" ? Number(price) : 0,
          banner_url: finalBannerUrl,
          icon: selectedIcon,
          color: selectedColor,
          category: category,
          tags: tags,
          rules: rules,
          owner_id: user.id
        })
        .select()
        .single();

      if (commError) throw commError;

      // 3. Add Admin as Member
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      onClose();
      resetForm();
      setTimeout(() => window.location.reload(), 500);

    } catch (error: any) {
      console.error("Creation Error:", error);
      alert(error.message || "Failed to create community. Make sure your database schema is updated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1); setName(""); setDescription(""); setType("public"); setPrice("");
    setCategory("Technology"); setSelectedColor(PRESET_COLORS[0]);
    setSelectedIcon(PRESET_ICONS[0]); setSelectedBanner(PRESET_BANNERS[0]);
    setCustomBannerFile(null); setCustomBannerPreview(null);
    setTags([]); setTagsInput(""); setRules(["Be respectful to all members", "Keep content relevant to the topic"]);
    setNewRule("");
  };

  const bg      = "var(--t-bg-card, #0d0d1a)";
  const border  = "var(--t-border, rgba(255,255,255,0.08))";
  const text1   = "var(--t-text-1, #f1f5f9)";
  const text3   = "var(--t-text-3, #94a3b8)";
  const text4   = "var(--t-text-4, #64748b)";
  const surf    = "var(--t-surface, rgba(255,255,255,0.03))";
  const inputBg = "var(--t-input-bg, rgba(255,255,255,0.05))";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
        padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      }}
      onClick={e => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div style={{
        width: "100%", maxWidth: 580, maxHeight: "90vh",
        borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column",
        background: bg, border: `1px solid ${border}`,
        fontFamily: "'Outfit', sans-serif",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <div>
            <h2 style={{ color: text1, fontWeight: 800, fontSize: 20 }}>Create Community</h2>
            <p style={{ color: text4, fontSize: 13, marginTop: 2 }}>Step {step} of 2 — {step === 1 ? "Basic Info" : "Customize & Rules"}</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} style={{
            width: 32, height: 32, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: surf, color: text3, cursor: isSubmitting ? "not-allowed" : "pointer", border: "none",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ height: 3, background: border, flexShrink: 0 }}>
          <div style={{
            height: "100%", width: `${(step / 2) * 100}%`,
            background: "linear-gradient(90deg, #7c3aed, #06b6d4)", transition: "width 0.4s ease",
          }} />
        </div>

        {/* Scrollable content */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>ICON</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {PRESET_ICONS.map(icon => (
                    <button key={icon} onClick={() => setSelectedIcon(icon)}
                      style={{
                        width: 42, height: 42, borderRadius: 12, fontSize: 22, cursor: "pointer",
                        background: selectedIcon === icon ? selectedColor + "25" : surf,
                        border: selectedIcon === icon ? `2px solid ${selectedColor}` : `1px solid ${border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: selectedIcon === icon ? "scale(1.1)" : "scale(1)", transition: "all 0.15s",
                      }}>
                      {icon}
                    </button>
                  ))}
                </div>

                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>COLOR</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PRESET_COLORS.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
                        background: color, border: selectedColor === color ? `3px solid ${text1}` : "2px solid transparent",
                        transform: selectedColor === color ? "scale(1.2)" : "scale(1)", transition: "all 0.15s",
                      }}>
                      {selectedColor === color && <Check size={12} color="#fff" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>COMMUNITY NAME *</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. React Developers..." maxLength={50}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 14, outline: "none",
                    background: inputBg, border: `1px solid ${border}`,
                    color: text1, fontFamily: "'Outfit', sans-serif", fontSize: 15,
                    transition: "border-color 0.2s", caretColor: "#7c3aed",
                  }}
                  onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.5)")}
                  onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = border)}
                />
              </div>

              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>DESCRIPTION *</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="What is this community about?" rows={4} maxLength={500}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 14, outline: "none",
                    background: inputBg, border: `1px solid ${border}`,
                    color: text1, fontFamily: "'Outfit', sans-serif", fontSize: 14,
                    resize: "none", lineHeight: 1.6, caretColor: "#7c3aed",
                  }}
                  onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.5)")}
                  onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = border)}
                />
              </div>

              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>COMMUNITY TYPE</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { id: "public" as const, icon: <Globe size={20} />, label: "Public", desc: "Anyone can find and join instantly.", color: "#10b981" },
                    { id: "private" as const, icon: <Lock size={20} />, label: "Private", desc: "Members must request to join.", color: "#f59e0b" },
                    { id: "paid" as const, icon: <CreditCard size={20} />, label: "Paid", desc: "Users pay a one-time fee.", color: "#06b6d4" },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setType(opt.id)}
                      style={{
                        padding: "16px", borderRadius: 16, textAlign: "left", cursor: "pointer",
                        background: type === opt.id ? opt.color + "12" : surf,
                        border: type === opt.id ? `2px solid ${opt.color}55` : `1px solid ${border}`,
                        transition: "all 0.15s",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: type === opt.id ? opt.color : text4 }}>{opt.icon}</span>
                        <span style={{ color: type === opt.id ? text1 : text3, fontWeight: 700, fontSize: 15 }}>{opt.label}</span>
                        {type === opt.id && <Check size={14} color={opt.color} style={{ marginLeft: "auto" }} />}
                      </div>
                      <p style={{ color: text4, fontSize: 12, lineHeight: 1.4 }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {type === "paid" && (
                  <div className="mt-4 p-4 rounded-xl animate-in slide-in-from-top-2" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)" }}>
                    <label className="block text-xs font-semibold text-cyan-500 mb-1.5 uppercase tracking-wider">Entry Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number" value={price} onChange={e => setPrice(e.target.value)}
                        placeholder="29.99"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl outline-none"
                        style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(6,182,212,0.4)", color: "#22d3ee", fontSize: 16, fontWeight: 600 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>CATEGORY</label>
                <select
                  value={category} onChange={e => setCategory(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 14, outline: "none",
                    background: inputBg, border: `1px solid ${border}`,
                    color: text1, fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: "pointer",
                  }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>BANNER IMAGE</label>
                
                {/* Custom File Upload Button */}
                <div style={{ marginBottom: 16 }}>
                  <input type="file" ref={bannerInputRef} accept="image/*" style={{ display: "none" }} onChange={handleCustomBannerSelect} />
                  <button 
                    onClick={() => bannerInputRef.current?.click()} 
                    style={{ 
                      width: "100%", padding: "14px", borderRadius: 14, 
                      background: "rgba(124,58,237,0.1)", border: "1px dashed rgba(124,58,237,0.4)", 
                      color: "#a78bfa", fontWeight: 600, fontSize: 14, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" 
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.2)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.1)")}
                  >
                    <UploadCloud size={18} /> 
                    {customBannerPreview ? "Choose a different file" : "Upload Custom Banner"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {PRESET_BANNERS.map(banner => (
                    <button key={banner} onClick={() => { setSelectedBanner(banner); setCustomBannerFile(null); setCustomBannerPreview(null); }}
                      style={{
                        height: 64, borderRadius: 12, overflow: "hidden", cursor: "pointer",
                        border: selectedBanner === banner ? `3px solid ${selectedColor}` : "2px solid transparent",
                        padding: 0, position: "relative",
                      }}>
                      <img src={banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {selectedBanner === banner && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.4)" }}>
                          <Check size={20} color="#fff" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 12, borderRadius: 16, overflow: "hidden", height: 80, position: "relative" }}>
                  <img src={customBannerPreview || selectedBanner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)", display: "flex", alignItems: "flex-end", padding: "12px 14px", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: selectedColor + "40", border: `2px solid ${selectedColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {selectedIcon}
                    </div>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{name || "Community Name"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>
                  TAGS <span style={{ color: text4, fontSize: 11, fontWeight: 400 }}>(up to 8)</span>
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  {tags.map(tag => (
                    <span key={tag} style={{
                      display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20,
                      background: selectedColor + "20", border: `1px solid ${selectedColor}40`,
                      color: selectedColor, fontSize: 13, fontWeight: 600,
                    }}>
                      #{tag}
                      <button onClick={() => setTags((p: string[]) => p.filter(t => t !== tag))} style={{ background: "none", border: "none", cursor: "pointer", color: selectedColor, display: "flex", alignItems: "center", padding: 0 }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    placeholder="Add a tag and press Enter..."
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 12, outline: "none",
                      background: inputBg, border: `1px solid ${border}`,
                      color: text1, fontFamily: "'Outfit', sans-serif", fontSize: 14,
                    }}
                  />
                  <button onClick={addTag} style={{ padding: "10px 16px", borderRadius: 12, cursor: "pointer", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa", fontWeight: 700, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label style={{ color: text3, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>
                  COMMUNITY RULES <span style={{ color: text4, fontSize: 11, fontWeight: 400 }}>(optional but recommended)</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                  {rules.map((rule, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: surf, border: `1px solid ${border}` }}>
                      <span style={{ color: selectedColor, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ flex: 1, color: "var(--t-text-2, #cbd5e1)", fontSize: 13 }}>{rule}</span>
                      <button onClick={() => setRules((p: string[]) => p.filter((_, ri) => ri !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: text4 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={newRule} onChange={e => setNewRule(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRule(); } }}
                    placeholder="Add a community rule..."
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 12, outline: "none", background: inputBg, border: `1px solid ${border}`, color: text1, fontFamily: "'Outfit', sans-serif", fontSize: 14 }}
                  />
                  <button onClick={addRule} style={{ padding: "10px 16px", borderRadius: 12, cursor: "pointer", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa", fontWeight: 700, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", gap: 10, flexShrink: 0 }}>
          {step > 1 && (
            <button
              onClick={() => setStep(1)} disabled={isSubmitting}
              style={{ padding: "11px 20px", borderRadius: 14, cursor: isSubmitting ? "not-allowed" : "pointer", background: surf, border: `1px solid ${border}`, color: text3, fontWeight: 600, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={step === 1 ? () => setStep(2) : handleCreate}
            disabled={(step === 1 && !canProceed) || isSubmitting}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 14, cursor: (canProceed || step === 2) && !isSubmitting ? "pointer" : "not-allowed",
              background: (canProceed || step === 2) && !isSubmitting ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : surf,
              border: "none", color: (canProceed || step === 2) && !isSubmitting ? "#fff" : text4,
              fontWeight: 700, fontSize: 15, fontFamily: "'Outfit', sans-serif",
              boxShadow: (canProceed || step === 2) && !isSubmitting ? "0 0 24px rgba(124,58,237,0.35)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
            }}
          >
            {isSubmitting ? (
               <><Loader2 size={18} className="animate-spin" /> <span>Creating...</span></>
            ) : step === 1 ? (
              <><span>Continue</span> <ChevronRight size={18} /></>
            ) : (
              <><Check size={18} /> <span>Create {type === "private" ? "Private" : type === "paid" ? "Paid" : "Public"} Community</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}