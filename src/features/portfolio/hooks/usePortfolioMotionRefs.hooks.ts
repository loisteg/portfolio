import { useMemo, useRef } from 'react';

import type {
  ContentRefs,
  PhoneAnchors,
  PhoneScreenRefs,
} from '../../../lib/motion3d/phone-motion.types';
import type { PortfolioMotionRefs } from './usePortfolioMotionRefs.types';

export const usePortfolioMotionRefs = (): PortfolioMotionRefs => {
  const mainRef = useRef<HTMLElement>(null);
  const profileSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const profileAnchorRef = useRef<HTMLDivElement>(null);
  const aboutAnchorRef = useRef<HTMLDivElement>(null);
  const projectsAnchorRef = useRef<HTMLDivElement>(null);
  const contactAnchorRef = useRef<HTMLDivElement>(null);
  const phoneSurfaceRef = useRef<HTMLDivElement>(null);
  const profileScreenRef = useRef<HTMLDivElement>(null);
  const metricsScreenRef = useRef<HTMLDivElement>(null);
  const projectsScreenRef = useRef<HTMLDivElement>(null);
  const contactScreenRef = useRef<HTMLDivElement>(null);
  const profileContentRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const contactContentRef = useRef<HTMLDivElement>(null);

  const anchors = useMemo<PhoneAnchors>(() => ({
    profile: { anchorRef: profileAnchorRef, sectionRef: profileSectionRef },
    about: { anchorRef: aboutAnchorRef, sectionRef: aboutSectionRef },
    projects: { anchorRef: projectsAnchorRef, sectionRef: projectsSectionRef },
    contact: { anchorRef: contactAnchorRef, sectionRef: contactSectionRef },
  }), []);
  const screenRefs = useMemo<PhoneScreenRefs>(() => ({
    surface: phoneSurfaceRef,
    profile: profileScreenRef,
    metrics: metricsScreenRef,
    projects: projectsScreenRef,
    contact: contactScreenRef,
  }), []);
  const contentRefs = useMemo<ContentRefs>(() => ({
    profile: profileContentRef,
    about: aboutContentRef,
    projects: projectsContentRef,
    contact: contactContentRef,
  }), []);

  return {
    mainRef,
    profileSectionRef,
    aboutSectionRef,
    projectsSectionRef,
    contactSectionRef,
    profileAnchorRef,
    aboutAnchorRef,
    projectsAnchorRef,
    contactAnchorRef,
    anchors,
    screenRefs,
    contentRefs,
  };
};
