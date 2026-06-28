"use client";

import { useCallback, useRef, useState } from "react";
import type { HeroSlide } from "@/types/home";

interface HeroSliderProps {
  slides: HeroSlide[];
}

const SWIPE_THRESHOLD = 48;

function slideClassName(slide: HeroSlide): string {
  const parts = [
    "hero__banner",
    `hero__banner--${slide.backgroundType}`,
    `hero__banner--target-${slide.targetType}`,
  ];
  return parts.join(" ");
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const slide = slides[active];
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive((index + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  const handleCta = () => {
    if (!slide) return;
    console.log("[HeroSlider] CTA", {
      id: slide.id,
      targetType: slide.targetType,
      title: slide.title,
    });
  };

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const diff = clientX - touchStartX.current;
    if (diff > SWIPE_THRESHOLD) goPrev();
    else if (diff < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  if (!slide || count === 0) return null;

  const bannerStyle =
    slide.backgroundType === "image" && slide.imageUrl
      ? { backgroundImage: `url(${slide.imageUrl})` }
      : undefined;

  return (
    <section className="section hero" aria-label="Главный баннер сезона">
      <div
        className="hero__viewport"
        onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
      >
        <div className={slideClassName(slide)} style={bannerStyle}>
          <div className="hero__overlay" />
          <div className="hero__content">
            <span className={`hero__label hero__label--${slide.targetType}`}>
              {slide.label}
            </span>
            <h2 className="hero__title">{slide.title}</h2>
            <p className="hero__subtitle">{slide.subtitle}</p>
            <button type="button" className="hero__cta" onClick={handleCta}>
              {slide.ctaText}
            </button>
          </div>
          {count > 1 && (
            <>
              <button
                type="button"
                className="hero__nav hero__nav--prev"
                aria-label="Предыдущий слайд"
                onClick={goPrev}
              />
              <button
                type="button"
                className="hero__nav hero__nav--next"
                aria-label="Следующий слайд"
                onClick={goNext}
              />
            </>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="hero__dots" role="tablist" aria-label="Слайды">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Слайд ${i + 1}: ${s.title}`}
              className={`hero__dot${i === active ? " hero__dot--active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
