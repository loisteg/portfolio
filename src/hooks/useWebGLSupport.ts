import { useState } from 'react';

const detectWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');

    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext('webgl2'),
    );
  } catch {
    return false;
  }
};

const useWebGLSupport = () => {
  const [isSupported] = useState(detectWebGLSupport);

  return isSupported;
};

export default useWebGLSupport;
