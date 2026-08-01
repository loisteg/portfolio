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

  return (
    <div className="canvas-shell">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 11], fov: 34, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        shadows={false}
      >
        <Suspense fallback={null}>
          <StudioLights />
          <PhoneModel ref={phoneRef}>{children}</PhoneModel>
          <PhoneMotionController
            mainRef={mainRef}
            phoneRef={phoneRef}
            anchors={anchors}
            screenRefs={screenRefs}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoneExperience;
