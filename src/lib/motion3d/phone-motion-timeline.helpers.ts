import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Group } from 'three';

import {
  SCREEN_BY_SECTION,
  SECTION_DEPTHS,
  SECTION_ORDER,
  sectionRotationY,
} from './phone-motion.constants';
import {
  addScreenTransition,
  addSurfaceTurn,
  resolveFloatStrength,
} from './phone-motion.helpers';
import type { TargetResolver } from './phone-motion.helpers';
import type {
  FloatStrengthRef,
  MotionSetup,
  PhoneAnchors,
  PhoneScreenRefs,
  SectionKey,
} from './phone-motion.types';

export type SectionTimelineOptions = {
  mainElement: HTMLElement;
  phone: Group;
  anchors: PhoneAnchors;
  screenRefs: PhoneScreenRefs;
  shell: HTMLDivElement | null;
  floatStrengthRef: FloatStrengthRef;
  getTarget: TargetResolver;
  setup: MotionSetup;
};

/* On small viewports the contact section owns the whole screen, so the phone
   dissolves during the tail of the projects -> contact flight and
   re-materializes as soon as the visitor scrolls back out. */
const CONTACT_FADE_START = SECTION_ORDER.indexOf('contact') - 0.45;
const CONTACT_FADE_DURATION = 0.4;

/* Builds the scroll-scrubbed master timeline that flies the phone between the
   four section poses and crossfades the projected screen layers. */
export const buildSectionTimeline = ({
  mainElement,
  phone,
  anchors,
  screenRefs,
  shell,
  floatStrengthRef,
  getTarget,
  setup,
}: SectionTimelineOptions): ScrollTrigger => {
  const { isMobile, isReducedMotion } = setup;
  const phoneSurface = screenRefs.surface.current;
  const layers = SECTION_ORDER.map(
    (section) => screenRefs[SCREEN_BY_SECTION[section]].current,
  );
  const depths = SECTION_DEPTHS[isMobile ? 'mobile' : 'desktop'];

  const profileLayer = layers[0] ?? null;

  gsap.set(layers.filter(Boolean), {
    autoAlpha: 0,
    yPercent: 0,
    filter: 'blur(0px)',
    pointerEvents: 'none',
  });

  if (profileLayer) {
    gsap.set(profileLayer, { autoAlpha: 1, pointerEvents: 'auto' });
  }

  gsap.set(phoneSurface, { autoAlpha: 1, pointerEvents: 'auto' });

  if (shell) {
    gsap.set(shell, { autoAlpha: 1 });
  }

  const timeline = gsap.timeline({ defaults: { ease: 'none' } });

  const setPhoneTarget = (section: SectionKey, time: number) => {
    const target = () => getTarget(anchors[section], depths[section]);
    const ease = isReducedMotion ? 'none' : 'power1.inOut';

    timeline.to(phone.position, {
      x: () => target().x,
      y: () => target().y,
      z: () => target().z,
      duration: 1,
      ease,
    }, time);
    timeline.to(phone.scale, {
      x: () => target().scale,
      y: () => target().scale,
      z: () => target().scale,
      duration: 1,
      ease,
    }, time);
    timeline.to(phone.rotation, {
      y: sectionRotationY(section, isReducedMotion),
      duration: 1,
      ease,
    }, time);
    timeline.to(floatStrengthRef, {
      current: resolveFloatStrength(section, isReducedMotion, isMobile),
      duration: 1,
      ease,
    }, time);
  };

  const initial = getTarget(anchors.profile, depths.profile);
  gsap.set(phone.position, { x: initial.x, y: initial.y, z: initial.z });
  gsap.set(phone.scale, { x: initial.scale, y: initial.scale, z: initial.scale });
  gsap.set(phone.rotation, {
    x: 0,
    y: sectionRotationY('profile', isReducedMotion),
    z: 0,
  });
  gsap.set(floatStrengthRef, {
    current: resolveFloatStrength('profile', isReducedMotion, isMobile),
  });

  SECTION_ORDER.forEach((section, index) => {
    timeline.addLabel(section, index);

    if (index === SECTION_ORDER.length - 1) {
      return;
    }

    const nextSection = SECTION_ORDER[index + 1];

    if (!nextSection) {
      return;
    }

    setPhoneTarget(nextSection, index);
    addScreenTransition(
      timeline,
      layers[index] ?? null,
      layers[index + 1] ?? null,
      index,
      isReducedMotion,
    );
    addSurfaceTurn(timeline, phoneSurface, index, isReducedMotion);
  });

  if (isMobile && shell) {
    timeline.to(shell, {
      autoAlpha: 0,
      duration: CONTACT_FADE_DURATION,
      ease: 'power1.in',
    }, CONTACT_FADE_START);
  }

  /* Full render pass locks every tween's start/end values against the
     clean initial state, so the direct-navigation tweens (which write the
     same properties inline) can never be captured as stale start values. */
  timeline.progress(1, true).progress(0, true);

  return ScrollTrigger.create({
    animation: timeline,
    trigger: mainElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: isReducedMotion ? 0.15 : 0.55,
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      /* invalidateOnRefresh wipes recorded values — re-lock them from the
         refreshed layout. Restore the SCROLL-derived progress rather than
         the timeline's own (refresh internals may have reset it to 0). */
      const animation = self.animation;

      if (animation) {
        animation.totalProgress(1, true).totalProgress(0, true).totalProgress(self.progress, true);
      }
    },
  });
};
