import type { ReactNode, RefObject } from 'react';
import type { Group } from 'three';

export type ElementRef<T extends HTMLElement = HTMLElement> = RefObject<T | null>;

export type PhoneAnchor = {
  anchorRef: ElementRef<HTMLDivElement>;
  sectionRef: ElementRef<HTMLElement>;
};

export type PhoneAnchors = {
  profile: PhoneAnchor;
  about: PhoneAnchor;
  projects: PhoneAnchor;
  contact: PhoneAnchor;
};

export type SectionKey = keyof PhoneAnchors;

export type PhoneScreenRefs = {
  surface: ElementRef<HTMLDivElement>;
  profile: ElementRef<HTMLDivElement>;
  metrics: ElementRef<HTMLDivElement>;
  projects: ElementRef<HTMLDivElement>;
  contact: ElementRef<HTMLDivElement>;
};

export type ContentRefs = {
  profile: ElementRef<HTMLDivElement>;
  about: ElementRef<HTMLDivElement>;
  projects: ElementRef<HTMLDivElement>;
  contact: ElementRef<HTMLDivElement>;
};

export type PhoneExperienceProps = {
  mainRef: ElementRef<HTMLElement>;
  anchors: PhoneAnchors;
  screenRefs: PhoneScreenRefs;
  children: ReactNode;
};

export type PhoneMotionControllerProps = Omit<PhoneExperienceProps, 'children'> & {
  phoneRef: RefObject<Group | null>;
};

export type MotionTarget = {
  x: number;
  y: number;
  z: number;
  scale: number;
};

export type MotionRotation = readonly [number, number, number];

export type MotionSetup = {
  isMobile: boolean;
  isReducedMotion: boolean;
};
