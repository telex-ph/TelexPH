const REFRESH_MS = 60 * 1e3;
/**
 * Calls `refresh` every minute while the browser tab is visible, and once when the viewer comes back to it.
 * Returns a function that stops it. Never touch a loading flag from `refresh`: the screen must not change until new data arrives.
 */
function onSilentRefresh(refresh, ms = REFRESH_MS) {
  const tick = () => {
    if (!document.hidden) refresh();
  };
  const timer = setInterval(tick, ms);
  document.addEventListener("visibilitychange", tick);
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", tick);
  };
}
/** Keeps the old value when nothing changed, so React does not redraw (and charts do not re-animate). */
function keepIfSame(previous, next) {
  return JSON.stringify(previous) === JSON.stringify(next) ? previous : next;
}
export {
  keepIfSame,
  onSilentRefresh
};
