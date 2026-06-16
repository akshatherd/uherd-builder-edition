import { useState } from "react";
import { Radio, Mic, MicOff, Users, Calendar, ChevronRight, Volume2 } from "lucide-react";
import { ROOMS, Room, USERS, formatNumber } from "./mockData";

function RoomCard({ room, onJoin }: { room: Room; onJoin: (id: string) => void }) {
  const [listening, setListening] = useState(false);

  const handleJoin = () => {
    setListening(p => !p);
    onJoin(room.id);
  };

  return (
    <div
      className="relative p-5 rounded-2xl cursor-pointer transition-all duration-200 group"
      style={{
        background: listening
          ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))"
          : "rgba(13,13,26,0.8)",
        border: listening
          ? "1px solid rgba(124,58,237,0.4)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: listening ? "0 0 20px rgba(124,58,237,0.15)" : "none",
      }}
      onMouseEnter={e => {
        if (!listening) {
          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)";
          (e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.95)";
        }
      }}
      onMouseLeave={e => {
        if (!listening) {
          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.8)";
        }
      }}
    >
      {/* Live / Scheduled badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: room.isLive ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.15)",
            border: room.isLive ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(6,182,212,0.4)",
            color: room.isLive ? "#f87171" : "#22d3ee",
          }}
        >
          {room.isLive ? (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" style={{ animation: "pulse 1.5s infinite" }} />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1"><Calendar size={10} /> {room.scheduledFor}</span>
          )}
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#64748b",
          }}
        >
          {room.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>
        {room.name}
      </h3>
      <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
        {room.description}
      </p>

      {/* Speakers */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {room.speakers.map((s, i) => (
            <div key={i} className="relative">
              <img
                src={s.avatar}
                alt={s.name}
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: "2px solid #0d0d1a" }}
              />
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                style={{ background: "#0d0d1a" }}
              >
                <Mic size={8} style={{ color: room.isLive ? "#10b981" : "#64748b" }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-white" style={{ fontWeight: 600, fontSize: 13 }}>
            {room.speakers.map(s => s.name).join(", ")}
          </div>
          <div style={{ color: "#475569", fontSize: 11 }}>
            {room.speakers.length > 1 ? `${room.speakers.length} speakers` : "Host & Speaker"}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Volume2 size={13} style={{ color: "#64748b" }} />
          <span style={{ color: "#64748b", fontSize: 12 }}>
            {formatNumber(room.listeners)} listening
          </span>
        </div>
        {room.friendsIn && (
          <div className="flex items-center gap-1.5">
            <Users size={13} style={{ color: "#a78bfa" }} />
            <span style={{ color: "#a78bfa", fontSize: 12 }}>
              {room.friendsIn} friends in here
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {room.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b",
              fontSize: 11,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Join button */}
      <button
        onClick={handleJoin}
        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: listening
            ? "rgba(255,255,255,0.06)"
            : room.isLive
              ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
              : "rgba(6,182,212,0.15)",
          border: !room.isLive && !listening
            ? "1px solid rgba(6,182,212,0.4)"
            : "none",
          color: listening ? "#94a3b8" : "#fff",
          fontWeight: 700,
          fontSize: 14,
          fontFamily: "'Outfit', sans-serif",
          boxShadow: room.isLive && !listening ? "0 0 15px rgba(124,58,237,0.3)" : "none",
        }}
      >
        {listening ? (
          <>
            <MicOff size={16} />
            Leave Room
          </>
        ) : room.isLive ? (
          <>
            <Volume2 size={16} />
            Join Room
          </>
        ) : (
          <>
            <Calendar size={16} />
            Set Reminder
          </>
        )}
      </button>
    </div>
  );
}

export function LiveHerds() {
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "live" | "scheduled">("all");

  const toggleRoom = (id: string) => {
    setActiveRooms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const displayRooms = ROOMS.filter(r =>
    filter === "all" ? true : filter === "live" ? r.isLive : !r.isLive
  );

  const liveCount = ROOMS.filter(r => r.isLive).length;
  const totalListeners = ROOMS.filter(r => r.isLive).reduce((a, b) => a + b.listeners, 0);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-6 pt-6 pb-4"
        style={{
          background: "rgba(7,7,14,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-white" style={{ fontWeight: 700, fontSize: 22 }}>Live Herds</h1>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ animation: "pulse 1.5s infinite" }} />
            <span style={{ color: "#f87171", fontSize: 12, fontWeight: 700 }}>
              {liveCount} live · {formatNumber(totalListeners)} listening
            </span>
          </div>
        </div>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
          Voice rooms and discussions — join the conversation live
        </p>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { id: "all", label: "All Rooms" },
            { id: "live", label: "🔴 Live Now" },
            { id: "scheduled", label: "📅 Scheduled" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className="px-4 py-1.5 rounded-full transition-all duration-200"
              style={{
                background: filter === f.id ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.05)",
                border: filter === f.id ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: filter === f.id ? "#fff" : "#64748b",
                fontWeight: filter === f.id ? 700 : 400,
                fontSize: 13,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Listening now banner */}
        {activeRooms.length > 0 && (
          <div
            className="mb-6 p-4 rounded-2xl flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))",
              border: "1px solid rgba(124,58,237,0.4)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#7c3aed" }}>
                <Volume2 size={16} className="text-white" />
              </div>
              <div>
                <div className="text-white" style={{ fontWeight: 700, fontSize: 14 }}>Currently listening</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{activeRooms.length} room{activeRooms.length > 1 ? "s" : ""} active</div>
              </div>
            </div>
            <div className="flex gap-1 ml-auto">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    background: "#a78bfa",
                    height: 8 + Math.random() * 16,
                    animation: `soundwave 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {displayRooms.map(room => (
            <RoomCard key={room.id} room={room} onJoin={toggleRoom} />
          ))}
        </div>

        {displayRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Radio size={48} style={{ color: "#1e1e30" }} className="mb-4" />
            <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: 18 }}>No rooms here</h3>
            <p style={{ color: "#475569", fontSize: 15 }}>Check back soon or start your own Live Herd!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes soundwave { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}
