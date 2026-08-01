import { Material, Mesh, MeshStandardMaterial, type Object3D } from 'three';

import { FRONT_SCREEN_MESH_NAME, PHONE_MATERIALS } from './PhoneModel.constants';

const stylePhoneMaterial = (sourceMaterial: Material): Material => {
  const material = sourceMaterial.clone();

  if (!(material instanceof MeshStandardMaterial)) {
    return material;
  }

  if (material.name === PHONE_MATERIALS.body) {
    material.color.set('#08090b');
    material.metalness = 0.42;
    material.roughness = 0.24;
  }

  if (material.name === PHONE_MATERIALS.frame) {
    material.color.set('#24272c');
    material.metalness = 0.92;
    material.roughness = 0.16;
  }

  if (material.name === PHONE_MATERIALS.border) {
    material.color.set('#050608');
    material.metalness = 0.28;
    material.roughness = 0.14;
  }

  if (material.name === PHONE_MATERIALS.button) {
    material.color.set('#17191d');
    material.metalness = 0.84;
    material.roughness = 0.2;
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
    object.visible = object.name !== FRONT_SCREEN_MESH_NAME;
    object.material = Array.isArray(object.material)
      ? object.material.map(stylePhoneMaterial)
      : stylePhoneMaterial(object.material);
  });

  return scene;
};
