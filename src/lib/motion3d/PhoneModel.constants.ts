export const PHONE_MODEL_URL = '/models/phone/iphone-17-pro-max-silver.glb';

/* The GLB stands upright along +Y (0.163 units tall, screen facing -Z), so it
   is mirrored to face the camera, scaled to the scene's phone height, and
   shifted down by half of that height to center it on the group origin. */
export const PHONE_ASSET_SCALE = 39.14;
export const PHONE_ASSET_ROTATION = [0, Math.PI, 0] as const;
export const PHONE_ASSET_POSITION = [0, -3.19, 0] as const;
export const PHONE_WIDTH = 3.09;
export const PHONE_HEIGHT = 6.38;

/* The projected DOM is rasterized at PHONE_SCREEN_RESOLUTION times its design
   size (303x660) and scaled back down in world space, so the on-screen size is
   unchanged while text stays crisp. Keep in sync with --phone-screen-resolution
   in src/styles/base.css.

   The model's display panel spans its whole front face; 303x660 at scale 3.681
   leaves a slim uniform ring of that (switched-off) panel visible around the
   DOM as the bezel. */
export const PHONE_SCREEN_RESOLUTION = 2.4;
export const PHONE_SCREEN_WIDTH = 303 * PHONE_SCREEN_RESOLUTION;
export const PHONE_SCREEN_HEIGHT = 660 * PHONE_SCREEN_RESOLUTION;
export const PHONE_SCREEN_SCALE = 3.681 / PHONE_SCREEN_RESOLUTION;
export const PHONE_SCREEN_POSITION = [0, 0.02, 0.21] as const;

/* Material of the model's lit wallpaper panel; disabled at runtime so the
   projected DOM screen replaces it and the dark panel doubles as the bezel. */
export const PHONE_DISPLAY_MATERIAL = '17ProMax_Screen';
