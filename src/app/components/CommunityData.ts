// ── Extended community data types ────────────────────────────────────────────

export interface CommunityMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  joinedAt: string;
  isBanned: boolean;
  isOnline: boolean;
}

export interface JoinRequest {
  id: string;
  userId: string;
  name: string;
  handle: string;
  avatar: string;
  message: string;
  requestedAt: string;
  followersCount: number;
}

export interface MsgReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface CommunityMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  senderRole: "admin" | "moderator" | "member";
  content: string;
  type: "text" | "image" | "file" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  imageUrl?: string;
  timestamp: string;
  reactions: MsgReaction[];
  isDeleted?: boolean;
  replyTo?: string;
}

export interface ExtendedCommunity {
  id: string;
  name: string;
  description: string;
  banner: string;
  icon: string;
  color: string;
  category: string;
  type: "public" | "private";
  adminId: string;
  members: CommunityMember[];
  pendingRequests: JoinRequest[];
  totalMembers: number;
  isJoined: boolean;
  isBanned: boolean;
  myRequestStatus?: "pending" | "denied" | null;
  activity: "Very Active" | "Active" | "Growing";
  messages: CommunityMessage[];
  rules: string[];
  tags: string[];
  createdAt: string;
  postsToday?: number;
  growthRate?: string;
  isNew?: boolean;
}

// ── Me (current user) ────────────────────────────────────────────────────────
export const ME_ID = "me";
export const ME: CommunityMember = {
  id: ME_ID,
  name: "Alex Rivera",
  handle: "codewitch_dev",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
  role: "member",
  joinedAt: "Feb 2024",
  isBanned: false,
  isOnline: true,
};

