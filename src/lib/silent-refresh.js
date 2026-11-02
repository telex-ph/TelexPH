import { getApiBaseUrl } from "./api-base.js";
const REFRESH_MS = 60 * 1e3;
const PUSH_GAP_MS = 3 * 1e3;
const CLOSED = 2; // EventSource.CLOSED, also true after the browser gives up on a 401
const liveEndpoint = () => `${getApiBaseUrl()}/dashboard/live`;
/**
 * Calls `refresh` while the browser tab is visible: when the server pushes a change (at most once every 3 seconds),
 * every minute as a backup, and once when the viewer comes back to the tab.
 * Returns a function that stops it. Never touch a loading flag from `refresh`: the screen must not change until new data arrives.
 */
function onSilentRefresh(refresh, ms = REFRESH_MS, liveUrl = liveEndpoint) {
  let source = null;
  let cooldown = null;
  let missedPush = false;
  const connect = () => {
    if (typeof EventSource === "undefined" || (source && source.readyState !== CLOSED)) return;
    source = new EventSource(liveUrl(), { withCredentials: true });
    source.onmessage = onPush;
  };
  const tick = () => {
    if (document.hidden) {
      source?.close();
      return;
    }
    refresh();
    connect();
  };
  const onPush = () => {
    if (cooldown) {
      missedPush = true;
      return;
    }
    tick();
    cooldown = setTimeout(() => {
      cooldown = null;
      if (missedPush) {
        missedPush = false;
        onPush();
      }
    }, PUSH_GAP_MS);
  };
  const timer = setInterval(tick, ms);
  document.addEventListener("visibilitychange", tick);
  if (!document.hidden) connect();
  return () => {
    clearInterval(timer);
    clearTimeout(cooldown);
    document.removeEventListener("visibilitychange", tick);
    source?.close();
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
