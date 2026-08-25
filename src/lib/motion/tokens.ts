/**
 * CAISN motion system — two speeds only.
 * snap: direct-response UI (buttons, toggles, variant swaps)
 * drift: scroll-scrubbed / narrative motion
 */
export const motion = {
  ease: {
    snap: "cubic-bezier(0.22, 1, 0.36, 1)",
    drift: "cubic-bezier(0.16, 0.9, 0.2, 1.02)",
  },
  duration: {
    snap: 0.2,
    drift: 1.1,
  },
  magnetic: {
    strength: 18, // max px pull
    radius: 90, // px activation radius
  },
} as const;

export const gsapEase = {
  snap: "power3.out",
  drift: "expo.out",
} as const;
