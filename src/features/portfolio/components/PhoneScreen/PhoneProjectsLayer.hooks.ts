import { useEffect } from 'react';

import {
  acquireWheelNavigationLock,
  registerSectionNavigationListener,
} from '../../../../lib/motion3d/phone-navigation';

/* Blocks page scrolling while the expanded project is open so a stray wheel
   or touch gesture cannot fly the story to another section. The phone's own
   scrollers keep working: both wheel and touch are bridged manually (see
   PhoneScreen.hooks.ts), so neither depends on native page scrolling. */
export const usePageScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    /* The fly-to wheel navigation ignores the overflow lock (it tweens the
       scroll position itself), so it is locked out explicitly too. */
    const releaseWheelNavigationLock = acquireWheelNavigationLock();

    const rootStyle = document.documentElement.style;
    const previousOverflow = rootStyle.overflow;
    rootStyle.overflow = 'hidden';

    /* iOS Safari historically ignores root overflow for touch scrolling —
       cancel native page panning explicitly. */
    const handleTouchMove = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      rootStyle.overflow = previousOverflow;
      document.removeEventListener('touchmove', handleTouchMove);
      releaseWheelNavigationLock();
    };
  }, [isLocked]);
};

/* The nav bar can still fly to another section while the detail is open; the
   detail must close first so the page-scroll lock is released before the
   flight starts and the visitor lands on a normal page state. */
export const useCloseDetailOnSectionLeave = (
  isDetailOpen: boolean,
  onClose: () => void,
): void => {
  useEffect(() => {
    if (!isDetailOpen) {
      return undefined;
    }

    return registerSectionNavigationListener((section) => {
      if (section !== 'projects') {
        onClose();
      }
    });
  }, [isDetailOpen, onClose]);
};
