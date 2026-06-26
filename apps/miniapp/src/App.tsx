import { useEffect, useState } from "react";
import type { User } from "@enzine/shared";

export function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    const initData = tg.initDataUnsafe?.user;
    if (initData) {
      setUser({
        telegramId: initData.id,
        username: initData.username,
        firstName: initData.first_name,
        lastName: initData.last_name,
      });
    }
  }, []);

  return (
    <main className="app">
      <h1>Enzine</h1>
      <p>Mini App готов к разработке.</p>
      {user && (
        <p className="greeting">
          Привет, {user.firstName ?? user.username ?? "друг"}!
        </p>
      )}
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
