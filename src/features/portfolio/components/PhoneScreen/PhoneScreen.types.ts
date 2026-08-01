import type { RefObject } from 'react';

import type { PhoneScreenRefs } from '../../../../lib/motion3d/phone-motion.types';

export type PhoneScreenProps = {
  screenRefs: PhoneScreenRefs;
};

export type PhoneLayerProps = {
  layerRef: RefObject<HTMLDivElement | null>;
};
