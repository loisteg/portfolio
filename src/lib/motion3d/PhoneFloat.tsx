import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

import type { PhoneFloatProps } from './phone-motion.types';

/* Weightless drift: incommensurate frequencies keep the motion organic, and
   every term is a pure sine, so all offsets are exactly 0 when the clock
   starts — the float always begins from the phone's current pose without a
   visible jump. Amplitudes are in local phone units/radians and stay small
   enough for the screen content to remain comfortably readable. */
const SWAY = { speed: 0.5, amplitude: 0.055 } as const;
const TIP = { speed: 0.34, amplitude: 0.02 } as const;
const ROLL = { speed: 0.43, amplitude: 0.026 } as const;
const BOB = { speed: 0.62, amplitude: 0.07 } as const;

/* Clamp the frame delta so returning from a background tab cannot teleport
   the float phase. */
const MAX_FRAME_STEP = 1 / 30;

const PhoneFloat = ({ strengthRef, children }: PhoneFloatProps) => {
  const groupRef = useRef<Group>(null);
  const elapsedRef = useRef(0);
  const isSettledRef = useRef(false);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const strength = strengthRef.current;

    if (!group) {
      return;
    }

    /* After the strength fades to 0 the pose lands exactly on neutral once,
       then the transform is left untouched so pinned sections never jitter. */
    if (strength <= 0 && isSettledRef.current) {
      return;
    }

    isSettledRef.current = strength <= 0;
    elapsedRef.current += Math.min(delta, MAX_FRAME_STEP);
    const time = elapsedRef.current;
    const effective = Math.max(strength, 0);

    group.rotation.y = Math.sin(time * SWAY.speed) * SWAY.amplitude * effective;
    group.rotation.x = Math.sin(time * TIP.speed) * TIP.amplitude * effective;
    group.rotation.z = Math.sin(time * ROLL.speed) * ROLL.amplitude * effective;
    group.position.y = Math.sin(time * BOB.speed) * BOB.amplitude * effective;
  });

  return <group ref={groupRef}>{children}</group>;
};

export default PhoneFloat;
