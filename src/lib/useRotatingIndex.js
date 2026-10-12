import { useEffect, useState } from "react";

/**
 * Index of the post currently highlighted. Starts at a random one, then advances
 * exactly `ms` after the last change (a manual pick restarts the countdown).
 * Paused while `pause(true)` (e.g. on hover); off for reduced motion.
 */
export default function useRotatingIndex(length, ms = 6000) {
  const [index, setIndex] = useState(0);
  const [paused, pause] = useState(false);

  // Random start whenever the set changes (data loaded, tab or search changed).
  useEffect(() => {
    setIndex(length > 0 ? Math.floor(Math.random() * length) : 0);
  }, [length]);

  useEffect(() => {
    if (length < 2 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % length), ms);
    return () => clearTimeout(t);
  }, [index, length, paused, ms]);

  return { index: length ? index % length : 0, setIndex, pause };
}
