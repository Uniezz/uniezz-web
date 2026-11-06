import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { AnimationMixer, TextureLoader } from 'three';
import { landingCatLoader, prepareLandingCat } from '@/utils/landingCat';

useLoader.preload(landingCatLoader, '/landing/unicat/cat.glb');
useLoader.preload(TextureLoader, '/landing/unicat/IMG_1374.PNG');

export function LandingCatModel() {
  const { scene: source, animations } = useLoader(landingCatLoader, '/landing/unicat/cat.glb');
  const atlas = useLoader(TextureLoader, '/landing/unicat/IMG_1374.PNG');
  const { scene, material, texture } = useMemo(
    () => prepareLandingCat(source, atlas),
    [source, atlas],
  );
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);

  useEffect(() => {
    const clip = animations[0];
    if (clip) {
      mixer.clipAction(clip).reset().setEffectiveTimeScale(0.5).play();
    }
    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      material.dispose();
      texture.dispose();
    };
  }, [animations, material, mixer, scene, texture]);

  useFrame((_, delta) => {
    mixer.update(Math.min(delta, 0.1));
  });

  return <primitive object={scene} dispose={null} />;
}
