import type { HomePageData } from "@/types/home";

/** Mock data — replace with API fetch (e.g. getHomePageData) in production */
export const homePageMock: HomePageData = {
  season: {
    title: "Enzine Pilot",
    city: "Томск",
    currentPhase: "Фаза 1",
    points: 2620,
    nextAccessProgress: 68,
  },
  userName: "Участник",
  heroSlides: [
    {
      id: "slide-1",
      tag: "PILOT",
      title: "Сезон открыт",
      subtitle: "Проходи фазы, копи очки, попадай на IRL",
      accent: "cyan",
    },
    {
      id: "slide-2",
      tag: "ZINE",
      title: "Новый выпуск",
      subtitle: "Digital zine #01 — город, шум, неон",
      accent: "magenta",
    },
    {
      id: "slide-3",
      tag: "IRL",
      title: "Живая встреча",
      subtitle: "Регистрация на митап в Томске",
      accent: "yellow",
    },
  ],
  rewards: [
    { id: "r1", title: "Стикер-пак Enzine", cost: 500, status: "available" },
    { id: "r2", title: "Доступ к фазе 2", cost: 1500, status: "available" },
    { id: "r3", title: "IRL pass", cost: 3000, status: "locked" },
    { id: "r4", title: "Zine print #01", cost: 2000, status: "claimed" },
  ],
  tasks: [
    { id: "t1", title: "Заполнить профиль", points: 100, done: true },
    { id: "t2", title: "Пройти фазу 1", points: 500, done: false },
    { id: "t3", title: "Прочитать zine #01", points: 200, done: false },
    { id: "t4", title: "Зарегистрироваться на IRL", points: 800, done: false },
  ],
  zineItems: [
    {
      id: "z1",
      issue: "#01",
      headline: "Город как интерфейс",
      excerpt: "Как urban-среда становится игровым полем сезона.",
    },
    {
      id: "z2",
      issue: "#02",
      headline: "Шум и сигнал",
      excerpt: "Фильтрация контента в эпоху перегрузки.",
    },
  ],
  irlEvents: [
    {
      id: "e1",
      title: "Enzine Meetup",
      date: "12 июл, 18:00",
      location: "Томск · Hub",
      spotsLeft: 14,
    },
    {
      id: "e2",
      title: "Zine Night",
      date: "26 июл, 19:30",
      location: "Томск · Loft",
      spotsLeft: 6,
    },
  ],
};

/** Future API adapter — swap mock for this signature */
export async function getHomePageData(): Promise<HomePageData> {
  return homePageMock;
}
