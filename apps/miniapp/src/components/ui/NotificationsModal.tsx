"use client";

import type { NotificationItem } from "@/types/home";

interface NotificationsModalProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
}

export function NotificationsModal({ open, notifications, onClose }: NotificationsModalProps) {
  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="notifications-title">
      <button type="button" className="modal__backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__head">
          <h2 id="notifications-title" className="modal__title">
            Уведомления
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <ul className="modal__list">
          {notifications.map((item) => (
            <li
              key={item.id}
              className={`modal__item${item.read ? "" : " modal__item--unread"}`}
            >
              <p className="modal__item-title">{item.title}</p>
              <p className="modal__item-body">{item.body}</p>
              <span className="modal__item-time">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
