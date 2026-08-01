import type { RefObject } from 'react';

import type {
  ContentRefs,
  ElementRef,
  PhoneAnchors,
  PhoneScreenRefs,
} from '../../../lib/motion3d/phone-motion.types';

export type PortfolioMotionRefs = {
  mainRef: RefObject<HTMLElement | null>;
  profileSectionRef: ElementRef<HTMLElement>;
  aboutSectionRef: ElementRef<HTMLElement>;
  projectsSectionRef: ElementRef<HTMLElement>;
  contactSectionRef: ElementRef<HTMLElement>;
  profileAnchorRef: ElementRef<HTMLDivElement>;
  aboutAnchorRef: ElementRef<HTMLDivElement>;
  projectsAnchorRef: ElementRef<HTMLDivElement>;
  contactAnchorRef: ElementRef<HTMLDivElement>;
  anchors: PhoneAnchors;
  screenRefs: PhoneScreenRefs;
  contentRefs: ContentRefs;
};
