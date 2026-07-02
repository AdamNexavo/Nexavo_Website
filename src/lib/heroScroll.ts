/** Aantal swipeable hero-kaarten — gebruikt voor scroll-pin duur en header-styling. */
export const HERO_CARD_COUNT = 3;

/** Fractie van viewport-hoogte per kaart-overgang tijdens gepinde hero-scroll. */
export const HERO_SCROLL_STEP_VH = 0.32;

export const getHeroPinScrollDistance = () =>
  typeof window !== "undefined"
    ? window.innerHeight *
        HERO_SCROLL_STEP_VH *
        Math.max(HERO_CARD_COUNT - 1, 0)
    : 0;

/** Scrollpositie waarna hero-header styling uit mag. */
export const getHeroScrollEnd = () =>
  typeof window !== "undefined"
    ? getHeroPinScrollDistance() + window.innerHeight
    : 0;
