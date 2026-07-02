export interface HeaderUser {
  name: string;
  avatarUrl: string;
  city: string;
}

export interface HomeSeason {
  title: string;
  city: string;
  currentPhase: string;
  points: number;
  nextAccessProgress: number;
}

export interface SeasonStatsData {
  points: number;
  progressTitle: string;
  progressValue: string;
  progressDescription: string;
}

export type HeroSlideBackgroundType = "image" | "gradient" | "noise";
export type HeroSlideTargetType = "phase" | "drop" | "zine" | "irl";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  ctaText: string;
  backgroundType: HeroSlideBackgroundType;
  imageUrl?: string;
  targetType: HeroSlideTargetType;
}

export interface Reward {
  id: string;
  title: string;
  category: string;
  cost: number;
  status: "available" | "locked" | "claimed";
  imageUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  points: number;
  done: boolean;
}

export interface ZineItem {
  id: string;
  issue: string;
  headline: string;
  excerpt: string;
}

export interface IrlEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  spotsLeft: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface HomePageData {
  user: HeaderUser;
  season: HomeSeason;
  stats: SeasonStatsData;
  heroSlides: HeroSlide[];
  rewards: Reward[];
  tasks: Task[];
  zineItems: ZineItem[];
  irlEvents: IrlEvent[];
  notifications: NotificationItem[];
}
