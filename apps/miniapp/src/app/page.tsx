"use client";

import { useEffect, useState } from "react";
import { formatUserName, type User } from "@enzine/shared";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

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
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <main className="page">
      <h1>Enzine</h1>
      <p>Next.js Telegram Mini App готов к разработке.</p>
      {user && <p className="greeting">Привет, {formatUserName(user)}!</p>}
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
