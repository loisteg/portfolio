import { useEffect } from 'react';

import type { PhoneScreenRefs } from '../../../../lib/motion3d/phone-motion.types';

const VERTICAL_SELECTOR = '.phone-scrollable';
const HORIZONTAL_SELECTOR = '.phone-scrollable-x';
const DRAG_THRESHOLD_PX = 6;
const MOMENTUM_MIN_VELOCITY = 0.02;
const MOMENTUM_DECAY_RATE = 0.004;

type DragState = {
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  horizontal: HTMLElement | null;
  vertical: HTMLElement | null;
  startScrollLeft: number;
  startScrollTop: number;
  axis: 'x' | 'y' | null;
  scroller: HTMLElement | null;
  ratio: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  velocity: number;
};

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

      if (horizontal) {
        /* Mouse wheels only emit vertical deltas — map the dominant axis onto
           the strip so photos scroll horizontally under the pointer. Once the
           strip is exhausted the event falls through to vertical scrolling. */
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
        const max = horizontal.scrollWidth - horizontal.clientWidth;
        const canScroll = delta > 0 ? horizontal.scrollLeft < max - 1 : horizontal.scrollLeft > 0;

        if (max > 1 && canScroll) {
          horizontal.scrollLeft += delta;
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

/* The same 3D-transform limitation breaks native touch panning, so dragging
   is bridged through pointer events too — ScrollView-style: the gesture locks
   onto its dominant axis (vertical pans the layer/detail, horizontal pans the
   photo strip) and glides with momentum after release. Mouse drags only pull
   the horizontal strip; vertical mouse drags stay free for text selection. */
export const usePhonePointerScroll = (frameRef: PhoneScreenRefs['surface']): void => {
  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return undefined;
    }

    let drag: DragState | null = null;
    let momentumFrame = 0;

    const stopMomentum = () => {
      if (momentumFrame) {
        window.cancelAnimationFrame(momentumFrame);
        momentumFrame = 0;
      }
    };

    const startMomentum = (scroller: HTMLElement, axis: 'x' | 'y', velocity: number) => {
      let currentVelocity = velocity;
      let lastTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - lastTime;
        lastTime = now;
        const decay = Math.exp(-MOMENTUM_DECAY_RATE * elapsed);
        const distance = currentVelocity * elapsed * decay;
        currentVelocity *= decay;

        const before = axis === 'x' ? scroller.scrollLeft : scroller.scrollTop;

        if (axis === 'x') {
          scroller.scrollLeft = before + distance;
        } else {
          scroller.scrollTop = before + distance;
        }

        const after = axis === 'x' ? scroller.scrollLeft : scroller.scrollTop;

        if (after === before || Math.abs(currentVelocity) < MOMENTUM_MIN_VELOCITY) {
          momentumFrame = 0;
          return;
        }

        momentumFrame = window.requestAnimationFrame(step);
      };

      momentumFrame = window.requestAnimationFrame(step);
    };

    const handlePointerDown = (event: PointerEvent) => {
      stopMomentum();

      const target = event.target;

      if (drag || !(target instanceof Element)) {
        return;
      }

      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      const horizontal = target.closest<HTMLElement>(HORIZONTAL_SELECTOR);
      const vertical = target.closest<HTMLElement>(VERTICAL_SELECTOR);

      if (!horizontal && !vertical) {
        return;
      }

      drag = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startX: event.clientX,
        startY: event.clientY,
        horizontal,
        vertical,
        startScrollLeft: horizontal?.scrollLeft ?? 0,
        startScrollTop: vertical?.scrollTop ?? 0,
        axis: null,
        scroller: null,
        ratio: 1,
        lastX: event.clientX,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        velocity: 0,
      };
    };

    /* Pointer deltas are visual px while scroll positions are layout px; the
       scroller's rendered size gives the exact conversion whatever the phone
       scale/zoom is. */
    const lockAxis = (event: PointerEvent, state: DragState, preferX: boolean): boolean => {
      const axis = preferX && state.horizontal ? 'x' : 'y';

      if (axis === 'y' && (state.pointerType === 'mouse' || !state.vertical)) {
        return false;
      }

      const scroller = axis === 'x' ? state.horizontal : state.vertical;

      if (!scroller) {
        return false;
      }

      const rect = scroller.getBoundingClientRect();
      const visualSize = axis === 'x' ? rect.width : rect.height;
      const layoutSize = axis === 'x' ? scroller.clientWidth : scroller.clientHeight;

      state.axis = axis;
      state.scroller = scroller;
      state.ratio = visualSize > 0 ? layoutSize / visualSize : 1;
      frame.setPointerCapture(event.pointerId);
      frame.dataset.dragging = 'true';

      if (axis === 'x') {
        scroller.dataset.dragging = 'true';
      }

      return true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (!drag.axis) {
        if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) {
          return;
        }

        if (!lockAxis(event, drag, Math.abs(deltaX) > Math.abs(deltaY))) {
          drag = null;
          return;
        }
      }

      const { axis, scroller, ratio } = drag;

      if (!scroller) {
        return;
      }

      if (axis === 'x') {
        scroller.scrollLeft = drag.startScrollLeft - deltaX * ratio;
      } else {
        scroller.scrollTop = drag.startScrollTop - deltaY * ratio;
      }

      const elapsed = event.timeStamp - drag.lastTime;

      if (elapsed > 0) {
        const pointerStep = axis === 'x'
          ? event.clientX - drag.lastX
          : event.clientY - drag.lastY;
        const instantVelocity = (-pointerStep * ratio) / elapsed;

        drag.velocity = drag.velocity * 0.6 + instantVelocity * 0.4;
      }

      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastTime = event.timeStamp;
    };

    const endDrag = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      const { axis, scroller, velocity, pointerType } = drag;

      if (axis && frame.hasPointerCapture(event.pointerId)) {
        frame.releasePointerCapture(event.pointerId);
      }

      delete frame.dataset.dragging;

      if (scroller) {
        delete scroller.dataset.dragging;
      }

      drag = null;

      const shouldGlide = event.type === 'pointerup'
        && pointerType !== 'mouse'
        && axis !== null
        && scroller !== null
        && Math.abs(velocity) >= MOMENTUM_MIN_VELOCITY * 4;

      if (shouldGlide && scroller && axis) {
        startMomentum(scroller, axis, velocity);
      }
    };

    frame.addEventListener('pointerdown', handlePointerDown);
    frame.addEventListener('pointermove', handlePointerMove);
    frame.addEventListener('pointerup', endDrag);
    frame.addEventListener('pointercancel', endDrag);

    return () => {
      stopMomentum();
      frame.removeEventListener('pointerdown', handlePointerDown);
      frame.removeEventListener('pointermove', handlePointerMove);
      frame.removeEventListener('pointerup', endDrag);
      frame.removeEventListener('pointercancel', endDrag);
    };
  }, [frameRef]);
};
