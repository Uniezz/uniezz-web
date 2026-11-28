import { expect, test } from 'bun:test';
import { appStoreFor } from '../../src/utils/stores';

const id = '0b6f5b8e-2f0a-4c55-9a39-5d3c1e7f2a10';

test('a shared page on a phone goes to its store; other pages and desktops stay', () => {
  expect(appStoreFor('Mozilla iPhone', `/feed/post/${id}`)).toContain('apps.apple.com');
  expect(appStoreFor('Mozilla Android', `/connections/students/${id}`)).toContain(
    'play.google.com',
  );
  expect(appStoreFor('Mozilla Android', `/exams/courses/${id}`)).toContain('play.google.com');
  expect(appStoreFor('Mozilla Macintosh', `/feed/post/${id}`)).toBeUndefined();
  expect(appStoreFor('Mozilla iPhone', `/feed/post/${id}/edit`)).toBeUndefined();
  expect(appStoreFor('Mozilla iPhone', '/feed')).toBeUndefined();
});
