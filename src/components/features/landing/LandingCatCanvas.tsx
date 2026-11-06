import { Canvas } from '@react-three/fiber';
import { LandingCatModel } from './LandingCatModel';

export function LandingCatCanvas({ isVisible }: { isVisible: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5], fov: 35 }}
      dpr={[1, 1.5]}
      frameloop={isVisible ? 'always' : 'demand'}
      resize={{ scroll: false, offsetSize: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <directionalLight position={[-3, 1, -2]} intensity={2} />
      <LandingCatModel />
    </Canvas>
  );
}
