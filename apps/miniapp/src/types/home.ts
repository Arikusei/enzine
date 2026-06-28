export interface HomeSeason {
  title: string;
  city: string;
  currentPhase: string;
  points: number;
  nextAccessProgress: number;
}

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  accent: "cyan" | "magenta" | "yellow";
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  status: "available" | "locked" | "claimed";
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

export interface HomePageData {
  season: HomeSeason;
  userName?: string;
  heroSlides: HeroSlide[];
  rewards: Reward[];
  tasks: Task[];
  zineItems: ZineItem[];
  irlEvents: IrlEvent[];
}
