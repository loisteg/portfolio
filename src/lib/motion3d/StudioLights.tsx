const StudioLights = () => (
  <>
    <ambientLight intensity={0.38} />
    <directionalLight position={[-5, 7, 8]} intensity={3.1} color="#e9eefc" />
    <directionalLight position={[6, 1, 4]} intensity={2.2} color="#8da6da" />
    <pointLight position={[-5, -4, 3]} intensity={24} distance={12} color="#8998bc" />
  </>
);

export default StudioLights;
