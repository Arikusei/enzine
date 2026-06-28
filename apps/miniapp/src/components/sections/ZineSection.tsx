import type { ZineItem } from "@/types/home";

interface ZineSectionProps {
  items: ZineItem[];
}

export function ZineSection({ items }: ZineSectionProps) {
  return (
    <section className="section card zine">
      <h2 className="section__title">Zine</h2>
      <ul className="zine__list">
        {items.map((item) => (
          <li key={item.id} className="zine__item">
            <span className="zine__issue">{item.issue}</span>
            <h3 className="zine__headline">{item.headline}</h3>
            <p className="zine__excerpt">{item.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
