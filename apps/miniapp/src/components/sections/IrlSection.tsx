import type { IrlEvent } from "@/types/home";

interface IrlSectionProps {
  events: IrlEvent[];
}

export function IrlSection({ events }: IrlSectionProps) {
  return (
    <section className="section card irl">
      <h2 className="section__title">IRL</h2>
      <ul className="irl__list">
        {events.map((event) => (
          <li key={event.id} className="irl__item">
            <div className="irl__main">
              <h3 className="irl__title">{event.title}</h3>
              <p className="irl__meta">
                {event.date} · {event.location}
              </p>
            </div>
            <span className="irl__spots">{event.spotsLeft} мест</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
