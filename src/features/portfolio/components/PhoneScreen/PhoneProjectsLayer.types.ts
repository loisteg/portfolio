import type { KeyboardEvent, MouseEvent, RefObject } from 'react';

import type { Project } from '../../portfolio.types';
import type { PhoneLayerProps } from './PhoneScreen.types';

export type PhoneProjectsLayerProps = PhoneLayerProps;

export type ProjectDetailProps = {
  project: Project;
  isOpen: boolean;
  backButtonRef: RefObject<HTMLButtonElement | null>;
  onBack: () => void;
};

export type StoreActionProps = {
  href: string;
  label: string;
  tabIndex: number;
};

export type ProjectOpenEvent = MouseEvent<HTMLButtonElement>;
export type ProjectKeyboardEvent = KeyboardEvent<HTMLDivElement>;
