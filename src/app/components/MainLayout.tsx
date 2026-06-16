import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { HomeFeed } from "./HomeFeed";
import { Explore } from "./Explore";
import { Communities } from "./Communities";
import { LiveHerds } from "./LiveHerds";
import { HerdSphere } from "./HerdSphere";
import { Messages } from "./Messages";
import { Notifications } from "./Notifications";
import { ProfilePage } from "./ProfilePage";

type View = "home" | "explore" | "communities" | "live" | "sphere" | "messages" | "notifications" | "profile";

interface MainLayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NO_RIGHT_SIDEBAR: View[] = ["messages"];

function renderContent(view: View) {
  switch (view) {
    case "home": return <HomeFeed />;
    case "explore": return <Explore />;
    case "communities": return <Communities />;
    case "live": return <LiveHerds />;
    case "sphere": return <HerdSphere />;
    case "messages": return <Messages />;
    case "notifications": return <Notifications />;
    case "profile": return <ProfilePage />;
  }
}

export function MainLayout({ currentView, onNavigate }: MainLayoutProps) {
  const showRightSidebar = !NO_RIGHT_SIDEBAR.includes(currentView);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#07070e", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Left sidebar */}
      <LeftSidebar
        currentView={currentView}
        onNavigate={onNavigate}
        notificationCount={3}
        messageCount={4}
      />

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginLeft: 260,
          marginRight: showRightSidebar ? 300 : 0,
          minHeight: "100vh",
          scrollbarWidth: "none",
        }}
      >
        {/* Subtle top border gradient */}
        <div
          className="sticky top-0 h-px w-full z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.4), transparent)" }}
        />
        {renderContent(currentView)}
      </main>

      {/* Right sidebar */}
      {showRightSidebar && (
        <RightSidebar onNavigate={onNavigate} />
      )}

      <style>{`
        main::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
