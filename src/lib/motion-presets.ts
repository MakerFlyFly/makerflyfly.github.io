export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionViewport = {
  once: true,
  margin: "-40px",
} as const;

export const motionDurations = {
  page: 0.42,
  card: 0.34,
  panel: 0.2,
  button: 0.16,
  articleRow: 0.18,
} as const;

export function pageEnter(reducedMotion: boolean, delay = 0) {
  return reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.18, delay },
      }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: motionDurations.page, ease: motionEase, delay },
      };
}

export function cardReveal(reducedMotion: boolean, delay = 0) {
  return reducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.16, delay },
      }
    : {
        initial: { opacity: 0, y: 14, scale: 0.96 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: motionDurations.card, ease: motionEase, delay },
      };
}

export function panelPopup(reducedMotion: boolean) {
  return reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.16 },
      }
    : {
        initial: { opacity: 0, y: 12, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.97 },
        transition: { duration: motionDurations.panel, ease: motionEase },
      };
}

export function buttonTap(reducedMotion: boolean) {
  return reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        transition: { duration: motionDurations.button, ease: motionEase },
      };
}

export function articleRowHover(reducedMotion: boolean) {
  return reducedMotion
    ? {}
    : {
        whileHover: {
          y: -3,
          scale: 1.01,
          transition: { duration: motionDurations.articleRow, ease: motionEase },
        },
        whileTap: {
          scale: 0.99,
          transition: { duration: motionDurations.button, ease: motionEase },
        },
      };
}
