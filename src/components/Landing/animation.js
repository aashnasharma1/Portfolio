export const slideUp = {
  initial: {
    y: 0,
  },
  enter: {
    y: 0,
    transition: { duration: 0 },
  },
};

export const slideUpText = {
  initial: {
    y: "100%",
  },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: {
    y: "100%",
    transition: { duration: 0.5 },
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
    y: 20,
  },
  open: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: delay },
  }),
  closed: {
    opacity: 0,
    y: 20,
  },
};

export const fadeInGlobe = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 1.0 },
  },
  closed: {
    opacity: 0,
    scale: 0.9,
  },
};

