import { useEffect, useLayoutEffect } from 'react';

import { SCREEN_BY_SECTION, SECTION_ORDER } from '../../../../lib/motion3d/phone-motion.constants';
import {
  notifySectionNavigation,
  registerPhoneNavigationHandler,
} from '../../../../lib/motion3d/phone-navigation';
import type { PhoneAnchors, SectionKey } from '../../../../lib/motion3d/phone-motion.types';
import type { Phone2DMotionArgs } from './PhoneStage2D.types';

/* Intrinsic size of the 2D phone — .phone-2d / .phone-screen-frame rendered at
   --phone-screen-resolution: 1. Keep in sync with phone-stage-2d.css. */
const PHONE_WIDTH_PX = 303;
const PHONE_HEIGHT_PX = 660;

/* The phone dissolves as the contact section takes over the small screen,
   mirroring the desktop timeline's contact fade. It completes before the
   section fully snaps in, so the phone is entirely gone on contact rather than
   lingering small and semi-transparent. */
const CONTACT_FADE_START = SECTION_ORDER.length - 1 - 0.65;
const CONTACT_FADE_SPAN = 0.35;

/* Layer opacity falls to 0 one section away, so exactly two adjacent screens
   ever cross-dissolve at once. */
const LAYER_FADE_SPAN = 1;

type StageTarget = { x: number; y: number; scale: number };

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const lerp = (from: number, to: number, ratio: number): number => from + (to - from) * ratio;

/* Drives the plain 2D phone: it reads each section's DOM anchor to learn where
   the phone should sit when that section is snapped, then translates/scales the
   fixed phone along the scroll and cross-dissolves the projected screen layers.
   No rotation, no per-frame DOM projection — just transform + opacity. */
export const usePhone2DStageMotion = ({
  stageRef,
  phoneRef,
  anchors,
  screenRefs,
}: Phone2DMotionArgs): void => {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const phone = phoneRef.current;

    if (!stage || !phone) {
      return undefined;
    }

    let targets: Record<SectionKey, StageTarget> | null = null;
    let frame = 0;

    /* Anchor pose is measured relative to its own section, so it describes the
       phone's viewport position when that section is snapped — independent of
       the current scroll offset. */
    const measure = (): void => {
      const next = {} as Record<SectionKey, StageTarget>;

      for (const section of SECTION_ORDER) {
        const anchorElement = anchors[section].anchorRef.current;
        const sectionElement = anchors[section].sectionRef.current;

        if (!anchorElement || !sectionElement) {
          targets = null;

          return;
        }

        const anchorRect = anchorElement.getBoundingClientRect();
        const sectionRect = sectionElement.getBoundingClientRect();
        const centerX = anchorRect.left + anchorRect.width / 2;
        const centerY = anchorRect.top - sectionRect.top + anchorRect.height / 2;
        const scale = Math.min(
          anchorRect.width / PHONE_WIDTH_PX,
          anchorRect.height / PHONE_HEIGHT_PX,
        );

        next[section] = {
          x: centerX - PHONE_WIDTH_PX / 2,
          y: centerY - PHONE_HEIGHT_PX / 2,
          scale,
        };
      }

      targets = next;
    };

    const render = (): void => {
      frame = 0;

      const profileSection = anchors.profile.sectionRef.current;

      if (!targets || !profileSection) {
        return;
      }

      const profileRect = profileSection.getBoundingClientRect();
      const sectionHeight = profileRect.height || 1;
      const lastIndex = SECTION_ORDER.length - 1;
      const progress = clamp(-profileRect.top / sectionHeight, 0, lastIndex);
      const lowerIndex = Math.min(Math.floor(progress), lastIndex);
      const upperIndex = Math.min(lowerIndex + 1, lastIndex);
      const fraction = progress - lowerIndex;

      const fromKey = SECTION_ORDER[lowerIndex];
      const toKey = SECTION_ORDER[upperIndex];

      if (!fromKey || !toKey) {
        return;
      }

      const from = targets[fromKey];
      const to = targets[toKey];
      const x = lerp(from.x, to.x, fraction);
      const y = lerp(from.y, to.y, fraction);
      const scale = lerp(from.scale, to.scale, fraction);

      phone.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

      const stageOpacity = clamp(1 - (progress - CONTACT_FADE_START) / CONTACT_FADE_SPAN, 0, 1);
      stage.style.opacity = `${stageOpacity}`;

      SECTION_ORDER.forEach((section, layerIndex) => {
        const layer = screenRefs[SCREEN_BY_SECTION[section]].current;

        if (!layer) {
          return;
        }

        const opacity = clamp(1 - Math.abs(layerIndex - progress) / LAYER_FADE_SPAN, 0, 1);

        layer.style.opacity = `${opacity}`;
        layer.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      });
    };

    const schedule = (): void => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const handleResize = (): void => {
      measure();
      schedule();
    };

    measure();
    render();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    void document.fonts.ready.then(handleResize, handleResize);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [anchors, phoneRef, screenRefs, stageRef]);
};

/* Nav-bar taps route through the shared phone-navigation registry. The 2D path
   answers them with a plain smooth scroll (the scrubbed phone follows), and
   first notifies listeners so an open project detail closes and releases its
   page-scroll lock before the scroll starts. */
export const usePhone2DNavigation = (anchors: PhoneAnchors): void => {
  useEffect(() => {
    const navigate = (section: SectionKey): boolean => {
      const sectionElement = anchors[section].sectionRef.current;

      if (!sectionElement) {
        return false;
      }

      notifySectionNavigation(section);

      /* Defer a frame so a just-closed project detail can lift its
         overflow lock before the scroll runs. */
      window.requestAnimationFrame(() => {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      return true;
    };

    return registerPhoneNavigationHandler(navigate);
  }, [anchors]);
};
