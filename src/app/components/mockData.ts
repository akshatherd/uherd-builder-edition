export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  verified: boolean;
  badge?: string;
  coverBanner?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  posts?: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  banner: string;
  icon: string;
  members: number;
  activity: "Very Active" | "Active" | "Growing";
  category: string;
  isJoined: boolean;
  isNew?: boolean;
  growthRate?: string;
  postsToday?: number;
  color: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Post {
  id: string;
  user: User;
  community?: Community;
  content: string;
  images?: string[];
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    endsIn: string;
    voted?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  isLiked: boolean;
  isReposted: boolean;
  isSaved: boolean;
  type: "text" | "image" | "poll" | "video";
  videoThumb?: string;
  videoDuration?: string;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "repost" | "mention" | "community" | "live";
  user?: User;
  content: string;
  timestamp: string;
  read: boolean;
  postPreview?: string;
}

export interface Room {
  id: string;
  name: string;
  category: string;
  host: User;
  speakers: User[];
  listeners: number;
  isLive: boolean;
  scheduledFor?: string;
  description: string;
  tags: string[];
  friendsIn?: number;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  content: string;
  timestamp: string;
}

export const USERS: User[] = [
  {
    id: "1",
    name: "Nova Chen",
    handle: "nova_chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=100&h=100&fit=crop&auto=format",
    coverBanner: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=200&fit=crop&auto=format",
    bio: "AI researcher @ DeepMind · Building the future of intelligence · prev: MIT CSAIL",
    followers: 45200,
    following: 892,
    isFollowing: false,
    verified: true,
    badge: "Creator",
    location: "San Francisco, CA",
    website: "novachen.ai",
    joinedDate: "March 2022",
    posts: 1247,
  },
  {
    id: "2",
    name: "Rex Rodriguez",
    handle: "gamer_rex",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&auto=format",
    coverBanner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=200&fit=crop&auto=format",
    bio: "Pro gamer & content creator · Twitch Partner · Competing since 2018 · ESL Champion",
    followers: 128000,
    following: 456,
    isFollowing: true,
    verified: true,
    badge: "Creator",
    location: "Austin, TX",
    joinedDate: "Jan 2021",
    posts: 4821,
  },
  {
    id: "3",
    name: "Sarah Kim",
    handle: "startup_sarah",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
    coverBanner: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=200&fit=crop&auto=format",
    bio: "Founder @ TechLaunch · Previously: Y Combinator W22 · Building in public 🚀",
    followers: 22400,
    following: 1203,
    isFollowing: false,
    verified: false,
    badge: "Founder",
    location: "New York, NY",
    website: "techlaunch.io",
    joinedDate: "June 2022",
    posts: 892,
  },
  {
    id: "4",
    name: "Alex Rivera",
    handle: "codewitch_dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    bio: "Senior SWE @ Stripe · TypeScript wizard · Open source contributor",
    followers: 8400,
    following: 340,
    isFollowing: true,
    verified: false,
    badge: "Developer",
    location: "Seattle, WA",
    joinedDate: "Sept 2023",
    posts: 523,
  },
  {
    id: "5",
    name: "Lucia Fernandez",
    handle: "lens_lucia",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format",
    coverBanner: "https://images.unsplash.com/photo-1606983940588-4f5b2bce4dc4?w=800&h=200&fit=crop&auto=format",
    bio: "Photographer · Capturing moments across 47 countries · Sony Alpha ambassador",
    followers: 67000,
    following: 234,
    isFollowing: false,
    verified: true,
    badge: "Creator",
    location: "Barcelona, Spain",
    website: "lucialens.com",
    joinedDate: "Feb 2022",
    posts: 2103,
  },
  {
    id: "6",
    name: "Jay Patel",
    handle: "cryptoking_jay",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
    bio: "DeFi analyst · On-chain data nerd · Running a fund since 2019",
    followers: 31000,
    following: 678,
    isFollowing: false,
    verified: false,
    badge: "Analyst",
    location: "Dubai, UAE",
    joinedDate: "May 2021",
    posts: 3456,
  },
  {
    id: "7",
    name: "Felix Wagner",
    handle: "fitness_felix",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
    bio: "NASM certified trainer · Powerlifter · Helping 50K+ people transform their bodies",
    followers: 89000,
    following: 123,
    isFollowing: true,
    verified: true,
    badge: "Creator",
    location: "Munich, Germany",
    joinedDate: "Nov 2021",
    posts: 1876,
  },
  {
    id: "8",
    name: "Zoe Williams",
    handle: "musicmaven_zoe",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format",
    bio: "Music producer · Grammy-nominated · Creating sounds that hit different 🎵",
    followers: 54000,
    following: 567,
    isFollowing: false,
    verified: true,
    badge: "Creator",
    location: "Los Angeles, CA",
    joinedDate: "April 2022",
    posts: 2341,
  },
];

