import { useState } from "react";
import { Onboarding } from "./components/Onboarding";
import { AILoading } from "./components/AILoading";
import { MainLayout } from "./components/MainLayout";

type Stage = "onboarding" | "loading" | "app";
type View = "home" | "explore" | "communities" | "live" | "sphere" | "messages" | "notifications" | "profile";

export default function App() {
  const [stage, setStage] = useState<Stage>("onboarding");
  const [currentView, setCurrentView] = useState<View>("home");

  if (stage === "onboarding") {
    return <Onboarding onComplete={() => setStage("loading")} />;
  }

  if (stage === "loading") {
    return <AILoading onComplete={() => setStage("app")} />;
  }

  return (
    <MainLayout
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view as View)}
    />
  );
}
