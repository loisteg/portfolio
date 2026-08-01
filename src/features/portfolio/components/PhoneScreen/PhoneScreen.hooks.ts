import { useEffect } from 'react';

import type { PhoneScreenRefs } from '../../../../lib/motion3d/phone-motion.types';

const VERTICAL_SELECTOR = '.phone-scrollable';
const HORIZONTAL_SELECTOR = '.phone-scrollable-x';

/* The phone UI lives inside drei's <Html transform> layer whose 3D transform
   is rewritten every animation frame; browsers refuse to pick the nested
   overflow elements as native wheel-scroll targets there, so wheel scrolling
   is bridged manually. Touch scrolling keeps its native path. */
export const usePhoneWheelScroll = (frameRef: PhoneScreenRefs['surface']): void => {
  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const horizontal = target.closest<HTMLElement>(HORIZONTAL_SELECTOR);

      if (horizontal && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        const max = horizontal.scrollWidth - horizontal.clientWidth;
        const canScroll = event.deltaX > 0 ? horizontal.scrollLeft < max - 1 : horizontal.scrollLeft > 0;

        if (max > 1 && canScroll) {
          horizontal.scrollLeft += event.deltaX;
          event.preventDefault();
          return;
        }
      }

      let scroller = target.closest<HTMLElement>(VERTICAL_SELECTOR);

      while (scroller) {
        const max = scroller.scrollHeight - scroller.clientHeight;
        const canScroll = event.deltaY > 0 ? scroller.scrollTop < max - 1 : scroller.scrollTop > 0;

        if (max > 1 && canScroll) {
          scroller.scrollTop += event.deltaY;
          event.preventDefault();
          return;
        }

        scroller = scroller.parentElement?.closest<HTMLElement>(VERTICAL_SELECTOR) ?? null;
      }
    };

    frame.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      frame.removeEventListener('wheel', handleWheel);
    };
  }, [frameRef]);
};