export const COMMUNITIES: Community[] = [
  {
    id: "1",
    name: "AI & Machine Learning",
    description: "The frontier of artificial intelligence, from LLMs to computer vision. Share research, papers, and breakthroughs.",
    banner: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=200&fit=crop&auto=format",
    icon: "🤖",
    members: 1200000,
    activity: "Very Active",
    category: "Technology",
    isJoined: true,
    postsToday: 342,
    color: "#7c3aed",
  },
  {
    id: "2",
    name: "GamersUnite",
    description: "From indie gems to AAA blockbusters. Reviews, tips, tournaments, and the gaming culture you love.",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=200&fit=crop&auto=format",
    icon: "🎮",
    members: 2800000,
    activity: "Very Active",
    category: "Gaming",
    isJoined: true,
    postsToday: 891,
    color: "#06b6d4",
  },
  {
    id: "3",
    name: "IndieHackers",
    description: "Founders, makers, and entrepreneurs building profitable businesses. Share your journey, wins, and lessons.",
    banner: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=200&fit=crop&auto=format",
    icon: "🚀",
    members: 340000,
    activity: "Active",
    category: "Startups",
    isJoined: false,
    postsToday: 127,
    growthRate: "+23%",
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "PhotographyPro",
    description: "Master your craft with techniques, gear reviews, and inspiration from photographers worldwide.",
    banner: "https://images.unsplash.com/photo-1606983940588-4f5b2bce4dc4?w=600&h=200&fit=crop&auto=format",
    icon: "📸",
    members: 890000,
    activity: "Active",
    category: "Photography",
    isJoined: false,
    postsToday: 234,
    color: "#ec4899",
  },
  {
    id: "5",
    name: "CryptoVerse",
    description: "On-chain analysis, DeFi strategies, NFT drops, and the wild world of web3. DYOR always.",
    banner: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=200&fit=crop&auto=format",
    icon: "💰",
    members: 1500000,
    activity: "Very Active",
    category: "Finance",
    isJoined: false,
    postsToday: 567,
    color: "#10b981",
  },
  {
    id: "6",
    name: "FitnessFam",
    description: "Lift heavy, run fast, eat clean. Your community for workout routines, nutrition, and transformation stories.",
    banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=200&fit=crop&auto=format",
    icon: "💪",
    members: 2100000,
    activity: "Very Active",
    category: "Fitness",
    isJoined: true,
    postsToday: 678,
    color: "#f97316",
  },
  {
    id: "7",
    name: "MusicMakers",
    description: "Producers, musicians, and fans united. Share tracks, get feedback, discover underground talent.",
    banner: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=200&fit=crop&auto=format",
    icon: "🎵",
    members: 670000,
    activity: "Active",
    category: "Music",
    isJoined: false,
    postsToday: 189,
    color: "#8b5cf6",
  },
  {
    id: "8",
    name: "WebDevHub",
    description: "Frontend, backend, and everything in between. From React to Rust, we talk about the craft of building the web.",
    banner: "https://images.unsplash.com/photo-1461749280687-aa659517da5b?w=600&h=200&fit=crop&auto=format",
    icon: "💻",
    members: 450000,
    activity: "Active",
    category: "Technology",
    isJoined: true,
    postsToday: 145,
    growthRate: "+18%",
    color: "#3b82f6",
  },
  {
    id: "9",
    name: "AnimeWorld",
    description: "Seasonal discussions, manga chapters, figure collections, cosplay, and the culture that unites us all.",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=200&fit=crop&auto=format",
    icon: "🌸",
    members: 1800000,
    activity: "Very Active",
    category: "Entertainment",
    isJoined: false,
    postsToday: 723,
    color: "#f43f5e",
  },
  {
    id: "10",
    name: "StyleForward",
    description: "Fashion insiders, street style photographers, and trendsetters. OOTD, hauls, brand talks, and styling tips.",
    banner: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=200&fit=crop&auto=format",
    icon: "👗",
    members: 560000,
    activity: "Growing",
    category: "Fashion",
    isJoined: false,
    postsToday: 98,
    growthRate: "+41%",
    isNew: true,
    color: "#d946ef",
  },
  {
    id: "11",
    name: "TravelTales",
    description: "Stories, tips, and photos from every corner of the world. Budget travel to luxury escapes.",
    banner: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=200&fit=crop&auto=format",
    icon: "✈️",
    members: 980000,
    activity: "Active",
    category: "Travel",
    isJoined: false,
    postsToday: 234,
    color: "#14b8a6",
  },
  {
    id: "12",
    name: "ComedyCentral",
    description: "Memes, bits, hot takes, and the funniest corners of the internet. No serious zone.",
    banner: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&h=200&fit=crop&auto=format",
    icon: "😂",
    members: 3200000,
    activity: "Very Active",
    category: "Entertainment",
    isJoined: false,
    postsToday: 1204,
    color: "#eab308",
  },
];

