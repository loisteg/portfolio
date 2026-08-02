import { useRef } from 'react';

import PhoneScreen from '../PhoneScreen/PhoneScreen';
import { usePhone2DNavigation, usePhone2DStageMotion } from './PhoneStage2D.hooks';
import type { PhoneStage2DProps } from './PhoneStage2D.types';
import './phone-stage-2d.css';

const PhoneStage2D = ({ anchors, screenRefs }: PhoneStage2DProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  usePhone2DStageMotion({ stageRef, phoneRef, anchors, screenRefs });
  usePhone2DNavigation(anchors);

  return (
    <div ref={stageRef} className="phone-2d-stage">
      <div ref={phoneRef} className="phone-2d">
        <PhoneScreen screenRefs={screenRefs} />
      </div>
    </div>
  );
};

export default PhoneStage2D;
