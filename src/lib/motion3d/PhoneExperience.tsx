import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import type { Group } from 'three';

import PhoneModel from './PhoneModel';
import PhoneMotionController from './PhoneMotionController';
import type { PhoneExperienceProps } from './phone-motion.types';
import StudioLights from './StudioLights';

const PhoneExperience = ({
  mainRef,
  anchors,
  screenRefs,
  children,
}: PhoneExperienceProps) => {
  const phoneRef = useRef<Group>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const floatStrengthRef = useRef(1);

  return (
    <div ref={shellRef} className="canvas-shell">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 11], fov: 34, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        shadows={false}
        /* R3F inlines `pointer-events: auto` on its viewport-covering wrapper,
           which would swallow clicks and text selection on the page below.
           The phone screen re-enables its own pointer events inside. */
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <StudioLights />
          <PhoneModel ref={phoneRef} floatStrengthRef={floatStrengthRef}>
            {children}
          </PhoneModel>
          <PhoneMotionController
            mainRef={mainRef}
            phoneRef={phoneRef}
            anchors={anchors}
            screenRefs={screenRefs}
            shellRef={shellRef}
            floatStrengthRef={floatStrengthRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoneExperience;
