import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

/* The scrubbed phone pose is only locked in after the model has loaded and the
   section anchors have their final, font-driven layout. Revealing the scene
   before then shows the phone snapping from its default pose to the profile
   position. This hook gates the loading overlay on those signals, adds a short
   settle buffer for the first ScrollTrigger refresh, and keeps a safety timeout
   so a failed asset can never leave the overlay stuck on screen. */
const SETTLE_BUFFER_MS = 400;
const SAFETY_TIMEOUT_MS = 8000;

export const useAppReady = (requires3D: boolean): boolean => {
  const { active, progress } = useProgress();
  const [areFontsReady, setAreFontsReady] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const markFontsReady = () => {
      if (!isCancelled) {
        setAreFontsReady(true);
      }
    };

    /* Resolve on failure too — a missing web font must not block the reveal. */
    document.fonts.ready.then(markFontsReady, markFontsReady);

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsReady(true), SAFETY_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  /* drei's loading store is global and persists a completed state, so an asset
     that finished before this hook subscribed still reads as done here. */
  const areAssetsReady = !requires3D || (!active && progress >= 100);
  const areDependenciesReady = areFontsReady && areAssetsReady;

  useEffect(() => {
    if (!areDependenciesReady) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setIsReady(true), SETTLE_BUFFER_MS);

    return () => window.clearTimeout(timeoutId);
  }, [areDependenciesReady]);

  return isReady;
};
