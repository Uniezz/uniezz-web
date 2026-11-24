import { expect, test } from 'bun:test';
import { chatKeys } from '../../src/utils/chatKeys';

test('every chat key starts with the shared chat key, so one call can reach them all', () => {
  for (const key of [
    chatKeys.conversations(),
    chatKeys.conversation('c1'),
    chatKeys.messages('c1'),
  ]) {
    expect(key[0]).toBe(chatKeys.all[0]);
  }
});

test('keys differ per conversation and per kind of data', () => {
  expect(chatKeys.messages('c1')).not.toEqual(chatKeys.messages('c2'));
  expect(chatKeys.messages('c1')).not.toEqual(chatKeys.conversation('c1'));
  expect(chatKeys.conversations()).toEqual(['chat', 'conversations']);
});
