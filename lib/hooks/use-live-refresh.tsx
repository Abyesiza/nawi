'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Polls server-rendered data by calling router.refresh() at a steady interval.
 * Pauses when the tab is hidden, and refreshes immediately when it's revealed.
 *
 * Use for read-mostly screens that need near-real-time updates without
 * adding a websocket layer (chat, dashboards, admin queues).
 */
export function useLiveRefresh(intervalMs: number = 5000) {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    function start() {
      stop();
      timer = setInterval(() => {
        if (document.visibilityState === 'visible') router.refresh();
      }, intervalMs);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function onVisibility() {
      if (document.visibilityState === 'visible') {
        router.refresh();
        start();
      } else {
        stop();
      }
    }

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, router]);
}

/**
 * Component wrapper for places where adding a hook would require
 * converting a server component to a client component.
 */
export function LiveRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  useLiveRefresh(intervalMs);
  return null;
}
