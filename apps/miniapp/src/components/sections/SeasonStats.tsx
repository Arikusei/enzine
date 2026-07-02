import type { SeasonStatsData } from "@/types/home";

interface SeasonStatsProps {
  stats: SeasonStatsData;
}

export function SeasonStats({ stats }: SeasonStatsProps) {
  return (
    <section className="section stats" aria-label="Баланс и прогресс сезона">
      <div className="stats__grid">
        <div className="card stats__card stats__card--balance">
          <span className="stats__label">Баланс сезона</span>
          <span className="stats__value stats__value--balance">
            {stats.points.toLocaleString("ru-RU")}
          </span>
          <span className="stats__hint">Сигналы</span>
        </div>
        <div className="card stats__card stats__card--progress">
          <span className="stats__label">{stats.progressTitle}</span>
          <span className="stats__value stats__value--progress">{stats.progressValue}</span>
          <span className="stats__hint">{stats.progressDescription}</span>
        </div>
      </div>
    </section>
  );
}
