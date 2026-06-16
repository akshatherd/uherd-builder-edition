import { useState } from "react";
import { Check, ChevronRight, Sparkles, Zap } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const INTERESTS = [
  { id: "ai", label: "AI & ML", emoji: "🤖" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "movies", label: "Movies & TV", emoji: "🎬" },
  { id: "startups", label: "Startups", emoji: "🚀" },
  { id: "coding", label: "Coding", emoji: "💻" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "anime", label: "Anime", emoji: "🌸" },
  { id: "art", label: "Art & Design", emoji: "🎨" },
  { id: "food", label: "Food", emoji: "🍕" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "self", label: "Self-Improvement", emoji: "🎯" },
];

const USER_TYPES = [
  { id: "student", label: "Student", emoji: "🎓", desc: "Learning and exploring" },
  { id: "creator", label: "Creator", emoji: "🎨", desc: "Making content I love" },
  { id: "founder", label: "Founder", emoji: "🚀", desc: "Building something great" },
  { id: "gamer", label: "Gamer", emoji: "🎮", desc: "Living for the game" },
  { id: "professional", label: "Professional", emoji: "💼", desc: "Growing my career" },
  { id: "explorer", label: "Explorer", emoji: "🌍", desc: "Just here to discover" },
];

const GOALS = [
  { id: "friends", label: "Make Friends", emoji: "👥" },
  { id: "communities", label: "Join Communities", emoji: "🏘️" },
  { id: "networking", label: "Networking", emoji: "🤝" },
  { id: "entertainment", label: "Entertainment", emoji: "😂" },
  { id: "learning", label: "Learning", emoji: "📖" },
  { id: "opportunities", label: "Opportunities", emoji: "💡" },
  { id: "news", label: "Stay Updated", emoji: "📰" },
  { id: "inspiration", label: "Get Inspired", emoji: "✨" },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);


  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedInterests.length >= 3;
    if (step === 2) return selectedType !== "";
    if (step === 3) return selectedGoals.length >= 1;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#07070e", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background glows */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          transform: "translate(30%, 30%)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl text-white" style={{ fontWeight: 700 }}>
            U<span style={{ color: "#a78bfa" }}>Herd</span>
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 justify-center mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 32 : 28,
                  height: i === step ? 32 : 28,
                  background: i < step
                    ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                    : i === step
                      ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                      : "rgba(255,255,255,0.08)",
                  border: i === step ? "2px solid rgba(167,139,250,0.5)" : "2px solid transparent",
                }}
              >
                {i < step
                  ? <Check size={14} className="text-white" />
                  : <span style={{ color: i === step ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600 }}>{i}</span>
                }
              </div>
              {i < 3 && (
                <div
                  className="w-12 h-0.5 rounded-full transition-all duration-500"
                  style={{ background: i < step ? "linear-gradient(90deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.08)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "rgba(13,13,26,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Step 1 — Interests */}
          {step === 1 && (
            <div>
              <div className="mb-8 text-center">
                <div className="text-4xl mb-3">✨</div>
                <h1 className="text-white mb-2" style={{ fontSize: 28, fontWeight: 700 }}>
                  What sparks your curiosity?
                </h1>
                <p style={{ color: "#64748b", fontSize: 15 }}>
                  Pick at least 3 interests to personalize your feed
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {INTERESTS.map(interest => {
                  const selected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className="relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: selected
                          ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))"
                          : "rgba(255,255,255,0.04)",
                        border: selected
                          ? "1px solid rgba(167,139,250,0.5)"
                          : "1px solid rgba(255,255,255,0.07)",
                        transform: selected ? "scale(1.03)" : "scale(1)",
                      }}
                    >
                      {selected && (
                        <div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "#7c3aed" }}
                        >
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                      <span style={{ fontSize: 28 }}>{interest.emoji}</span>
                      <span style={{ color: selected ? "#f1f5f9" : "#94a3b8", fontSize: 13, fontWeight: 500 }}>
                        {interest.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p style={{ color: "#64748b", fontSize: 13, textAlign: "center" }}>
                {selectedInterests.length} selected
                {selectedInterests.length < 3 && ` — pick ${3 - selectedInterests.length} more`}
              </p>
            </div>
          )}

          {/* Step 2 — User type */}
          {step === 2 && (
            <div>
              <div className="mb-8 text-center">
                <div className="text-4xl mb-3">🌟</div>
                <h1 className="text-white mb-2" style={{ fontSize: 28, fontWeight: 700 }}>
                  How do you describe yourself?
                </h1>
                <p style={{ color: "#64748b", fontSize: 15 }}>
                  This helps us find your kind of people
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {USER_TYPES.map(type => {
                  const selected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className="flex items-center gap-4 p-5 rounded-xl text-left transition-all duration-200 cursor-pointer"
                      style={{
                        background: selected
                          ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.15))"
                          : "rgba(255,255,255,0.04)",
                        border: selected
                          ? "1px solid rgba(167,139,250,0.5)"
                          : "1px solid rgba(255,255,255,0.07)",
                        transform: selected ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{type.emoji}</span>
                      <div>
                        <div className="text-white" style={{ fontWeight: 600, fontSize: 15 }}>{type.label}</div>
                        <div style={{ color: "#64748b", fontSize: 13 }}>{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Goals */}
          {step === 3 && (
            <div>
              <div className="mb-8 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h1 className="text-white mb-2" style={{ fontSize: 28, fontWeight: 700 }}>
                  What brings you to UHerd?
                </h1>
                <p style={{ color: "#64748b", fontSize: 15 }}>
                  Pick everything that resonates
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {GOALS.map(goal => {
                  const selected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200 cursor-pointer"
                      style={{
                        background: selected
                          ? "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))"
                          : "rgba(255,255,255,0.05)",
                        border: selected
                          ? "1px solid rgba(167,139,250,0.6)"
                          : "1px solid rgba(255,255,255,0.08)",
                        transform: selected ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <span>{goal.emoji}</span>
                      <span style={{ color: selected ? "#f1f5f9" : "#94a3b8", fontWeight: 500, fontSize: 14 }}>
                        {goal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full mt-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: canProceed()
                ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                : "rgba(255,255,255,0.06)",
              color: canProceed() ? "#fff" : "#64748b",
              fontWeight: 600,
              fontSize: 16,
              cursor: canProceed() ? "pointer" : "not-allowed",
              boxShadow: canProceed() ? "0 0 30px rgba(124,58,237,0.4)" : "none",
            }}
          >
            {step === 3 ? (
              <>
                <Sparkles size={18} />
                Create My Experience
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
