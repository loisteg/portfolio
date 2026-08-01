import { SECTION_ORDER } from './phone-motion.constants';
import type { SectionKey } from './phone-motion.types';

type NavigateHandler = (section: SectionKey) => boolean;

/* Lets the fly-to navigation hide section copy while flying over intermediate
   screens and replay the destination's entrance on arrival. */
export type RevealController = {
  conceal: () => void;
  reveal: (section: SectionKey) => void;
  restore: () => void;
};

/* NOTE: module-level registry so DOM components can request phone-aware
   navigation without importing GSAP or three.js. When no handler is mounted
   (e.g. WebGL unsupported) callers fall back to native anchor behaviour. */
let activeHandler: NavigateHandler | null = null;
let activeRevealController: RevealController | null = null;

type SectionNavigationListener = (section: SectionKey) => void;

const sectionNavigationListeners = new Set<SectionNavigationListener>();

/* Fired the moment a phone-aware fly-to navigation starts, before the page
   scroll moves — feature UI (e.g. the expanded project view with its page
   scroll lock) can reset itself so the flight runs against a normal page. */
export const registerSectionNavigationListener = (
  listener: SectionNavigationListener,
): (() => void) => {
  sectionNavigationListeners.add(listener);

  return () => {
    sectionNavigationListeners.delete(listener);
  };
};

export const notifySectionNavigation = (section: SectionKey): void => {
  sectionNavigationListeners.forEach((listener) => listener(section));
};

export const registerPhoneNavigationHandler = (handler: NavigateHandler): (() => void) => {
  activeHandler = handler;

  return () => {
    if (activeHandler === handler) {
      activeHandler = null;
    }
  };
};

export const registerRevealController = (controller: RevealController): (() => void) => {
  activeRevealController = controller;

  return () => {
    if (activeRevealController === controller) {
      activeRevealController = null;
    }
  };
};

export const getRevealController = (): RevealController | null => activeRevealController;

export const isSectionKey = (value: string): value is SectionKey =>
  (SECTION_ORDER as readonly string[]).includes(value);

export const requestPhoneNavigation = (section: SectionKey): boolean =>
  activeHandler ? activeHandler(section) : false;

type SectionAnchorClickEvent = {
  currentTarget: HTMLAnchorElement;
  preventDefault: () => void;
};

/* Shared click handler for in-page `#section` links: consumes the click when
   the 3D fly-to handles it, otherwise lets the browser perform anchor
   navigation (no-JS / no-WebGL fallback). */
export const handleSectionAnchorClick = (event: SectionAnchorClickEvent): void => {
  const hash = new URL(event.currentTarget.href, window.location.href).hash.slice(1);

  if (isSectionKey(hash) && requestPhoneNavigation(hash)) {
    event.preventDefault();
  }
};
