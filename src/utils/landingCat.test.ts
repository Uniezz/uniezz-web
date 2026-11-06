import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { Box3, Mesh, SkinnedMesh, SRGBColorSpace, Texture, Vector3 } from 'three';
import { landingCatLoader, prepareLandingCat } from './landingCat';

test('prepares the supplied cat atlas, fits the model and preserves its rig', async () => {
  const bytes = readFileSync(new URL('../../public/landing/unicat/cat.glb', import.meta.url));
  assert.ok(bytes.byteLength < 1_500_000);
  const gltf = await landingCatLoader.parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  );
  const atlas = new Texture();
  const sourceBounds = new Box3().setFromObject(gltf.scene);
  const sourceSize = sourceBounds.getSize(new Vector3());
  const expectedScale = 2.4 / Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
  const { scene, material, texture, mixer } = prepareLandingCat(
    gltf.scene,
    atlas,
    gltf.animations[0],
  );
  assert.ok(Math.abs(scene.scale.x - expectedScale) < 0.001);
  assert.ok(Math.abs(new Box3().setFromObject(scene, true).getCenter(new Vector3()).x) < 0.001);
  assert.ok(
    Math.abs(scene.position.y + sourceBounds.getCenter(new Vector3()).y * expectedScale) < 0.001,
  );
  assert.equal(texture.flipY, false);
  assert.equal(texture.colorSpace, SRGBColorSpace);
  assert.equal(atlas.flipY, true);
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      assert.equal(object.material, material);
      assert.ok(object.geometry.getAttribute('uv'));
    }
  });
  const action = mixer.clipAction(gltf.animations[0]).reset().play();
  mixer.update(0);
  scene.updateMatrixWorld(true);
  scene.traverse((object) => {
    if (object instanceof SkinnedMesh) {
      object.computeBoundingBox();
    }
  });
  assert.ok(Math.abs(new Box3().setFromObject(scene).getCenter(new Vector3()).x) < 0.001);
  mixer.update(0.5);
  assert.equal(mixer.time, 0.5);
  mixer.update(gltf.animations[0].duration * 2);
  assert.equal(action.isRunning(), true);
  assert.deepEqual(gltf.scene.position.toArray(), [0, 0, 0]);
  material.dispose();
  texture.dispose();
});
