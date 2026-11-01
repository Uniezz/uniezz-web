import { expect, test } from 'bun:test';
import { hasDuplicateImages } from '../../src/utils/image';

test('detects duplicate image data across existing and newly selected files', () => {
  const first = 'data:image/png;base64,YWJj';
  const sameBytesDifferentType = 'data:image/jpeg;base64,YWJj';
  const second = 'data:image/png;base64,ZGVm';
  expect(hasDuplicateImages([first], [sameBytesDifferentType])).toBe(true);
  expect(hasDuplicateImages([], [first, sameBytesDifferentType])).toBe(true);
  expect(hasDuplicateImages([first], [second])).toBe(false);
  expect(hasDuplicateImages([], [first, second])).toBe(false);
});
