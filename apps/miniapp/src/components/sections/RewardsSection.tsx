import { useMemo, useState } from "react";
import type { Reward } from "@/types/home";

interface RewardsSectionProps {
  rewards: Reward[];
  userPoints: number;
}

const statusLabel: Record<Reward["status"], string> = {
  available: "Доступно",
  locked: "Закрыто",
  claimed: "Получено",
};

export function RewardsSection({ rewards, userPoints }: RewardsSectionProps) {
  const [selected, setSelected] = useState<Reward | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleRewards = useMemo(() => {
    if (showAll) return rewards;
    return rewards.slice(0, 5);
  }, [rewards, showAll]);

  const handleRewardClick = (reward: Reward) => {
    console.log("[RewardsSection] open reward", reward);
    setSelected(reward);
  };

  return (
    <section className="section rewards" aria-label="Доступы и награды">
      <div className="card rewards__shell">
        <div className="section__head rewards__head">
          <div>
            <h2 className="section__title">Доступы и награды</h2>
            <p className="rewards__subtitle">
              Трать сигналы, чтобы открывать дропы, IRL и статусные объекты сезона.
            </p>
          </div>
          <button
            type="button"
            className="rewards__all"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Скрыть" : "Все"}
          </button>
        </div>

        <div className="rewards__balance">{userPoints.toLocaleString("ru-RU")} сигналов</div>

        <ul className="rewards__grid">
          {visibleRewards.map((reward, index) => (
            <li
              key={reward.id}
              className={`rewards__card rewards__card--${reward.status} ${
                index % 3 === 0 ? "rewards__card--wide" : ""
              }`}
            >
              <button
                type="button"
                className="rewards__card-btn"
                onClick={() => handleRewardClick(reward)}
              >
                <div className="rewards__thumb">
                  {reward.imageUrl ? (
                    <span className="rewards__img-placeholder">{reward.category}</span>
                  ) : (
                    <span className="rewards__img-placeholder">Enzine</span>
                  )}
                </div>

                <div className="rewards__card-body">
                  <span className="rewards__category">{reward.category}</span>
                  <p className="rewards__name">{reward.title}</p>
                  <div className="rewards__meta-row">
                    <span className="rewards__cost">{reward.cost} pts</span>
                    <span className={`rewards__status rewards__status--${reward.status}`}>
                      {statusLabel[reward.status]}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reward-title">
          <button
            type="button"
            className="modal__backdrop"
            aria-label="Закрыть детали награды"
            onClick={() => setSelected(null)}
          />
          <div className="modal__panel">
            <div className="modal__head">
              <h2 id="reward-title" className="modal__title">
                {selected.title}
              </h2>
              <button
                type="button"
                className="modal__close"
                onClick={() => setSelected(null)}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <div className="rewards__detail">
              <p>
                <strong>Категория:</strong> {selected.category}
              </p>
              <p>
                <strong>Стоимость:</strong> {selected.cost} pts
              </p>
              <p>
                <strong>Статус:</strong> {statusLabel[selected.status]}
              </p>
              <p className="rewards__detail-note">
                Mock-detail: сюда подключим API и реальные условия получения награды.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
