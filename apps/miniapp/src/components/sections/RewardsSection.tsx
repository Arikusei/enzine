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
  return (
    <section className="section card rewards">
      <div className="section__head">
        <h2 className="section__title">Награды</h2>
        <span className="section__meta">{userPoints} pts</span>
      </div>
      <ul className="rewards__list">
        {rewards.map((reward) => (
          <li
            key={reward.id}
            className={`rewards__item rewards__item--${reward.status}`}
          >
            <div>
              <p className="rewards__name">{reward.title}</p>
              <p className="rewards__cost">{reward.cost} pts</p>
            </div>
            <span className="rewards__status">{statusLabel[reward.status]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
