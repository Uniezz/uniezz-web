import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { AnimationMixer, TextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { prepareLandingCat } from '@/utils/landingCat';

export function LandingCatModel() {
  const { scene: source, animations } = useLoader(GLTFLoader, '/landing/unicat/cat.glb');
  const atlas = useLoader(TextureLoader, '/landing/unicat/IMG_1374.PNG');
  const { scene, material, texture } = useMemo(
    () => prepareLandingCat(source, atlas),
    [source, atlas],
  );
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const clip = animations[0];
    if (clip) {
      mixer.clipAction(clip).reset().setEffectiveTimeScale(0.5).play();
      invalidate();
    }
    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      material.dispose();
      texture.dispose();
    };
  }, [animations, invalidate, material, mixer, scene, texture]);

  useFrame((_, delta) => {
    mixer.update(Math.min(delta, 0.1));
    if (animations[0] && mixer.existingAction(animations[0])?.isRunning()) invalidate();
  });

  return <primitive object={scene} dispose={null} />;
}
