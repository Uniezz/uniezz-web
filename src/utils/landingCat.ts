import {
  Box3,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Texture,
} from 'three';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

export function prepareLandingCat(source: Group, atlas: Texture) {
  const scene = clone(source);
  const texture = atlas.clone();
  texture.flipY = false;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  const material = new MeshStandardMaterial({ map: texture, roughness: 0.85 });
  scene.traverse((object) => {
    if (object instanceof Mesh) object.material = material;
  });
  const bounds = new Box3().setFromObject(scene);
  const center = bounds.getCenter(new Vector3());
  const size = bounds.getSize(new Vector3());
  const scale = 2.4 / Math.max(size.x, size.y, size.z);
  scene.scale.multiplyScalar(scale);
  scene.position.sub(center.multiplyScalar(scale));
  return { scene, material, texture };
}
