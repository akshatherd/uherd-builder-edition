import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Send, Paperclip, Smile, Image as ImageIcon,
  Users, Info, Shield, Trash2, Download, Loader2,
  Lock, Globe, Hash, Crown, Search, AlertTriangle, Volume2
} from "lucide-react";
import { supabase } from "../../supabase";

const FILE_ICONS: Record<string, string> = { pdf: "📄", excel: "📊", zip: "🗜️", default: "📎" };
function getFileIcon(fileType?: string) { return FILE_ICONS[fileType || "default"] || FILE_ICONS.default; }
export const formatMemberCount = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

function MessageBubble({ msg, isAdmin, isMe, onDelete }: any) {
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      className="animate-in slide-in-from-bottom-2 fade-in duration-200" 
      style={{ 
        display: "flex", 
        flexDirection: isMe ? "row-reverse" : "row", // Left/Right Alignment
        gap: 10, marginBottom: 16, opacity: msg.is_deleted ? 0.4 : 1 
      }} 
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <div style={{ flexShrink: 0, position: "relative" }}>
        <img src={msg.profiles?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt="Avatar" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--t-border, rgba(255,255,255,0.1))" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
        <div style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{msg.profiles?.persona || "User"}</span>
          <span style={{ color: "#64748b", fontSize: 11 }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {hover && !msg.is_deleted && (isAdmin || isMe) && (
            <button onClick={() => onDelete(msg.id)} style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}>
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {msg.is_deleted ? (
          <p style={{ color: "#64748b", fontSize: 13, fontStyle: "italic" }}>Message deleted by Admin</p>
        ) : (
          <div style={{
            background: isMe ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "#13131a",
            border: isMe ? "none" : "1px solid rgba(255,255,255,0.05)",
            padding: "10px 14px",
            borderRadius: 16,
            borderBottomRightRadius: isMe ? 4 : 16,
            borderBottomLeftRadius: !isMe ? 4 : 16,
            color: "#fff",
            maxWidth: "85%",
            boxShadow: isMe ? "0 4px 15px rgba(124,58,237,0.2)" : "none"
          }}>
            {msg.content && <p style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap", marginBottom: msg.type !== 'text' ? 8 : 0 }}>{msg.content}</p>}
            
            {msg.type === "image" && msg.file_url && (
              <div style={{ borderRadius: 10, overflow: "hidden", marginTop: msg.content ? 8 : 0 }}>
                <img src={msg.file_url} alt="Attachment" style={{ width: "100%", maxHeight: 250, objectFit: "cover" }} />
              </div>
            )}
            
            {msg.type === "file" && msg.file_url && (
              <a href={msg.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 10, background: isMe ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.05)", marginTop: msg.content ? 8 : 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: isMe ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)" }}>{getFileIcon(msg.file_type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{msg.file_name}</div>
                    <div style={{ color: isMe ? "rgba(255,255,255,0.7)" : "#94a3b8", fontSize: 11 }}>{msg.file_size}</div>
                  </div>
                  <Download size={16} style={{ color: isMe ? "#fff" : "#94a3b8" }} />
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommunityPageProps { 
  communityId: string; 
  onBack: () => void; 
}

export function CommunityPage({ communityId, onBack }: CommunityPageProps) {
  const [community, setCommunity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"chat"|"members"|"about"|"admin">("chat");
  const [adminSubTab, setAdminSubTab] = useState<"requests"|"banned"|"settings">("requests");
  
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<any>(null);
  const [attachedImage, setAttachedImage] = useState<any>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setMe(user);

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setMyProfile(profile);

    const { data: comm } = await supabase.from('communities').select('*').eq('id', communityId).single();
    setCommunity(comm);

    const { data: msgs } = await supabase.from('community_messages').select(`*, profiles:user_id (persona, avatar_url)`).eq('community_id', communityId).order('created_at', { ascending: true });
    setMessages(msgs || []);

    const { data: mems } = await supabase.from('community_members').select(`*, profiles:user_id (id, persona, avatar_url)`).eq('community_id', communityId);
    setMembers(mems || []);

    const { data: reqs } = await supabase.from('community_requests').select(`*, profiles:user_id (id, persona, avatar_url)`).eq('community_id', communityId).eq('status', 'pending');
    setRequests(reqs || []);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel(`room_${communityId}`, {
        config: { broadcast: { self: false }, presence: { key: user.id } }
      });
      channelRef.current = channel;

      channel
        .on('broadcast', { event: 'typing' }, ({ payload }) => {
          if (payload.isTyping) {
            setTypingUsers(prev => prev.includes(payload.user) ? prev : [...prev, payload.user]);
          } else {
            setTypingUsers(prev => prev.filter(u => u !== payload.user));
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const onlineIds = new Set(Object.keys(state));
          setOnlineUsers(onlineIds);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'community_messages', filter: `community_id=eq.${communityId}` }, () => {
          fetchData(); // Because Realtime is now ON, this fires instantly for other users!
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString(), user_id: user.id });
          }
        });
    };

    setupRealtime();

    return () => { 
      if (channelRef.current) supabase.removeChannel(channelRef.current); 
    };
  }, [communityId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (channelRef.current && myProfile) {
      channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { isTyping: true, user: myProfile.persona || 'User' } });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { isTyping: false, user: myProfile.persona || 'User' } });
      }, 2000);
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !attachedFile && !attachedImage) || !me) return;
    setIsSending(true);

    const messageToSave = newMessage;
    const currentImage = attachedImage;
    const currentFile = attachedFile;

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id: tempId, community_id: communityId, user_id: me.id, content: messageToSave,
      type: currentImage ? 'image' : currentFile ? 'file' : 'text',
      file_url: currentImage ? currentImage.preview : null,
      file_name: currentFile ? currentFile.name : null, file_size: currentFile ? currentFile.size : null, file_type: currentFile ? currentFile.type : null,
      created_at: new Date().toISOString(), is_deleted: false,
      profiles: { persona: myProfile?.persona || 'User', avatar_url: myProfile?.avatar_url }
    };

    setMessages(prev => [...prev, tempMsg]); 
    setNewMessage(""); setAttachedFile(null); setAttachedImage(null); setShowEmojiPicker(false);

    if (channelRef.current && myProfile) {
      channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { isTyping: false, user: myProfile.persona || 'User' } });
    }

    try {
      let finalFileUrl = null, fileType = "text", fileName = null, fileSize = null, finalExt = null;
      if (currentImage) {
        const filePath = `chat_images/${Math.random()}.${currentImage.file.name.split('.').pop()}`;
        await supabase.storage.from('chat_media').upload(filePath, currentImage.file);
        finalFileUrl = supabase.storage.from('chat_media').getPublicUrl(filePath).data.publicUrl;
        fileType = "image";
      } else if (currentFile) {
        const filePath = `chat_files/${Math.random()}.${currentFile.file.name.split('.').pop()}`;
        await supabase.storage.from('chat_media').upload(filePath, currentFile.file);
        finalFileUrl = supabase.storage.from('chat_media').getPublicUrl(filePath).data.publicUrl;
        fileType = "file"; fileName = currentFile.name; fileSize = currentFile.size; finalExt = currentFile.type;
      }
      await supabase.from('community_messages').insert({ 
        community_id: communityId, user_id: me.id, content: messageToSave, 
        type: fileType, file_url: finalFileUrl, file_name: fileName, file_size: fileSize, file_type: finalExt 
      });
    } catch (e) { console.error(e); } finally { setIsSending(false); }
  };

  const handleDelete = async (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_deleted: true } : m));
    await supabase.from('community_messages').update({ is_deleted: true }).eq('id', msgId);
  };

  const togglePrivacy = async (type: 'public' | 'private') => {
    await supabase.from('communities').update({ privacy_type: type }).eq('id', communityId);
    setCommunity({ ...community, privacy_type: type });
  };

  const handleAcceptRequest = async (reqId: string, requestUserId: string) => {
    try {
      await supabase.from('community_members').insert({ community_id: communityId, user_id: requestUserId });
      await supabase.from('community_requests').delete().eq('id', reqId);
      setRequests(p => p.filter(r => r.id !== reqId));
      fetchData(); 
    } catch (err: any) { alert("Failed to accept request: " + err.message); }
  };

  const handleDenyRequest = async (reqId: string) => {
    try {
      await supabase.from('community_requests').delete().eq('id', reqId);
      setRequests(p => p.filter(r => r.id !== reqId));
    } catch (err: any) { alert("Failed to deny request: " + err.message); }
  };

  if (isLoading || !community) return <div className="min-h-screen flex items-center justify-center text-white bg-[#07070E]"><Loader2 className="animate-spin mr-2"/> Loading...</div>;

  const isAdmin = community.owner_id === me?.id;
  const accentColor = community.color || "#7c3aed";
  const filteredMembers = members.filter(m => memberSearch === "" || (m.profiles?.persona || "").toLowerCase().includes(memberSearch.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Outfit', sans-serif", background: "#07070E" }}>
      {/* Banner */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ height: 130, overflow: "hidden", position: "relative" }}>
          <img src={community.banner_url || "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800"} alt="Community Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%)" }} />
        </div>
        <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ display: "flex", gap: 6 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: community.privacy_type === "private" ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.2)", color: community.privacy_type === "private" ? "#fbbf24" : "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 700 }}>
                {community.privacy_type === "private" ? <Lock size={11} /> : <Globe size={11} />}
                {community.privacy_type === "private" ? "Private" : "Public"}
              </div>
            {isAdmin && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "rgba(124,58,237,0.6)", border: "1px solid rgba(167,139,250,0.5)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                <Crown size={11} /> Admin
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 16px", display: "flex", alignItems: "flex-end", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: accentColor + "30", border: `2px solid ${accentColor}`, overflow: "hidden" }}>
            {community.avatar_url ? <img src={community.avatar_url} alt="Logo" className="w-full h-full object-cover" /> : community.icon}
          </div>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>{community.name}</h1>
            <div style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              <span>👥 {formatMemberCount(members.length)} members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#0a0a14", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingLeft: 8, flexShrink: 0 }}>
        {[
          { id: "chat", label: "Chat", icon: <Volume2 size={15} /> },
          { id: "members", label: "Members", icon: <Users size={15} />, badge: members.length },
          { id: "about", label: "About", icon: <Info size={15} /> },
          ...(isAdmin ? [{ id: "admin", label: "Admin", icon: <Shield size={15} />, badge: requests.length }] : []),
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", cursor: "pointer", color: activeTab === tab.id ? "#fff" : "#64748b", fontWeight: activeTab === tab.id ? 700 : 400, fontSize: 14, background: "transparent", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${accentColor}` : "2px solid transparent", position: "relative" }}>
            {tab.icon} {tab.label}
            {(tab.badge !== undefined && tab.badge > 0) ? <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: tab.id === 'admin' ? '#ef4444' : "rgba(124,58,237,0.2)", color: tab.id === 'admin' ? '#fff' : "#a78bfa" }}>{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        
        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} isAdmin={isAdmin} isMe={msg.user_id === me?.id} onDelete={handleDelete} />)}
              <div ref={messagesEndRef} />
            </div>

            {/* Live Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="animate-in fade-in" style={{ padding: "4px 20px", color: accentColor, fontSize: 12, fontStyle: "italic", background: "#0a0a14" }}>
                {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
              </div>
            )}

            {/* Input Bar */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0a14", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 18, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if(f) setAttachedFile({file: f, name: f.name, size: (f.size/1024).toFixed(0)+"KB", type: f.type}); }} />
                <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if(f) setAttachedImage({file: f, preview: URL.createObjectURL(f)}); }} />
                <button onClick={() => fileInputRef.current?.click()} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}><Paperclip size={18} /></button>
                <button onClick={() => imageInputRef.current?.click()} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}><ImageIcon size={18} /></button>
                <input value={newMessage} onChange={handleInputChange} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }} placeholder={`Message...`} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14 }} />
                <button onClick={() => setShowEmojiPicker(p => !p)} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}><Smile size={18} /></button>
                <button onClick={handleSend} disabled={(!newMessage.trim() && !attachedFile && !attachedImage) || isSending} style={{ width: 34, height: 34, borderRadius: "50%", background: (newMessage.trim() || attachedFile || attachedImage) && !isSending ? `linear-gradient(135deg, ${accentColor}, #06b6d4)` : "#1f1f2e", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
              {showEmojiPicker && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 14px", background: "#13131a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", marginTop: 8 }}>
                  {["😂", "🔥", "❤️", "👍", "😮", "🎉", "💯", "🚀", "👏", "✨", "🤔", "😭"].map(e => (
                    <button key={e} onClick={() => { setNewMessage(p => p + e); setShowEmojiPicker(false); }} style={{ fontSize: 22, cursor: "pointer", background: "none", border: "none", padding: 2, color: "white" }}>{e}</button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* MEMBERS TAB */}
        {activeTab === "members" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { label: "Total", count: members.length, color: accentColor },
                { label: "Online", count: onlineUsers.size, color: "#10b981" },
                { label: "Admins", count: 1, color: "#7c3aed" }
              ].map(s => (
                <div key={s.label} style={{ padding: "8px 16px", borderRadius: 12, background: s.color + "15", border: `1px solid ${s.color}35`, textAlign: "center" }}>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: 20 }}>{s.count}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ position: "relative", marginBottom: 20 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 14, outline: "none", background: "#13131a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14 }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredMembers.map(member => (
                <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ position: "relative" }}>
                    <img src={member.profiles?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt="Avatar" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: community.owner_id === member.user_id ? "2px solid rgba(124,58,237,0.7)" : "2px solid rgba(255,255,255,0.1)" }} />
                    {onlineUsers.has(member.user_id) && <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: "#10b981", border: "2px solid #13131a" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{member.profiles?.persona || "User"}</span>
                      {community.owner_id === member.user_id && <span style={{ padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.35)" }}>👑 Admin</span>}
                      {me?.id === member.user_id && <span style={{ padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>You</span>}
                    </div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>Joined {new Date(member.joined_at).toLocaleDateString()} · {onlineUsers.has(member.user_id) ? "🟢 Online" : "⚫ Offline"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>About</h3>
              <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7 }}>{community.description}</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              <div style={{ padding: "12px 14px", borderRadius: 12, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Type</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{community.privacy_type === 'public' ? '🌐 Public' : '🔒 Private'}</div>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 12, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Category</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>📂 {community.category || 'General'}</div>
              </div>
            </div>

            {community.tags && community.tags.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 10, display: "flex", gap: 6 }}><Hash size={14} color={accentColor}/> Tags</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {community.tags.map((tag: string) => (
                    <span key={tag} style={{ padding: "5px 14px", borderRadius: 20, background: accentColor + "18", border: `1px solid ${accentColor}35`, color: accentColor, fontSize: 13, fontWeight: 600 }}>#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {community.rules && community.rules.length > 0 && (
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", gap: 6 }}><AlertTriangle size={14} color="#f59e0b" /> Community Rules</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {community.rules.map((rule: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: accentColor + "20", color: accentColor, fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                      <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.5, flex: 1 }}>{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === "admin" && isAdmin && (
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0a0a14" }}>
              {[
                { id: "requests", label: "Join Requests", badge: requests.length },
                { id: "banned", label: "Banned Users", badge: 0 },
                { id: "settings", label: "Settings" }
              ].map(sub => (
                <button key={sub.id} onClick={() => setAdminSubTab(sub.id as any)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", cursor: "pointer", color: adminSubTab === sub.id ? "#fff" : "#64748b", fontWeight: adminSubTab === sub.id ? 700 : 400, fontSize: 13, background: "transparent", border: "none", borderBottom: adminSubTab === sub.id ? "2px solid #ef4444" : "2px solid transparent" }}>
                  {sub.label} {(sub.badge || 0) > 0 && <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "#ef4444", color: "#fff" }}>{sub.badge}</span>}
                </button>
              ))}
            </div>

            <div style={{ padding: "20px" }}>
              {adminSubTab === "requests" && (
                <div>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Pending Join Requests</h3>
                  {requests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>All caught up!</p>
                      <p style={{ color: "#64748b", fontSize: 14 }}>No pending join requests.</p>
                    </div>
                  ) : (
                    requests.map(req => (
                      <div key={req.id} style={{ padding: 16, borderRadius: 16, background: "#13131a", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                          <img src={req.profiles?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt="Avatar" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{req.profiles?.persona || "User"}</div>
                            <div style={{ color: "#64748b", fontSize: 12 }}>Requested to join</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleAcceptRequest(req.id, req.user_id)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399", fontWeight: 700, cursor: "pointer" }}>Accept</button>
                          <button onClick={() => handleDenyRequest(req.id)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", fontWeight: 700, cursor: "pointer" }}>Deny</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {adminSubTab === "settings" && (
                <div>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Community Settings</h3>
                  <div style={{ padding: "16px", borderRadius: 14, marginBottom: 12, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Community Type</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["public", "private"].map(type => (
                        <button key={type} onClick={() => togglePrivacy(type as any)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", background: community.privacy_type === type ? (type === "public" ? "rgba(16,185,129,0.15)" : "rgba(251,191,36,0.15)") : "rgba(255,255,255,0.05)", border: community.privacy_type === type ? (type === "public" ? "1.5px solid rgba(16,185,129,0.5)" : "1.5px solid rgba(251,191,36,0.5)") : "1px solid rgba(255,255,255,0.1)", color: community.privacy_type === type ? (type === "public" ? "#34d399" : "#fbbf24") : "#94a3b8", fontWeight: community.privacy_type === type ? 700 : 400, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          {type === "public" ? <Globe size={14} /> : <Lock size={14} />} {type === "public" ? "Public" : "Private"}
                        </button>
                      ))}
                    </div>
                    <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>{community.privacy_type === "public" ? "Anyone can discover and join this community." : "New members must be approved by an admin."}</p>
                  </div>
                  
                  <div style={{ padding: "16px", borderRadius: 14, background: "#13131a", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Community Stats</div>
                    {[
                      { label: "Total Members", value: formatMemberCount(members.length) },
                      { label: "Pending Requests", value: requests.length },
                      { label: "Total Messages", value: messages.length }
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ color: "#94a3b8", fontSize: 13 }}>{s.label}</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}