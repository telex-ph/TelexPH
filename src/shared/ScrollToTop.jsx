import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Restores Next's default behaviour of starting each navigation at the top,
 * while still honouring in-page #hash links. Tab-style navigations
 * (e.g. job tabs) pass `state: { keepScroll: true }` to stay in place.
 */
const ScrollToTop = () => {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if (state?.keepScroll) return;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
