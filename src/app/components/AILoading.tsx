import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

interface AILoadingProps {
  onComplete: () => void;
}

const STEPS = [
  { label: "Analyzing your interests...", icon: "🔍", delay: 0 },
  { label: "Finding your communities...", icon: "🏘️", delay: 900 },
  { label: "Curating top content...", icon: "✨", delay: 1800 },
  { label: "Recommending creators...", icon: "🌟", delay: 2700 },
  { label: "Almost ready!", icon: "🚀", delay: 3400 },
];

export function AILoading({ onComplete }: AILoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimers = STEPS.map((step, i) =>
      setTimeout(() => setCurrentStep(i), step.delay)
    );

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 110);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4200);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#07070e", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Animated background orbs */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 text-center w-full max-w-md mx-auto px-6">
        {/* Logo with spinning ring */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                boxShadow: "0 0 60px rgba(124,58,237,0.5)",
              }}
            >
              <Zap size={40} className="text-white" />
            </div>
            {/* Spinning ring */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                border: "2px solid transparent",
                borderTopColor: "#a78bfa",
                borderRightColor: "#22d3ee",
                animation: "spin 2s linear infinite",
                transform: "scale(1.15)",
                borderRadius: 24,
              }}
            />
          </div>
        </div>

        <h2 className="text-white mb-2" style={{ fontSize: 28, fontWeight: 700 }}>
          Building your UHerd
        </h2>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 40 }}>
          AI is personalizing everything just for you
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-10 text-left">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div
                key={i}
                className="flex items-center gap-4 transition-all duration-500"
                style={{ opacity: i > currentStep ? 0.3 : 1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isDone
                      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                      : isActive
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.05)",
                    border: isActive
                      ? "1px solid rgba(124,58,237,0.5)"
                      : isDone
                        ? "none"
                        : "1px solid rgba(255,255,255,0.07)",
                    fontSize: 18,
                  }}
                >
                  {isDone ? "✓" : step.icon}
                </div>
                <span
                  style={{
                    color: isDone ? "#a78bfa" : isActive ? "#f1f5f9" : "#475569",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 15,
                  }}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div className="flex gap-1 ml-auto">
                    {[0, 1, 2].map(dot => (
                      <div
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#7c3aed",
                          animation: `bounce 1s ease-in-out ${dot * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
              boxShadow: "0 0 10px rgba(124,58,237,0.6)",
            }}
          />
        </div>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 12 }}>
          {Math.round(progress)}% complete
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: scale(1.15) rotate(0deg); } to { transform: scale(1.15) rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); } }
      `}</style>
    </div>
  );
}
