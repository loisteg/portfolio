import type { PhoneScreenRefs, SectionKey } from './phone-motion.types';

export const SECTION_ORDER = ['profile', 'about', 'projects', 'contact'] as const satisfies
  readonly SectionKey[];

export const FULL_TURN = Math.PI * 2;

export const SCREEN_BY_SECTION: Record<SectionKey, keyof Omit<PhoneScreenRefs, 'surface'>> = {
  profile: 'profile',
  about: 'metrics',
  projects: 'projects',
  contact: 'contact',
};

/* Per-section depth offsets (world z): positive moves the phone closer to the
   camera, negative pushes it away. Gives each screen a distinct sense of
   distance while the projects screen stays at the sharpest neutral plane. */
export const SECTION_DEPTHS: Record<'desktop' | 'mobile', Record<SectionKey, number>> = {
  desktop: { profile: 0.8, about: -0.8, projects: 0, contact: 0.35 },
  mobile: { profile: 0.25, about: -0.35, projects: 0, contact: 0 },
};

/* How strongly the weightless float sways the phone on each section. The
   projects screen pins the phone perfectly still, straight in front of the
   viewer, so its content reads like a real device demo. */
export const SECTION_FLOAT_STRENGTH: Record<SectionKey, number> = {
  profile: 1,
  about: 1,
  projects: 0,
  contact: 1,
};

export const NAV_DURATION = 1.15;
export const NAV_DURATION_REDUCED = 0.45;

/* Every section rests facing the viewer dead-on; full-motion mode adds one
   whole turn per section so the phone spins while flying between screens. */
export const sectionRotationY = (section: SectionKey, isReducedMotion: boolean): number =>
  isReducedMotion ? 0 : FULL_TURN * SECTION_ORDER.indexOf(section);
