import type { RootState } from '@react-three/fiber';
import { Vector3 } from 'three';

import { FULL_TURN, SECTION_FLOAT_STRENGTH } from './phone-motion.constants';
import { PHONE_HEIGHT, PHONE_WIDTH } from './PhoneModel.constants';
import type { MotionTarget, PhoneAnchor, SectionKey } from './phone-motion.types';

const WORLD_ORIGIN = new Vector3(0, 0, 0);

export type TargetResolver = (anchor: PhoneAnchor, depth?: number) => MotionTarget;

/* Converts a DOM anchor box into a world-space pose. The anchor position is
   measured inside its own section, so the result describes the pose valid
   when that section is snapped to the viewport — independent of the current
   scroll position. Reads camera/size/viewport through the live state getter,
   so a canvas resize never requires rebuilding the resolver. */
export const createTargetResolver = (
  getState: () => RootState,
): TargetResolver => (anchor, depth = 0) => {
  const anchorElement = anchor.anchorRef.current;
  const sectionElement = anchor.sectionRef.current;

  if (!anchorElement || !sectionElement) {
    return { x: 0, y: 0, z: depth, scale: 1 };
  }

  const { camera, size, viewport } = getState();
  const anchorRect = anchorElement.getBoundingClientRect();
  const sectionRect = sectionElement.getBoundingClientRect();
  const currentViewport = viewport.getCurrentViewport(camera, WORLD_ORIGIN);
  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top - sectionRect.top + anchorRect.height / 2;
  const worldX = (centerX / size.width - 0.5) * currentViewport.width;
  const worldY = -(centerY / size.height - 0.5) * currentViewport.height;
  const widthScale = ((anchorRect.width / size.width) * currentViewport.width) / PHONE_WIDTH;
  const heightScale = ((anchorRect.height / size.height) * currentViewport.height) / PHONE_HEIGHT;

  return {
    x: worldX,
    y: worldY,
    z: depth,
    scale: Math.min(widthScale, heightScale),
  };
};

/* Reduced motion keeps the phone perfectly still on every section. */
export const resolveFloatStrength = (section: SectionKey, isReducedMotion: boolean): number =>
  isReducedMotion ? 0 : SECTION_FLOAT_STRENGTH[section];

/* Crossfades the outgoing phone-screen layer into the incoming one around a
   timeline label. Blur always settles back to 0 so layers never rest soft. */
export const addScreenTransition = (
  timeline: gsap.core.Timeline,
  outgoing: HTMLDivElement | null,
  incoming: HTMLDivElement | null,
  time: number,
  isReducedMotion: boolean,
): void => {
  if (!outgoing || !incoming) {
    return;
  }

  timeline
    .to(outgoing, {
      autoAlpha: 0,
      yPercent: -3,
      filter: 'blur(5px)',
      pointerEvents: 'none',
      duration: isReducedMotion ? 0.2 : 0.1,
    }, time + (isReducedMotion ? 0.32 : 0.22))
    .set(incoming, { yPercent: 3, filter: 'blur(6px)' }, time + 0.5)
    .to(incoming, {
      autoAlpha: 1,
      yPercent: 0,
      filter: 'blur(0px)',
      pointerEvents: 'auto',
      duration: isReducedMotion ? 0.2 : 0.12,
    }, time + (isReducedMotion ? 0.52 : 0.72));
};

/* Hides the phone surface mid-spin so the raw HTML never shows through the
   back of the 3D model. */
export const addSurfaceTurn = (
  timeline: gsap.core.Timeline,
  surface: HTMLDivElement | null,
  time: number,
  isReducedMotion: boolean,
): void => {
  if (!surface || isReducedMotion) {
    return;
  }

  timeline
    .to(surface, { autoAlpha: 0, pointerEvents: 'none', duration: 0.1 }, time + 0.2)
    .to(surface, { autoAlpha: 1, pointerEvents: 'auto', duration: 0.1 }, time + 0.7);
};

/* Picks a start angle that is visually identical to the current one (mod one
   turn) so the fly-to tween spins at most ~one extra turn toward the exact
   rotation value the scrubbed timeline expects at the destination. */
export const resolveSpinStart = (
  current: number,
  destination: number,
  direction: 1 | -1,
): number => {
  const diff = destination - current;
  const remainder = (((diff * direction) % FULL_TURN) + FULL_TURN) % FULL_TURN;

  return destination - direction * (FULL_TURN + remainder);
};