export const POSTS: Post[] = [
  {
    id: "1",
    user: USERS[0],
    community: COMMUNITIES[0],
    content: "GPT-5 just dropped and I've been running evals for the past 6 hours straight. Thread on what I'm actually seeing 👇\n\nFirst: the reasoning improvements are REAL. Not marketing fluff. I tested it against 50 problems that GPT-4 consistently failed on and it solved 41 of them correctly.",
    timestamp: "2m ago",
    likes: 2847,
    comments: 342,
    reposts: 891,
    shares: 234,
    isLiked: false,
    isReposted: false,
    isSaved: true,
    type: "text",
  },
  {
    id: "2",
    user: USERS[1],
    community: COMMUNITIES[1],
    content: "Finally finished my dream setup after 3 years of saving 🎮✨ The RGB hits different at 3am. What do you think?",
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop&auto=format"],
    timestamp: "15m ago",
    likes: 8934,
    comments: 567,
    reposts: 1204,
    shares: 445,
    isLiked: true,
    isReposted: false,
    isSaved: false,
    type: "image",
  },
  {
    id: "3",
    user: USERS[3],
    community: COMMUNITIES[7],
    content: "Hot take incoming 🔥 We're still arguing about this in 2024?",
    poll: {
      question: "Best frontend framework in 2024?",
      options: [
        { id: "a", text: "React", votes: 14230 },
        { id: "b", text: "Vue.js", votes: 4560 },
        { id: "c", text: "Angular", votes: 2890 },
        { id: "d", text: "Svelte", votes: 6780 },
      ],
      totalVotes: 28460,
      endsIn: "18 hours",
      voted: undefined,
    },
    timestamp: "32m ago",
    likes: 3421,
    comments: 891,
    reposts: 567,
    shares: 123,
    isLiked: false,
    isReposted: false,
    isSaved: false,
    type: "poll",
  },
  {
    id: "4",
    user: USERS[2],
    community: COMMUNITIES[2],
    content: "🚀 We just crossed $1M ARR bootstrapped in 18 months. No VC, no debt, no outside investment.\n\nHere's exactly what we did differently (and what almost killed us at month 7):",
    timestamp: "1h ago",
    likes: 12400,
    comments: 892,
    reposts: 3210,
    shares: 1567,
    isLiked: true,
    isReposted: true,
    isSaved: true,
    type: "text",
  },
  {
    id: "5",
    user: USERS[4],
    community: COMMUNITIES[3],
    content: "Golden hour in Santorini. No filter, no editing. Just pure magic 🌅\n\nShot with Sony A7 IV + 85mm f/1.4",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=400&fit=crop&auto=format",
    ],
    timestamp: "2h ago",
    likes: 24680,
    comments: 1234,
    reposts: 4567,
    shares: 2341,
    isLiked: false,
    isReposted: false,
    isSaved: true,
    type: "image",
  },
  {
    id: "6",
    user: USERS[5],
    community: COMMUNITIES[4],
    content: "Bitcoin's behavior over the next 72hrs will tell us everything. I'm tracking 3 on-chain signals that have historically called every major move. Here's what I'm seeing right now (not financial advice):",
    timestamp: "3h ago",
    likes: 5670,
    comments: 445,
    reposts: 1890,
    shares: 678,
    isLiked: false,
    isReposted: false,
    isSaved: false,
    type: "text",
  },
  {
    id: "7",
    user: USERS[6],
    community: COMMUNITIES[5],
    content: "6 months transformation. Same person, different mindset, completely different body. The gym saved my mental health way before it changed my physique 💪",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format"],
    timestamp: "4h ago",
    likes: 31200,
    comments: 2341,
    reposts: 8903,
    shares: 4567,
    isLiked: true,
    isReposted: false,
    isSaved: true,
    type: "image",
  },
  {
    id: "8",
    user: USERS[7],
    community: COMMUNITIES[6],
    content: "New track dropping midnight 🌙 Preview just for UHerd fam. This one's been in the vault for 8 months and I think it's the best thing I've ever made.",
    videoThumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=340&fit=crop&auto=format",
    videoDuration: "0:47",
    timestamp: "5h ago",
    likes: 9870,
    comments: 678,
    reposts: 2345,
    shares: 1234,
    isLiked: false,
    isReposted: false,
    isSaved: false,
    type: "video",
  },
  {
    id: "9",
    user: USERS[3],
    community: COMMUNITIES[7],
    content: "Typescript tip that 90% of devs don't know: You can use `satisfies` to validate types without losing literal type information. Game changer for config objects.\n\n```typescript\nconst config = {\n  theme: 'dark',\n  lang: 'en'\n} satisfies AppConfig;\n// config.theme is 'dark', not string!\n```",
    timestamp: "6h ago",
    likes: 4560,
    comments: 234,
    reposts: 1890,
    shares: 567,
    isLiked: false,
    isReposted: false,
    isSaved: true,
    type: "text",
  },
  {
    id: "10",
    user: USERS[0],
    community: COMMUNITIES[8],
    content: "That final episode of Frieren just broke me. I don't think anime has ever made me feel something this profound. The way they handle time, grief, and connection is genuinely literary-level writing.",
    timestamp: "8h ago",
    likes: 18900,
    comments: 1456,
    reposts: 5678,
    shares: 2134,
    isLiked: true,
    isReposted: false,
    isSaved: false,
    type: "text",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "like",
    user: USERS[1],
    content: "liked your post about GPT-5 performance benchmarks",
    timestamp: "2m ago",
    read: false,
    postPreview: "GPT-5 just dropped and I've been running evals...",
  },
  {
    id: "2",
    type: "follow",
    user: USERS[2],
    content: "started following you",
    timestamp: "15m ago",
    read: false,
  },
  {
    id: "3",
    type: "comment",
    user: USERS[3],
    content: "commented on your post: \"This is exactly what I needed to read today. The TypeScript satisfies operator is criminally underused\"",
    timestamp: "1h ago",
    read: false,
    postPreview: "Typescript tip that 90% of devs don't know...",
  },
  {
    id: "4",
    type: "repost",
    user: USERS[4],
    content: "reposted your post to 67K followers",
    timestamp: "2h ago",
    read: true,
    postPreview: "GPT-5 just dropped and I've been running evals...",
  },
  {
    id: "5",
    type: "mention",
    user: USERS[5],
    content: "mentioned you in AI & Machine Learning: \"Great analysis by @nova_chen on the reasoning improvements\"",
    timestamp: "3h ago",
    read: true,
  },
  {
    id: "6",
    type: "community",
    content: "AI & Machine Learning community hit 1.2M members! Your posts helped make it happen 🎉",
    timestamp: "5h ago",
    read: true,
  },
  {
    id: "7",
    type: "live",
    user: USERS[6],
    content: "started a Live Herd: \"The Future of AI - Live Q&A\" — 1.2K people are listening",
    timestamp: "6h ago",
    read: true,
  },
  {
    id: "8",
    type: "like",
    user: USERS[7],
    content: "and 847 others liked your poll about frontend frameworks",
    timestamp: "8h ago",
    read: true,
    postPreview: "Best frontend framework in 2024?",
  },
];

