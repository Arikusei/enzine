"use client";

import { useEffect, useState } from "react";
import {
  ActionType,
  NodeType,
  SeasonStatus,
  UserState,
  formatUserName,
  type Season,
  type User,
  type UserStateRecord,
} from "@enzine/shared";

const demoSeason: Season = {
  id: "f0040003-0000-4000-8000-000000000001",
  slug: "test-season",
  title: "Тестовый сезон",
  status: SeasonStatus.Active,
};

const demoUserState: UserStateRecord = {
  id: "f0040006-0000-4000-8000-000000000001",
  userId: "f0040001-0000-4000-8000-000000000001",
  seasonId: demoSeason.id,
  currentPhaseId: "f0040004-0000-4000-8000-000000000001",
  state: UserState.Phase1Available,
  updatedAt: new Date().toISOString(),
};

const demoNodes: { type: NodeType; title: string }[] = [
  { type: NodeType.Message, title: "Добро пожаловать" },
  { type: NodeType.Form, title: "Контактные данные" },
  { type: NodeType.Webapp, title: "Mini App" },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userState] = useState<UserStateRecord>(demoUserState);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

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

    console.log(ActionType.PhaseViewed, {
      seasonId: demoSeason.id,
      state: userState.state,
    });
  }, [userState.state]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <main className="page">
      <h1>Enzine</h1>
      <p>Next.js Telegram Mini App</p>

      {user && <p className="greeting">Привет, {formatUserName(user)}!</p>}

      <section className="card">
        <h2>{demoSeason.title}</h2>
        <p>
          Статус сезона: <strong>{demoSeason.status}</strong>
        </p>
        <p>
          Ваше состояние: <strong>{userState.state}</strong>
        </p>
      </section>

      <section className="card">
        <h3>Узлы фазы</h3>
        <ul>
          {demoNodes.map((node) => (
            <li key={node.title}>
              [{node.type}] {node.title}
            </li>
          ))}
        </ul>
      </section>

      {apiUrl && <p className="hint">API: {apiUrl}</p>}
    </main>
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
