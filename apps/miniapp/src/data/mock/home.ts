import type { HomePageData } from "@/types/home";

/** Mock data — replace with API fetch (e.g. getHomePageData) in production */
export const homePageMock: HomePageData = {
  user: {
    name: "Илья",
    avatarUrl: "/mock/avatar.svg",
    city: "Томск",
  },
  season: {
    title: "Enzine Pilot",
    city: "Томск",
    currentPhase: "Фаза 1",
    points: 2620,
    nextAccessProgress: 68,
  },
  stats: {
    points: 2620,
    progressTitle: "До следующего доступа",
    progressValue: "68%",
    progressDescription: "Заверши фазу, чтобы открыть дроп",
  },
  notifications: [
    {
      id: "n1",
      title: "Фаза 1 открыта",
      body: "Новые задачи доступны в сезоне Enzine Pilot.",
      time: "2 мин назад",
      read: false,
    },
    {
      id: "n2",
      title: "IRL Meetup",
      body: "Осталось 14 мест на встречу 12 июля.",
      time: "1 ч назад",
      read: false,
    },
    {
      id: "n3",
      title: "Zine #01",
      body: "Вышел новый выпуск — «Город как интерфейс».",
      time: "вчера",
      read: true,
    },
  ],
  heroSlides: [
    {
      id: "slide-1",
      title: "Фаза открыта",
      subtitle: "Войди в первый слой сезона",
      label: "Сейчас",
      ctaText: "Продолжить",
      backgroundType: "gradient",
      targetType: "phase",
    },
    {
      id: "slide-2",
      title: "Zine Drop 01",
      subtitle: "Ограниченный материал сезона",
      label: "Дроп",
      ctaText: "Открыть",
      backgroundType: "noise",
      targetType: "drop",
    },
    {
      id: "slide-3",
      title: "Enzine Meetup",
      subtitle: "12 июл · Томск · осталось 14 мест",
      label: "IRL",
      ctaText: "Записаться",
      backgroundType: "gradient",
      targetType: "irl",
    },
    {
      id: "slide-4",
      title: "Манифест сезона",
      subtitle: "Город, шум, доступ, community",
      label: "Zine",
      ctaText: "Читать",
      backgroundType: "noise",
      targetType: "zine",
    },
    {
      id: "slide-5",
      title: "Окно доступа",
      subtitle: "Фаза 2 откроется через 48 часов — успей войти",
      label: "Срочно",
      ctaText: "Не пропустить",
      backgroundType: "gradient",
      targetType: "phase",
    },
  ],
  rewards: [
    {
      id: "reward-1",
      title: "IRL-инвайт",
      category: "Доступ",
      cost: 1500,
      status: "locked",
      imageUrl: "/mock/irl-invite.png",
    },
    {
      id: "reward-2",
      title: "Zine Drop",
      category: "Материал",
      cost: 500,
      status: "available",
      imageUrl: "/mock/zine-drop.png",
    },
    {
      id: "reward-3",
      title: "Статус сезона",
      category: "Профиль",
      cost: 300,
      status: "available",
      imageUrl: "/mock/status.png",
    },
    {
      id: "reward-4",
      title: "Ранний доступ к дропу",
      category: "Доступ",
      cost: 1200,
      status: "available",
      imageUrl: "/mock/early-drop.png",
    },
    {
      id: "reward-5",
      title: "Аватарка сезона",
      category: "Профиль",
      cost: 250,
      status: "claimed",
      imageUrl: "/mock/avatar-badge.png",
    },
    {
      id: "reward-6",
      title: "Приоритетная регистрация",
      category: "IRL",
      cost: 900,
      status: "locked",
      imageUrl: "/mock/priority.png",
    },
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
