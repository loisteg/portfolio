import { Environment } from '@react-three/drei';

/* A real studio HDRI (bundled locally, CC0 — see public/env/ATTRIBUTION.md)
   gives the metallic body the same smooth, rich reflections as Sketchfab's
   viewer; flat rectangular lightformers band visibly on large glossy
   surfaces. Analytic lights only add key/fill accents on dielectric parts. */
const StudioLights = () => (
  <>
    <ambientLight intensity={0.15} />
    <directionalLight position={[-5, 7, 8]} intensity={1} color="#fff4e4" />
    <directionalLight position={[6, 1, 4]} intensity={0.6} color="#dfe6f2" />
    <Environment files="/env/studio_small_08_1k.hdr" environmentIntensity={0.25} />
  </>
);

export default StudioLights;
