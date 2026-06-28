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
import type { HomePageData } from "@/types/home";

export default function HomePage() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      const initUser = tg.initDataUnsafe?.user;
      if (initUser) {
        setUser({
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

  const displayName = user ? formatUserName(user) : data.userName;

  return (
    <MiniAppShell>
      <Header title={data.season.title} city={data.season.city} userName={displayName} />
      <HeroSlider slides={data.heroSlides} />
      <SeasonStats season={data.season} />
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
