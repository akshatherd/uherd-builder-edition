import { useState } from "react";
import { Zap, Github, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "../../supabase";

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        // Create a brand new user
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Log in an existing user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      // Note: We don't need to manually redirect here. 
      // App.tsx is listening and will automatically route them!
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#07070e", fontFamily: "'Outfit', sans-serif" }}>
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-10">
        <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col items-center" style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]" style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              <Zap size={24} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-white mb-2 text-center" style={{ fontSize: 32, fontWeight: 700 }}>
            U<span style={{ color: "#a78bfa" }}>Herd</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: "30px", textAlign: "center" }}>
            {isSignUp ? "Create your builder account." : "Welcome back to the herd."}
          </p>

          {errorMsg && (
            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 text-center">
              {errorMsg}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                placeholder="Email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18181B] border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#18181B] border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "#fff", fontWeight: 600 }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? "Create Account" : "Sign In")}
            </button>
          </form>

          <div className="w-full flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-800 flex-1"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-800 flex-1"></div>
          </div>

          {/* Secondary GitHub Button */}
          <button onClick={handleGithubLogin} className="w-full py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#202024]" style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 500 }}>
            <Github size={18} />
            Continue with GitHub
          </button>
          
          <p className="mt-8 text-sm text-gray-400">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(""); }} 
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}