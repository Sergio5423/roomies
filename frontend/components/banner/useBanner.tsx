import { useEffect, useState } from "react";
import type { BannerSlide } from "../../app/data/mock/bannerSlides";

export function useBanner(slides: BannerSlide[], intervalTime = 6000) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [slides.length, intervalTime]);

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  return {
    activeSlide,
    slide: slides[activeSlide],
    previousSlide,
    nextSlide,
    goToSlide,
  };
}