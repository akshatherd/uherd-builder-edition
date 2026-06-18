import { useState, useEffect } from "react";
import { Onboarding } from "./components/Onboarding";
import { AILoading } from "./components/AILoading";
import { MainLayout } from "./components/MainLayout";
import { Login } from "./components/Login"; // Added the new Login component
import { supabase } from "../supabase"; // The Supabase client

type Stage = "loading_auth" | "login" | "onboarding" | "loading_ai" | "app";
type View = "home" | "explore" | "communities" | "live" | "sphere" | "messages" | "notifications" | "profile";

export default function App() {
  const [stage, setStage] = useState<Stage>("loading_auth");
  const [currentView, setCurrentView] = useState<View>("home");

  useEffect(() => {
    // 1. Initial check when the app loads
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStage("login");
        return;
      }

      // If logged in, check if they finished onboarding
      checkOnboardingStatus(session.user.id);
    };

    checkUser();

    // 2. Listen for login/logout events happening in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkOnboardingStatus(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setStage("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to hit the database and check profile status
  const checkOnboardingStatus = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      // If profile doesn't exist yet, force onboarding
      setStage("onboarding"); 
    } else if (profile?.onboarding_completed) {
      setStage("app"); // Skip onboarding if already done
    } else {
      setStage("onboarding");
    }
  };

  // --- Rendering the Stages ---
  
  if (stage === "loading_auth") {
    // A quick black screen with a spinner while we check the database
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#07070e" }}>
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (stage === "login") {
    return <Login />;
  }

  if (stage === "onboarding") {
    return <Onboarding onComplete={() => setStage("loading_ai")} />;
  }

  if (stage === "loading_ai") {
    return <AILoading onComplete={() => setStage("app")} />;
  }

  return (
    <MainLayout
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view as View)}
    />
  );
}