import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

import {
  NAV_DURATION,
  NAV_DURATION_REDUCED,
  SCREEN_BY_SECTION,
  SECTION_DEPTHS,
  SECTION_ORDER,
  sectionRotationY,
} from './phone-motion.constants';
import {
  createTargetResolver,
  resolveFloatStrength,
  resolveSpinStart,
} from './phone-motion.helpers';
import { buildSectionTimeline } from './phone-motion-timeline.helpers';
import {
  getRevealController,
  notifySectionNavigation,
  registerPhoneNavigationHandler,
} from './phone-navigation';
import type {
  MotionSetup,
  PhoneMotionControllerProps,
  SectionKey,
} from './phone-motion.types';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const INTERRUPT_EVENTS = ['wheel', 'touchstart'] as const;

const PhoneMotionController = ({
  mainRef,
  phoneRef,
  anchors,
  screenRefs,
  shellRef,
  floatStrengthRef,
}: PhoneMotionControllerProps) => {
  /* `get` is stable across renders — reading live state through it keeps this
     effect's dependencies constant, so canvas resizes (including the scrollbar
     appearing/disappearing with the page-scroll lock) never tear the motion
     setup down to a default pose mid-frame. */
  const getThreeState = useThree((state) => state.get);

  useEffect(() => {
    const mainElement = mainRef.current;
    const phone = phoneRef.current;

    if (!mainElement || !phone) {
      return undefined;
    }

    const getTarget = createTargetResolver(getThreeState);
    let activeMotion: { trigger: ScrollTrigger; setup: MotionSetup } | null = null;
    let navTween: gsap.core.Timeline | null = null;

    const setupTimeline = (setup: MotionSetup) => {
      const trigger = buildSectionTimeline({
        mainElement,
        phone,
        anchors,
        screenRefs,
        shell: shellRef.current,
        floatStrengthRef,
        getTarget,
        setup,
      });

      activeMotion = { trigger, setup };

      return () => {
        if (activeMotion?.trigger === trigger) {
          activeMotion = null;
        }
      };
    };

    const navigate = (section: SectionKey): boolean => {
      const sectionElement = anchors[section].sectionRef.current;

      if (!activeMotion || !sectionElement) {
        return false;
      }

      const { trigger, setup } = activeMotion;
      const { isMobile, isReducedMotion } = setup;
      const targetY = window.scrollY + sectionElement.getBoundingClientRect().top;

      if (Math.abs(targetY - window.scrollY) < 1 && !navTween) {
        return true;
      }

      /* Listeners may release UI state that blocks scrolling (project detail
         page lock) — notify BEFORE the scroll tween captures its start. */
      notifySectionNavigation(section);

      navTween?.kill();
      trigger.disable(false);
      getRevealController()?.conceal();

      const rootStyle = document.documentElement.style;
      const previousScrollBehavior = rootStyle.scrollBehavior;
      rootStyle.scrollBehavior = 'auto';

      const duration = isReducedMotion ? NAV_DURATION_REDUCED : NAV_DURATION;
      const depths = SECTION_DEPTHS[isMobile ? 'mobile' : 'desktop'];
      const target = () => getTarget(anchors[section], depths[section]);
      const destRotation = sectionRotationY(section, isReducedMotion);
      const direction: 1 | -1 = targetY > window.scrollY ? 1 : -1;
      const incoming = screenRefs[SCREEN_BY_SECTION[section]].current;
      const others = SECTION_ORDER.filter((other) => other !== section)
        .map((other) => screenRefs[SCREEN_BY_SECTION[other]].current)
        .filter((layer): layer is HTMLDivElement => layer !== null);
      const surface = screenRefs.surface.current;
      const shell = shellRef.current;

      const handleUserScroll = () => navTween?.kill();
      const removeInterruptListeners = () => {
        INTERRUPT_EVENTS.forEach((eventName) =>
          window.removeEventListener(eventName, handleUserScroll));
      };

      const settle = () => {
        removeInterruptListeners();
        rootStyle.scrollBehavior = previousScrollBehavior;
        navTween = null;
      };

      const syncTimelineToScroll = () => {
        const span = trigger.end - trigger.start;
        const progress = span > 0
          ? gsap.utils.clamp(0, 1, (window.scrollY - trigger.start) / span)
          : 0;
        trigger.animation?.totalProgress(progress, true);
      };

      /* Order matters: enable() runs an internal refresh that can reset the
         timeline, so the timeline is synced to the scroll position AFTER
         re-enabling — otherwise the scrub replays from a stale progress. */
      const finishNavigation = () => {
        settle();
        trigger.enable(false);
        syncTimelineToScroll();
        ScrollTrigger.update();
        getRevealController()?.reveal(section);
        history.replaceState(null, '', `#${section}`);
        sectionElement.focus({ preventScroll: true });
      };

      const handleInterrupt = () => {
        settle();
        trigger.enable(false);
        syncTimelineToScroll();
        ScrollTrigger.update();
        getRevealController()?.restore();
      };

      navTween = gsap.timeline({
        defaults: { duration, ease: 'power2.inOut' },
        onComplete: finishNavigation,
        onInterrupt: handleInterrupt,
      });
      navTween.to(window, { scrollTo: { y: targetY, autoKill: false } }, 0);
      navTween.to(phone.position, {
        x: () => target().x,
        y: () => target().y,
        z: () => target().z,
      }, 0);
      navTween.to(phone.scale, {
        x: () => target().scale,
        y: () => target().scale,
        z: () => target().scale,
      }, 0);
      navTween.to(floatStrengthRef, {
        current: resolveFloatStrength(section, isReducedMotion),
      }, 0);

      if (isReducedMotion) {
        navTween.set(phone.rotation, { y: destRotation }, 0);
      } else {
        navTween.fromTo(
          phone.rotation,
          { y: resolveSpinStart(phone.rotation.y, destRotation, direction) },
          { y: destRotation },
          0,
        );
      }

      if (isMobile && shell) {
        const isEnteringContact = section === 'contact';

        navTween.to(shell, {
          autoAlpha: isEnteringContact ? 0 : 1,
          duration: duration * 0.45,
          ease: 'power1.inOut',
        }, isEnteringContact ? duration * 0.5 : 0);
      }

      if (incoming) {
        navTween.to(others, {
          autoAlpha: 0,
          yPercent: -3,
          filter: 'blur(5px)',
          pointerEvents: 'none',
          duration: duration * 0.35,
          ease: 'power1.in',
        }, 0);
        navTween.set(incoming, { yPercent: 3, filter: 'blur(6px)' }, duration * 0.4);
        navTween.to(incoming, {
          autoAlpha: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          pointerEvents: 'auto',
          duration: duration * 0.45,
          ease: 'power2.out',
        }, duration * 0.5);
      }

      if (surface && !isReducedMotion) {
        navTween.to(surface, { autoAlpha: 0, duration: duration * 0.12 }, duration * 0.25);
        navTween.to(surface, { autoAlpha: 1, duration: duration * 0.12 }, duration * 0.68);
      }

      INTERRUPT_EVENTS.forEach((eventName) =>
        window.addEventListener(eventName, handleUserScroll, { passive: true }));

      return true;
    };

    const unregisterNavigation = registerPhoneNavigationHandler(navigate);
    const media = gsap.matchMedia();
    let mountFrame = 0;
    const portalFrame = window.requestAnimationFrame(() => {
      mountFrame = window.requestAnimationFrame(() => {
        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () =>
          setupTimeline({ isMobile: false, isReducedMotion: false }));
        media.add('(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)', () =>
          setupTimeline({ isMobile: false, isReducedMotion: false }));
        media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () =>
          setupTimeline({ isMobile: true, isReducedMotion: false }));
        media.add('(prefers-reduced-motion: reduce)', () =>
          setupTimeline({ isMobile: getThreeState().size.width <= 767, isReducedMotion: true }));
        ScrollTrigger.refresh();
      });
    });

    const refresh = () => {
      /* A layout change mid-flight would corrupt the re-locked values. */
      navTween?.kill();
      ScrollTrigger.refresh();
    };
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(mainElement);
    window.addEventListener('orientationchange', refresh);
    window.addEventListener('load', refresh, { once: true });
    void document.fonts.ready.then(refresh, refresh);

    return () => {
      unregisterNavigation();
      navTween?.kill();
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', refresh);
      window.removeEventListener('load', refresh);
      window.cancelAnimationFrame(portalFrame);
      window.cancelAnimationFrame(mountFrame);
      media.revert();
    };
  }, [anchors, floatStrengthRef, getThreeState, mainRef, phoneRef, screenRefs, shellRef]);

  return null;
};

export default PhoneMotionController;
