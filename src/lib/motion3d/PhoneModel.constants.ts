export const PHONE_MODEL_URL = '/models/phone/offbrand-android-smartphone.glb';
export const PHONE_ASSET_SCALE = 0.0163;
export const PHONE_WIDTH = 3.08;
export const PHONE_HEIGHT = 6.38;

/* The projected DOM is rasterized at PHONE_SCREEN_RESOLUTION times its design
   size (286x660) and scaled back down in world space, so the on-screen size is
   unchanged while text stays crisp. Keep in sync with --phone-screen-resolution
   in src/styles/base.css. */
export const PHONE_SCREEN_RESOLUTION = 2.4;
export const PHONE_SCREEN_WIDTH = 286 * PHONE_SCREEN_RESOLUTION;
export const PHONE_SCREEN_HEIGHT = 660 * PHONE_SCREEN_RESOLUTION;
export const PHONE_SCREEN_SCALE = 3.742 / PHONE_SCREEN_RESOLUTION;
export const PHONE_SCREEN_POSITION = [0.0044, 0.0591, 0.18] as const;
export const PHONE_ASSET_ROTATION = [Math.PI / 2, Math.PI / 2, 0] as const;

export const FRONT_SCREEN_MESH_NAME = 'Smartphone_Screen_Animada_0';

export const PHONE_MATERIALS = {
  body: 'Case_Verde',
  frame: 'BordeMetalico',
  border: 'ScreenBorder',
  button: 'Boton',
} as const;
