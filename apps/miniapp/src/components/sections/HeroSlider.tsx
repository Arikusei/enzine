"use client";

import { useState } from "react";
import type { HeroSlide } from "@/types/home";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  if (!slide) return null;

  return (
    <section className="section card hero">
      <div className={`hero__slide hero__slide--${slide.accent}`}>
        <span className="hero__tag">{slide.tag}</span>
        <h2 className="hero__title">{slide.title}</h2>
        <p className="hero__subtitle">{slide.subtitle}</p>
      </div>
      <div className="hero__dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`hero__dot${i === active ? " hero__dot--active" : ""}`}
            aria-label={`Слайд ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
