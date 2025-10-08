'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.1,
  speed: 400,
});

export default function ProgressProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Handle first load or reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      NProgress.start(); // show progress before refresh/unload
    };

    const handleLoad = () => {
      NProgress.done(); // stop when fully loaded
    };

    // Start progress when component mounts (SSR hydration)
    NProgress.start();
    const loadTimer = setTimeout(() => NProgress.done(), 500);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
      NProgress.done();
    };
  }, []);

  // ✅ Handle client-side route & search param changes
  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 400);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return <>{children}</>;
}
