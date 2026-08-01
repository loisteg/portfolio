import { Html, useGLTF } from '@react-three/drei';
import { forwardRef, useMemo } from 'react';
import type { Group } from 'three';

import {
  PHONE_ASSET_ROTATION,
  PHONE_ASSET_SCALE,
  PHONE_MODEL_URL,
  PHONE_SCREEN_HEIGHT,
  PHONE_SCREEN_POSITION,
  PHONE_SCREEN_SCALE,
  PHONE_SCREEN_WIDTH,
} from './PhoneModel.constants';
import { createStyledPhoneScene } from './PhoneModel.helpers';
import type { PhoneModelProps } from './PhoneModel.types';

const PhoneModel = forwardRef<Group, PhoneModelProps>(({ children }, ref) => {
  const { scene } = useGLTF(PHONE_MODEL_URL);
  const phoneScene = useMemo(() => createStyledPhoneScene(scene), [scene]);

  return (
    <group ref={ref} name="persistent-phone">
      <primitive
        object={phoneScene}
        rotation={PHONE_ASSET_ROTATION}
        scale={PHONE_ASSET_SCALE}
      />
      <Html
        transform
        position={PHONE_SCREEN_POSITION}
        scale={PHONE_SCREEN_SCALE}
        distanceFactor={1}
        zIndexRange={[1000, 1000]}
        style={{ width: `${PHONE_SCREEN_WIDTH}px`, height: `${PHONE_SCREEN_HEIGHT}px` }}
      >
        {children}
      </Html>
    </group>
  );
});

PhoneModel.displayName = 'PhoneModel';

useGLTF.preload(PHONE_MODEL_URL);

export default PhoneModel;
