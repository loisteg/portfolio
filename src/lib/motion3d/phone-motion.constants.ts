import type { MotionRotation, SectionKey } from './phone-motion.types';

export const SECTION_ORDER = ['profile', 'about', 'projects', 'contact'] as const satisfies
  readonly SectionKey[];

export const BASE_ROTATION_Y = -0.16;
export const FULL_TURN = Math.PI * 2;

/* Per-section depth offsets (world z): positive moves the phone closer to the
   camera, negative pushes it away. Gives each screen a distinct sense of
   distance while the projects screen stays at the sharpest neutral plane. */
export const SECTION_DEPTHS: Record<'desktop' | 'mobile', Record<SectionKey, number>> = {
  desktop: { profile: 0.8, about: -1.4, projects: 0, contact: 0.35 },
  mobile: { profile: 0.25, about: -0.7, projects: 0, contact: 0 },
};

/* Resting tilt of the phone at each snapped section. */
export const SECTION_TILTS: Record<SectionKey, { x: number; z: number }> = {
  profile: { x: 0.045, z: -0.025 },
  about: { x: 0.02, z: 0.02 },
  projects: { x: 0, z: 0 },
  contact: { x: -0.02, z: -0.018 },
};

export const REST_ROTATION: MotionRotation = [0, BASE_ROTATION_Y, 0];

export const NAV_DURATION = 1.15;
export const NAV_DURATION_REDUCED = 0.45;

export const sectionRotationY = (section: SectionKey, isReducedMotion: boolean): number =>
  isReducedMotion
    ? BASE_ROTATION_Y
    : BASE_ROTATION_Y + FULL_TURN * SECTION_ORDER.indexOf(section);
