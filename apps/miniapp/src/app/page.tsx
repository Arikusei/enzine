"use client";

import { useEffect, useState } from "react";
import { ActionType, formatUserName, type User } from "@enzine/shared";
import { MiniAppShell } from "@/components/shell";
import {
  Header,
  HeroSlider,
  SeasonStats,
  RewardsSection,
  TasksSection,
  ZineSection,
  IrlSection,
} from "@/components/sections";
import { getHomePageData } from "@/data/mock/home";
import type { HeaderUser, HomePageData } from "@/types/home";

function mergeTelegramUser(mockUser: HeaderUser, tgUser: User | null): HeaderUser {
  if (!tgUser) return mockUser;
  return {
    ...mockUser,
    name: formatUserName(tgUser),
    city: mockUser.city,
  };
}

export default function HomePage() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [tgUser, setTgUser] = useState<User | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      const initUser = tg.initDataUnsafe?.user;
      if (initUser) {
        setTgUser({
          telegramId: initUser.id,
          username: initUser.username,
          firstName: initUser.first_name,
          lastName: initUser.last_name,
        });
      }
    }

    getHomePageData().then(setData);
  }, []);

  useEffect(() => {
    if (data) {
      console.log(ActionType.PhaseViewed, { season: data.season.title });
    }
  }, [data]);

  if (!data) {
    return (
      <MiniAppShell>
        <div className="loading">Загрузка…</div>
      </MiniAppShell>
    );
  }

  const user = mergeTelegramUser(data.user, tgUser);

  return (
    <MiniAppShell>
      <Header user={user} notifications={data.notifications} />
      <HeroSlider slides={data.heroSlides} />
      <SeasonStats stats={data.stats} />
      <RewardsSection rewards={data.rewards} userPoints={data.season.points} />
      <TasksSection tasks={data.tasks} />
      <ZineSection items={data.zineItems} />
      <IrlSection events={data.irlEvents} />
    </MiniAppShell>
  );
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
          };
        };
      };
    };
  }
}
