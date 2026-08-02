import { useEffect, useState } from 'react';

import { portfolioContent } from '../../features/portfolio/content/portfolio.content';
import type { LoadingScreenProps } from './LoadingScreen.types';
import './loading-screen.css';

/* Kept in sync with the opacity transition in loading-screen.css so the overlay
   stays mounted (and keeps covering the scene) until it has fully faded out. */
const FADE_OUT_MS = 600;

const LoadingScreen = ({ isReady }: LoadingScreenProps) => {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setIsMounted(false), FADE_OUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isReady]);

  if (!isMounted) {
    return null;
  }

  const className = isReady ? 'loading-screen loading-screen--hidden' : 'loading-screen';

  return (
    <div className={className} role="status" aria-hidden={isReady}>
      <div className="loading-screen__brand">
        <span className="loading-screen__mark" aria-hidden="true">
          {portfolioContent.initials}
        </span>
        <span className="loading-screen__spinner" aria-hidden="true" />
      </div>
      <p className="loading-screen__status">{portfolioContent.accessibility.loading}</p>
    </div>
  );
};

export default LoadingScreen;
