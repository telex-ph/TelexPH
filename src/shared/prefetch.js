/**
 * Warms a route's lazily-loaded chunk before the user commits to navigating.
 *
 * `next/link` prefetched links as they came into view; splitting the bundle
 * with React.lazy lost that, so the chunk download only started on click.
 * Kicking it off on hover/focus usually hides the download entirely.
 *
 * Registration lives in App.jsx, next to the lazy() calls, so the two can't
 * drift apart.
 */

/** pathname prefix -> () => import(...) */
const loaders = new Map();
const started = new Set();

export function registerPrefetch(entries) {
  for (const [path, loader] of entries) loaders.set(path.toLowerCase(), loader);
}

/** Longest matching prefix wins, so "/admin/dashboard" beats "/admin". */
function findLoader(pathname) {
  pathname = pathname.toLowerCase(); // React Router matches case-insensitively too
  let best = null;
  let bestLen = -1;
  for (const [path, loader] of loaders) {
    if (
      (pathname === path || pathname.startsWith(path + "/")) &&
      path.length > bestLen
    ) {
      best = loader;
      bestLen = path.length;
    }
  }
  return best;
}

export function prefetchRoute(pathname) {
  if (!pathname || started.has(pathname)) return;
  const loader = findLoader(pathname);
  if (!loader) return;
  started.add(pathname);
  // Failure here is not actionable — the click path will import it again and
  // surface any real error there.
  loader().catch(() => started.delete(pathname));
}
