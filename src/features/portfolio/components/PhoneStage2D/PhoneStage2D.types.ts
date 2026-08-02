import type { RefObject } from 'react';

import type { PhoneAnchors, PhoneScreenRefs } from '../../../../lib/motion3d/phone-motion.types';

export type PhoneStage2DProps = {
  anchors: PhoneAnchors;
  screenRefs: PhoneScreenRefs;
};

export type Phone2DMotionArgs = {
  stageRef: RefObject<HTMLDivElement | null>;
  phoneRef: RefObject<HTMLDivElement | null>;
  anchors: PhoneAnchors;
  screenRefs: PhoneScreenRefs;
};