export const ROOMS: Room[] = [
  {
    id: "1",
    name: "The Future of AI — Live Q&A",
    category: "Technology",
    host: USERS[0],
    speakers: [USERS[0], USERS[2], USERS[3]],
    listeners: 1247,
    isLive: true,
    description: "Deep dive into AGI timelines, safety, and where the field is heading. Ask anything.",
    tags: ["AI", "AGI", "LLMs", "Safety"],
    friendsIn: 3,
  },
  {
    id: "2",
    name: "Late Night Gaming — Vibes Only",
    category: "Gaming",
    host: USERS[1],
    speakers: [USERS[1]],
    listeners: 456,
    isLive: true,
    description: "Chill gaming session, taking game recommendations and roasting bad takes.",
    tags: ["Gaming", "Chill", "Variety"],
    friendsIn: 1,
  },
  {
    id: "3",
    name: "Crypto Market Analysis — BTC Breakdown",
    category: "Finance",
    host: USERS[5],
    speakers: [USERS[5]],
    listeners: 789,
    isLive: true,
    description: "Real-time on-chain analysis. Chart readings, whale movements, and what's next.",
    tags: ["Crypto", "Bitcoin", "DeFi", "Analysis"],
  },
  {
    id: "4",
    name: "Music Production Masterclass",
    category: "Music",
    host: USERS[7],
    speakers: [USERS[7], USERS[4]],
    listeners: 234,
    isLive: true,
    description: "Mixing tips, sound design, and critiquing your beats live. Drop your SoundCloud!",
    tags: ["Music", "Production", "Beats"],
  },
  {
    id: "5",
    name: "Startup Pitch Practice",
    category: "Business",
    host: USERS[2],
    speakers: [USERS[2]],
    listeners: 156,
    isLive: false,
    scheduledFor: "Tomorrow, 3:00 PM",
    description: "Practice your pitch in front of a supportive community. Feedback from founders.",
    tags: ["Startups", "Pitch", "Feedback"],
  },
  {
    id: "6",
    name: "Anime Season Finale Reactions",
    category: "Anime",
    host: USERS[0],
    speakers: [USERS[0], USERS[1]],
    listeners: 567,
    isLive: false,
    scheduledFor: "Today, 9:00 PM",
    description: "SPOILER ZONE: Reacting to the finale of Frieren, Mushoku Tensei, and Dungeon Meshi.",
    tags: ["Anime", "Spoilers", "Reactions"],
    friendsIn: 2,
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    user: USERS[1],
    lastMessage: "bro did you see that new game reveal?? 🔥",
    timestamp: "2m ago",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    user: USERS[2],
    lastMessage: "I'll send over the deck tonight, let me know what you think",
    timestamp: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    user: USERS[4],
    lastMessage: "These photos are absolutely stunning, how did you get that light?",
    timestamp: "3h ago",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    user: USERS[7],
    lastMessage: "The track is almost done, just mastering left",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    user: USERS[3],
    lastMessage: "TypeScript 5.5 just dropped, you seen the new features?",
    timestamp: "2d ago",
    unread: 0,
    online: false,
  },
];

export const THREAD_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "them",
    content: "Yo have you been following the whole AI situation lately?",
    timestamp: "Yesterday 10:34 PM",
  },
  {
    id: "2",
    sender: "me",
    content: "Honestly can't keep up anymore 😅 New model drops every week",
    timestamp: "Yesterday 10:35 PM",
  },
  {
    id: "3",
    sender: "them",
    content: "Right?? I saw your post about GPT-5 tho, great analysis",
    timestamp: "Yesterday 10:37 PM",
  },
  {
    id: "4",
    sender: "me",
    content: "Thanks! It was wild running those benchmarks. The reasoning improvement is legit",
    timestamp: "Yesterday 10:38 PM",
  },
  {
    id: "5",
    sender: "them",
    content: "bro did you see that new game reveal?? 🔥",
    timestamp: "2m ago",
  },
];

export const formatNumber = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};
