import type { HomeSeason } from "@/types/home";

interface SeasonStatsProps {
  season: HomeSeason;
}

export function SeasonStats({ season }: SeasonStatsProps) {
  return (
    <section className="section card stats">
      <h2 className="section__title">Сезон</h2>
      <div className="stats__grid">
        <div className="stats__item">
          <span className="stats__label">Фаза</span>
          <span className="stats__value">{season.currentPhase}</span>
        </div>
        <div className="stats__item stats__item--accent">
          <span className="stats__label">Очки</span>
          <span className="stats__value">{season.points.toLocaleString("ru-RU")}</span>
        </div>
      </div>
      <div className="stats__progress">
        <div className="stats__progress-head">
          <span>Доступ к следующему уровню</span>
          <span className="stats__progress-pct">{season.nextAccessProgress}%</span>
        </div>
        <div className="stats__progress-bar">
          <div
            className="stats__progress-fill"
            style={{ width: `${season.nextAccessProgress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
