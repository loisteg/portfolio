import { useSyncExternalStore } from 'react';

/* Tablets and phones (< 1024px) swap the WebGL phone for a plain 2D phone;
   computers and notebooks keep the 3D experience. The cutoff matches the
   existing responsive breakpoints in portfolio-responsive.css. */
const COMPACT_QUERY = '(max-width: 1023px)';

const subscribe = (onChange: () => void): (() => void) => {
  const query = window.matchMedia(COMPACT_QUERY);

  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
};

const getSnapshot = (): boolean => window.matchMedia(COMPACT_QUERY).matches;

/* No DOM on the server; the 3D branch is the safe default there. */
const getServerSnapshot = (): boolean => false;

const useIsCompactViewport = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsCompactViewport;
