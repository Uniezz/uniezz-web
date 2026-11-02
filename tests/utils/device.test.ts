import { expect, test } from 'bun:test';
import { isMobileDevice, shouldBlockMobile } from '../../src/utils/device';

test('only narrow mobile devices are blocked, including iPads in desktop mode', () => {
  expect(isMobileDevice('Mozilla iPhone Mobile', 'iPhone', 5)).toBe(true);
  expect(isMobileDevice('Mozilla Android', 'Linux', 5)).toBe(true);
  expect(isMobileDevice('Mozilla Macintosh', 'MacIntel', 5)).toBe(true);
  expect(isMobileDevice('Mozilla Macintosh', 'MacIntel', 0)).toBe(false);
  expect(shouldBlockMobile(true, true)).toBe(true);
  expect(shouldBlockMobile(false, true)).toBe(false);
  expect(shouldBlockMobile(true, false)).toBe(false);
});
