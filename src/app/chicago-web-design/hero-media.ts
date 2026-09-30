import type { HeroVideoClip } from "../website-design/_components/ChicagoHeroBackground";

// All four owner-supplied clips: daylight to night, then repeat.
// Silent responsive encodes are local; original downloads stay outside the repo.
export const CHICAGO_HERO_CLIPS: readonly HeroVideoClip[] = ["day-skyline", "bridge", "sunset", "bean"].map(id => ({
  id,
  src: `/assets/chicago/chicago-${id}-desktop.mp4`,
  mobileSrc: `/assets/chicago/chicago-${id}-mobile.mp4`,
  webmSrc: `/assets/chicago/chicago-${id}-desktop.webm`,
  mobileWebmSrc: `/assets/chicago/chicago-${id}-mobile.webm`,
  poster: `/assets/chicago/chicago-${id}-desktop.webp`,
  mobilePoster: `/assets/chicago/chicago-${id}-mobile.webp`,
}));
