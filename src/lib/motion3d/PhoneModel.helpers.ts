import { Material, Mesh, MeshStandardMaterial, type Object3D } from 'three';

import { PHONE_DISPLAY_MATERIAL } from './PhoneModel.constants';

/* The GLB ships with a lit wallpaper on the display panel; the portfolio
   projects its own DOM screen on top, so the panel is switched off and reads
   as the black bezel around the projected content. Every other material keeps
   its authored look — the silver body relies on the studio environment. */
const stylePhoneMaterial = (sourceMaterial: Material): Material => {
  const material = sourceMaterial.clone();

  if (!(material instanceof MeshStandardMaterial)) {
    return material;
  }

  if (material.name === PHONE_DISPLAY_MATERIAL) {
    material.map = null;
    material.emissiveMap = null;
    material.emissive.set('#000000');
    material.color.set('#050507');
    material.metalness = 0.1;
    material.roughness = 0.4;

    /* Kept dim so the black panel does not mirror the bright environment. */
    material.envMapIntensity = 0.12;
  }

  return material;
};

export const createStyledPhoneScene = (sourceScene: Object3D): Object3D => {
  const scene = sourceScene.clone(true);

  scene.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }

    object.castShadow = false;
    object.receiveShadow = false;
    object.material = Array.isArray(object.material)
      ? object.material.map(stylePhoneMaterial)
      : stylePhoneMaterial(object.material);
  });

  return scene;
};
