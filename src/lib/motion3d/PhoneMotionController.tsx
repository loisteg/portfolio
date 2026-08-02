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
  isWheelNavigationLocked,
  notifySectionNavigation,
  registerPhoneNavigationHandler,
} from './phone-navigation';
import type {
  MotionSetup,
  PhoneMotionControllerProps,
  SectionKey,
} from './phone-motion.types';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Wheel input is hijacked into fly-to navigation below, so only touch
   gestures can interrupt a flight and hand control back to native scroll.
   Must be touchmove, not touchstart: a nav-bar tap (or any incidental finger
   contact during the ~1.15s flight) fires touchstart and would abort the
   navigation, which is why nav worked with a mouse but not on a real phone.
   Only an actual scroll gesture (touchmove) should hand control back. */
const INTERRUPT_EVENTS = ['touchmove'] as const;

/* Wheel events closer together than this belong to the same physical gesture
   (trackpad momentum tail); only a fresh gesture starts a new flight. */
const WHEEL_GESTURE_GAP_MS = 250;

/* A momentum tail decays monotonically, so a delta spiking to at least this
   magnitude (and well above the previous event) is a fresh push even when it
   arrives inside the gap window — without this, repeated scroll attempts keep
   extending the window and the page feels dead. */
const WHEEL_RESTART_MIN_DELTA = 24;

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
        current: resolveFloatStrength(section, isReducedMotion, isMobile),
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

    /* Native scroll-snap rushes between sections much faster than the nav-bar
       flight. Routing every wheel gesture through the same fly-to keeps both
       paths at NAV_DURATION pacing: one gesture moves one section, events
       during a flight or in a gesture's momentum tail are swallowed. */
    const resolveNearestSectionIndex = (): number => {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      SECTION_ORDER.forEach((sectionKey, index) => {
        const element = anchors[sectionKey].sectionRef.current;

        if (!element) {
          return;
        }

        const distance = Math.abs(element.getBoundingClientRect().top);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    let lastWheelTime = Number.NEGATIVE_INFINITY;
    let lastWheelDelta = 0;

    const handleWheel = (event: WheelEvent) => {
      /* Already consumed by the phone's inner scroll bridge, or a pinch-zoom. */
      if (event.defaultPrevented || event.ctrlKey) {
        return;
      }

      if (!activeMotion || activeMotion.setup.isReducedMotion) {
        return;
      }

      /* Dominantly horizontal trackpad swipes are not section navigation. */
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      const gap = event.timeStamp - lastWheelTime;
      const magnitude = Math.abs(event.deltaY);
      const isMomentumSpike = magnitude >= WHEEL_RESTART_MIN_DELTA
        && magnitude > Math.abs(lastWheelDelta) * 2;
      const isFreshGesture = gap > WHEEL_GESTURE_GAP_MS || isMomentumSpike;

      lastWheelTime = event.timeStamp;
      lastWheelDelta = event.deltaY;

      const currentIndex = resolveNearestSectionIndex();

      /* On the projects screen the phone owns its scrollable content; events
         bubbling out of it (a scroller hit its end) must not fly the page. */
      const isOverPhone = event.target instanceof Element
        && event.target.closest('.phone-screen-frame') !== null;
      const isPhoneContentGesture = isOverPhone
        && SECTION_ORDER[currentIndex] === 'projects';

      /* The wheel-navigation lock (expanded project detail) swallows the
         gesture wherever the cursor is — including over the 3D bezel, which
         lives outside the DOM screen. Bookkeeping above still ran, so a
         momentum tail cannot fly the page the instant the lock releases. */
      if (navTween || !isFreshGesture || isPhoneContentGesture || isWheelNavigationLocked()) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const targetSection = SECTION_ORDER[currentIndex + direction];

      if (!targetSection) {
        return;
      }

      event.preventDefault();
      navigate(targetSection);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

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
      window.removeEventListener('wheel', handleWheel);
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