// ── Mock extended communities ─────────────────────────────────────────────────
export const EXTENDED_COMMUNITIES: ExtendedCommunity[] = [
  {
    id: "webdev",
    name: "WebDevHub",
    description: "Frontend, backend, and everything in between. From React to Rust, we talk about the craft of building the web. Share your projects, get code reviews, and level up together.",
    banner: "https://images.unsplash.com/photo-1461749280687-aa659517da5b?w=800&h=220&fit=crop&auto=format",
    icon: "💻",
    color: "#3b82f6",
    category: "Technology",
    type: "public",
    adminId: ME_ID,
    isJoined: true,
    isBanned: false,
    activity: "Active",
    totalMembers: 450000,
    postsToday: 145,
    growthRate: "+18%",
    createdAt: "Jan 2023",
    tags: ["React", "TypeScript", "Node.js", "WebDev", "OpenSource"],
    rules: [
      "Be respectful and constructive in all discussions",
      "Share working code snippets — test before posting",
      "No self-promotion without prior community contribution",
      "Label NSFW or off-topic content clearly",
      "Help others before asking for help",
    ],
    members: [
      { ...ME, role: "admin" },
      {
        id: "nova",
        name: "Nova Chen",
        handle: "nova_chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=80&h=80&fit=crop&auto=format",
        role: "moderator",
        joinedAt: "Mar 2023",
        isBanned: false,
        isOnline: true,
      },
      {
        id: "rex",
        name: "Rex Rodriguez",
        handle: "gamer_rex",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Apr 2023",
        isBanned: false,
        isOnline: false,
      },
      {
        id: "sarah",
        name: "Sarah Kim",
        handle: "startup_sarah",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Jun 2023",
        isBanned: false,
        isOnline: true,
      },
      {
        id: "lucia",
        name: "Lucia Fernandez",
        handle: "lens_lucia",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Aug 2023",
        isBanned: false,
        isOnline: false,
      },
      {
        id: "jay",
        name: "Jay Patel",
        handle: "cryptoking_jay",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Sept 2023",
        isBanned: false,
        isOnline: true,
      },
      {
        id: "banned1",
        name: "Spam Account 404",
        handle: "spambot_9000",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Oct 2023",
        isBanned: true,
        isOnline: false,
      },
    ],
    pendingRequests: [],
    messages: [
      {
        id: "m1",
        senderId: "nova",
        senderName: "Nova Chen",
        senderHandle: "nova_chen",
        senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=80&h=80&fit=crop&auto=format",
        senderRole: "moderator",
        content: "Anyone tried the new React 19 concurrent features in production? I'm seeing some interesting render patterns 👀",
        type: "text",
        timestamp: "10:14 AM",
        reactions: [{ emoji: "🔥", count: 12, reacted: false }, { emoji: "👀", count: 8, reacted: true }],
      },
      {
        id: "m2",
        senderId: ME_ID,
        senderName: "Alex Rivera",
        senderHandle: "codewitch_dev",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
        senderRole: "admin",
        content: "Yes! The `use()` hook is wild. Completely changes how you think about async in components. Here's a snippet I've been experimenting with:",
        type: "text",
        timestamp: "10:17 AM",
        reactions: [{ emoji: "💯", count: 6, reacted: false }],
      },
      {
        id: "m3",
        senderId: ME_ID,
        senderName: "Alex Rivera",
        senderHandle: "codewitch_dev",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
        senderRole: "admin",
        content: "react19-use-hook.ts",
        type: "file",
        fileName: "react19-use-hook.ts",
        fileSize: "4.2 KB",
        fileType: "typescript",
        timestamp: "10:17 AM",
        reactions: [],
      },
      {
        id: "m4",
        senderId: "sarah",
        senderName: "Sarah Kim",
        senderHandle: "startup_sarah",
        senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "This is giving me ideas for our startup's app. What's the bundle size impact though? We're trying to keep under 200KB gzipped",
        type: "text",
        timestamp: "10:21 AM",
        reactions: [{ emoji: "💡", count: 3, reacted: false }],
      },
      {
        id: "m5",
        senderId: "jay",
        senderName: "Jay Patel",
        senderHandle: "cryptoking_jay",
        senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "Check out this benchmark I ran comparing RSC vs traditional SSR — the numbers are surprising",
        type: "image",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&auto=format",
        timestamp: "10:28 AM",
        reactions: [{ emoji: "😮", count: 15, reacted: false }, { emoji: "🔥", count: 9, reacted: true }],
      },
      {
        id: "m6",
        senderId: "nova",
        senderName: "Nova Chen",
        senderHandle: "nova_chen",
        senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=80&h=80&fit=crop&auto=format",
        senderRole: "moderator",
        content: "Pinning this for the weekly review. Great data Jay 📌",
        type: "text",
        timestamp: "10:31 AM",
        reactions: [{ emoji: "👍", count: 4, reacted: false }],
      },
      {
        id: "m7",
        senderId: "rex",
        senderName: "Rex Rodriguez",
        senderHandle: "gamer_rex",
        senderAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "Random q — does anyone have a good Zod + React Hook Form setup they're happy with? Mine keeps breaking on nested arrays 😭",
        type: "text",
        timestamp: "11:04 AM",
        reactions: [{ emoji: "😭", count: 7, reacted: false }],
      },
      {
        id: "m8",
        senderId: ME_ID,
        senderName: "Alex Rivera",
        senderHandle: "codewitch_dev",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
        senderRole: "admin",
        content: "Attaching our company's Zod schema template — we've been using this pattern for 6 months, works great for nested structures 🎯",
        type: "file",
        fileName: "zod-rhf-template.ts",
        fileSize: "8.1 KB",
        fileType: "typescript",
        timestamp: "11:09 AM",
        reactions: [{ emoji: "🙌", count: 18, reacted: true }, { emoji: "❤️", count: 11, reacted: false }],
      },
      {
        id: "m9",
        senderId: "lucia",
        senderName: "Lucia Fernandez",
        senderHandle: "lens_lucia",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "Bit off-topic but I built a side project that combines photography metadata with React — would love feedback from this community 🙏",
        type: "text",
        timestamp: "11:45 AM",
        reactions: [{ emoji: "✨", count: 5, reacted: false }],
      },
      {
        id: "m10",
        senderId: "system",
        senderName: "System",
        senderHandle: "",
        senderAvatar: "",
        senderRole: "member",
        content: "🎉 WebDevHub just hit 450K members! Thank you all for being part of this incredible community.",
        type: "system",
        timestamp: "12:00 PM",
        reactions: [{ emoji: "🎉", count: 89, reacted: false }, { emoji: "🚀", count: 45, reacted: false }],
      },
    ],
  },

  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    description: "The frontier of artificial intelligence, from LLMs to computer vision. Share research, papers, and breakthroughs with the most active AI community on UHerd.",
    banner: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=220&fit=crop&auto=format",
    icon: "🤖",
    color: "#7c3aed",
    category: "Technology",
    type: "public",
    adminId: "nova",
    isJoined: true,
    isBanned: false,
    activity: "Very Active",
    totalMembers: 1200000,
    postsToday: 342,
    createdAt: "Nov 2022",
    tags: ["LLMs", "ComputerVision", "MLOps", "Research", "OpenAI"],
    rules: [
      "Cite your sources for research claims",
      "No hype without substance — back claims with data",
      "Constructive criticism only",
      "Mark speculative content clearly",
    ],
    members: [
      {
        id: "nova",
        name: "Nova Chen",
        handle: "nova_chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=80&h=80&fit=crop&auto=format",
        role: "admin",
        joinedAt: "Nov 2022",
        isBanned: false,
        isOnline: true,
      },
      { ...ME, role: "member", joinedAt: "Jan 2023" },
      {
        id: "felix",
        name: "Felix Wagner",
        handle: "fitness_felix",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Feb 2023",
        isBanned: false,
        isOnline: false,
      },
      {
        id: "zoe",
        name: "Zoe Williams",
        handle: "musicmaven_zoe",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Mar 2023",
        isBanned: false,
        isOnline: true,
      },
    ],
    pendingRequests: [],
    messages: [
      {
        id: "ai1",
        senderId: "nova",
        senderName: "Nova Chen",
        senderHandle: "nova_chen",
        senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=80&h=80&fit=crop&auto=format",
        senderRole: "admin",
        content: "Just finished 6 hours of GPT-5 evals. Thread dropping soon. Short version: the reasoning improvements are REAL. Not marketing hype.",
        type: "text",
        timestamp: "9:00 AM",
        reactions: [{ emoji: "🔥", count: 234, reacted: false }, { emoji: "👀", count: 189, reacted: true }],
      },
      {
        id: "ai2",
        senderId: "felix",
        senderName: "Felix Wagner",
        senderHandle: "fitness_felix",
        senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "Any benchmarks on the math reasoning? That was the biggest pain point for me with GPT-4",
        type: "text",
        timestamp: "9:08 AM",
        reactions: [{ emoji: "💯", count: 45, reacted: false }],
      },
      {
        id: "ai3",
        senderId: ME_ID,
        senderName: "Alex Rivera",
        senderHandle: "codewitch_dev",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "Sharing the benchmark comparison PDF I compiled from public eval data",
        type: "file",
        fileName: "gpt5-vs-gpt4-benchmarks.pdf",
        fileSize: "2.4 MB",
        fileType: "pdf",
        timestamp: "9:22 AM",
        reactions: [{ emoji: "🙌", count: 67, reacted: false }],
      },
      {
        id: "ai4",
        senderId: "zoe",
        senderName: "Zoe Williams",
        senderHandle: "musicmaven_zoe",
        senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "I've been using AI for music composition — honestly it's not replacing musicians but it's becoming an insane creative tool",
        type: "text",
        timestamp: "10:15 AM",
        reactions: [{ emoji: "🎵", count: 23, reacted: true }, { emoji: "💡", count: 18, reacted: false }],
      },
    ],
  },

  {
    id: "indie-hackers",
    name: "IndieHackers Elite",
    description: "A curated private community for serious founders and makers building profitable bootstrapped businesses. Quality over quantity — every member is vetted.",
    banner: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=220&fit=crop&auto=format",
    icon: "🚀",
    color: "#f59e0b",
    category: "Startups",
    type: "private",
    adminId: "sarah",
    isJoined: false,
    isBanned: false,
    myRequestStatus: null,
    activity: "Active",
    totalMembers: 340000,
    postsToday: 127,
    growthRate: "+23%",
    createdAt: "June 2023",
    tags: ["Bootstrapped", "SaaS", "Founders", "Revenue", "B2B"],
    rules: [
      "Members only — keep discussions confidential",
      "Share real numbers: MRR, churn, CAC — no vanity metrics",
      "No fundraising pitches or investor solicitation",
      "Everyone contributes — lurkers get removed monthly",
      "Positive-sum mindset only",
    ],
    members: [
      {
        id: "sarah",
        name: "Sarah Kim",
        handle: "startup_sarah",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
        role: "admin",
        joinedAt: "Jun 2023",
        isBanned: false,
        isOnline: true,
      },
      {
        id: "jay",
        name: "Jay Patel",
        handle: "cryptoking_jay",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
        role: "moderator",
        joinedAt: "Jul 2023",
        isBanned: false,
        isOnline: false,
      },
      {
        id: "felix",
        name: "Felix Wagner",
        handle: "fitness_felix",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "Aug 2023",
        isBanned: false,
        isOnline: true,
      },
    ],
    pendingRequests: [
      {
        id: "req1",
        userId: "user101",
        name: "Marcus Webb",
        handle: "marcus_builds",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
        message: "I run a bootstrapped B2B SaaS at $12K MRR. Pivoted 3 times in 18 months, now profitable. Looking to learn from people who've been there.",
        requestedAt: "2 hours ago",
        followersCount: 3400,
      },
      {
        id: "req2",
        userId: "user102",
        name: "Priya Sharma",
        handle: "priya_saas",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format",
        message: "Co-founder of a devtools startup ($8K MRR, 6 months post-launch). Want to connect with other technical founders who are building in public.",
        requestedAt: "5 hours ago",
        followersCount: 7800,
      },
      {
        id: "req3",
        userId: "user103",
        name: "Tobias Müller",
        handle: "tobias_indie",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
        message: "Serial indie hacker. 3 profitable products. Largest at $45K ARR. Looking for a serious community of operators.",
        requestedAt: "1 day ago",
        followersCount: 12000,
      },
    ],
    messages: [
      {
        id: "ih1",
        senderId: "sarah",
        senderName: "Sarah Kim",
        senderHandle: "startup_sarah",
        senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
        senderRole: "admin",
        content: "Monthly check-in! Drop your MRR and biggest win this month 👇 I'll start: hit $1M ARR this week 🎉",
        type: "text",
        timestamp: "Mon 9:00 AM",
        reactions: [{ emoji: "🎉", count: 45, reacted: true }, { emoji: "🚀", count: 38, reacted: false }],
      },
      {
        id: "ih2",
        senderId: "felix",
        senderName: "Felix Wagner",
        senderHandle: "fitness_felix",
        senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
        senderRole: "member",
        content: "Just crossed $28K MRR on FitPro 💪 Biggest win: finally nailed our onboarding flow — churn dropped 40%",
        type: "text",
        timestamp: "Mon 9:14 AM",
        reactions: [{ emoji: "🔥", count: 23, reacted: false }],
      },
      {
        id: "ih3",
        senderId: "jay",
        senderName: "Jay Patel",
        senderHandle: "cryptoking_jay",
        senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
        senderRole: "moderator",
        content: "Sharing our Q1 financials template — all the metrics VCs actually care about, adapted for bootstrapped context",
        type: "file",
        fileName: "bootstrapped-financials-template.xlsx",
        fileSize: "156 KB",
        fileType: "excel",
        timestamp: "Mon 10:30 AM",
        reactions: [{ emoji: "🙌", count: 34, reacted: false }, { emoji: "❤️", count: 19, reacted: true }],
      },
    ],
  },

  {
    id: "photography",
    name: "PhotographyPro",
    description: "Master your craft with techniques, gear reviews, and inspiration from photographers worldwide. All skill levels welcome.",
    banner: "https://images.unsplash.com/photo-1606983940588-4f5b2bce4dc4?w=800&h=220&fit=crop&auto=format",
    icon: "📸",
    color: "#ec4899",
    category: "Photography",
    type: "public",
    adminId: "lucia",
    isJoined: false,
    isBanned: false,
    activity: "Active",
    totalMembers: 890000,
    postsToday: 234,
    createdAt: "Mar 2023",
    tags: ["Photography", "Gear", "Editing", "Lightroom", "SonyAlpha"],
    rules: [
      "Credit the photographer and location when sharing others' work",
      "Constructive critique only — no unsolicited harsh criticism",
      "Mark AI-generated images clearly",
      "Share your settings and setup when posting shots",
    ],
    members: [
      {
        id: "lucia",
        name: "Lucia Fernandez",
        handle: "lens_lucia",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
        role: "admin",
        joinedAt: "Mar 2023",
        isBanned: false,
        isOnline: false,
      },
      {
        id: "zoe",
        name: "Zoe Williams",
        handle: "musicmaven_zoe",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format",
        role: "member",
        joinedAt: "May 2023",
        isBanned: false,
        isOnline: true,
      },
    ],
    pendingRequests: [],
    messages: [],
  },

  {
    id: "crypto",
    name: "CryptoVerse",
    description: "On-chain analysis, DeFi strategies, and the wild world of web3.",
    banner: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=220&fit=crop&auto=format",
    icon: "💰",
    color: "#10b981",
    category: "Finance",
    type: "public",
    adminId: "jay",
    isJoined: false,
    isBanned: false,
    activity: "Very Active",
    totalMembers: 1500000,
    postsToday: 567,
    createdAt: "Aug 2022",
    tags: ["Bitcoin", "DeFi", "NFT", "OnChain", "Trading"],
    rules: ["DYOR always", "No pump & dump schemes", "No financial advice claims"],
    members: [],
    pendingRequests: [],
    messages: [],
  },

  {
    id: "anime",
    name: "AnimeWorld",
    description: "Seasonal discussions, manga chapters, figure collections, cosplay, and the culture that unites us all.",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=220&fit=crop&auto=format",
    icon: "🌸",
    color: "#f43f5e",
    category: "Entertainment",
    type: "public",
    adminId: "rex",
    isJoined: false,
    isBanned: false,
    activity: "Very Active",
    totalMembers: 1800000,
    postsToday: 723,
    createdAt: "Jan 2022",
    tags: ["Anime", "Manga", "Seasonal", "Cosplay", "Frieren"],
    rules: ["Spoiler tags required", "No toxic ship wars", "Respect all genres"],
    members: [],
    pendingRequests: [],
    messages: [],
  },

  {
    id: "style",
    name: "StyleForward",
    description: "Fashion insiders, street style photographers, and trendsetters.",
    banner: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=220&fit=crop&auto=format",
    icon: "👗",
    color: "#d946ef",
    category: "Fashion",
    type: "private",
    adminId: "zoe",
    isJoined: false,
    isBanned: false,
    myRequestStatus: null,
    activity: "Growing",
    totalMembers: 560000,
    postsToday: 98,
    growthRate: "+41%",
    isNew: true,
    createdAt: "Apr 2024",
    tags: ["OOTD", "Fashion", "Style", "Hauls", "Trends"],
    rules: ["Original content only", "Be supportive", "No counterfeit promotion"],
    members: [
      {
        id: "zoe",
        name: "Zoe Williams",
        handle: "musicmaven_zoe",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format",
        role: "admin",
        joinedAt: "Apr 2024",
        isBanned: false,
        isOnline: true,
      },
    ],
    pendingRequests: [],
    messages: [],
  },
];

export const RECOMMENDED_COMMUNITY_IDS = ["ai-ml", "indie-hackers", "anime", "style"];

export function formatMemberCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

export const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  typescript: "🟦",
  javascript: "🟨",
  excel: "📊",
  image: "🖼️",
  zip: "🗜️",
  default: "📎",
};
