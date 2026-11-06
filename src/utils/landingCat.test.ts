import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { AnimationMixer, Box3, Mesh, SRGBColorSpace, Texture, Vector3 } from 'three';
import { landingCatLoader, prepareLandingCat } from './landingCat';

test('prepares the supplied cat atlas, fits the model and preserves its rig', async () => {
  const bytes = readFileSync(new URL('../../public/landing/unicat/cat.glb', import.meta.url));
  assert.ok(bytes.byteLength < 1_500_000);
  const gltf = await landingCatLoader.parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  );
  const atlas = new Texture();
  const { scene, material, texture } = prepareLandingCat(gltf.scene, atlas);
  const bounds = new Box3().setFromObject(scene);
  const size = bounds.getSize(new Vector3());
  assert.ok(Math.abs(Math.max(size.x, size.y, size.z) - 2.4) < 0.001);
  assert.ok(bounds.getCenter(new Vector3()).length() < 0.001);
  assert.equal(texture.flipY, false);
  assert.equal(texture.colorSpace, SRGBColorSpace);
  assert.equal(atlas.flipY, true);
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      assert.equal(object.material, material);
      assert.ok(object.geometry.getAttribute('uv'));
    }
  });
  const mixer = new AnimationMixer(scene);
  const action = mixer.clipAction(gltf.animations[0]).reset().play();
  mixer.update(0.5);
  assert.equal(mixer.time, 0.5);
  mixer.update(gltf.animations[0].duration * 2);
  assert.equal(action.isRunning(), true);
  assert.deepEqual(gltf.scene.position.toArray(), [0, 0, 0]);
  material.dispose();
  texture.dispose();
});
