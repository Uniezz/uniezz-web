import { test } from 'node:test';
import assert from 'node:assert/strict';
import { landTransform } from './splash';

test('lands the logo on the backdrop U on a 390x844 phone', () => {
  // Backdrop U: 0.484 * 390 = 188.76 px wide, centered 163.8 px from the top.
  const [, y, scale] = landTransform(390, 844)
    .match(/translateY\((.+)px\) scale\((.+)\)/)!
    .map(Number);
  assert.ok(Math.abs(scale - 188.76 / (390 * (484 / 1024))) < 1e-9);
  // Logo U center: viewport center + offset * size * scale + y must equal 163.8.
  const center = 844 / 2 + y + scale * ((271 + 507 / 2 - 512) / 1024) * 390;
  assert.ok(Math.abs(center - 0.42 * 390) < 1e-9);
});
