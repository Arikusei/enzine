"use client";

import { useState } from "react";
import type { HeaderUser, NotificationItem } from "@/types/home";
import { NotificationsModal } from "@/components/ui/NotificationsModal";

interface HeaderProps {
  user: HeaderUser;
  notifications: NotificationItem[];
}

function EnzineMark() {
  return (
    <svg className="header__brand-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 16 L12 6 L17 16 Z" fill="currentColor" />
    </svg>
  );
}

function TelegramMark() {
  return (
    <svg className="header__tg-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7 12 L16 7 L14 17 L11 13 L7 12 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="header__action-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a5 5 0 0 1 5 5v3l1.5 3H5.5L7 11V8a5 5 0 0 1 5-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="header__action-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 21c0-4 3-6 7-6s7 2 7 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header({ user, notifications }: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotifyClick = () => {
    console.log("[Header] notifications open", { unread: unreadCount });
    setModalOpen(true);
  };

  const handleProfileClick = () => {
    console.log("[Header] profile/settings stub", { user: user.name });
  };

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="header-bar">
        <div className="header-bar__left">
          <button
            type="button"
            className="header-bar__avatar-btn"
            onClick={handleProfileClick}
            aria-label={`Профиль ${user.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="header-bar__avatar"
              src={user.avatarUrl}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("header-bar__avatar-fallback--hidden");
              }}
            />
            <span className="header-bar__avatar-fallback header-bar__avatar-fallback--hidden" aria-hidden="true">
              {initials}
            </span>
          </button>

          <div className="header-bar__brand">
            <span className="header-bar__icons">
              <EnzineMark />
              <TelegramMark />
            </span>
            <div className="header-bar__title-wrap">
              <span className="header-bar__title">Enzine</span>
              <span className="header-bar__sep">/</span>
              <span className="header-bar__city">{user.city}</span>
            </div>
          </div>
        </div>

        <div className="header-bar__actions">
          <button
            type="button"
            className="header-bar__action"
            onClick={handleNotifyClick}
            aria-label="Уведомления"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="header-bar__badge">{unreadCount}</span>
            )}
          </button>
          <button
            type="button"
            className="header-bar__action"
            onClick={handleProfileClick}
            aria-label="Настройки профиля"
          >
            <ProfileIcon />
          </button>
        </div>
      </header>

      <NotificationsModal
        open={modalOpen}
        notifications={notifications}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
