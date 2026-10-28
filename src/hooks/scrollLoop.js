const subscribers = new Set();
let scheduled = false;
let listening = false;

function flush() {
  scheduled = false;
  for (const subscriber of subscribers) subscriber();
}

function schedule() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(flush);
  }
}

export function onScrollFrame(subscriber) {
  subscribers.add(subscriber);
  if (!listening) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    listening = true;
  }
  schedule();
  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      listening = false;
    }
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
