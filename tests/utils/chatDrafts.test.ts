import { expect, test } from 'bun:test';
import { getChatDraft, setChatDraft } from '../../src/utils/chatDrafts';

test('each chat keeps its own unsent text', () => {
  setChatDraft('c1', 'Hello');
  setChatDraft('c2', 'Other');
  expect(getChatDraft('c1')).toBe('Hello');
  expect(getChatDraft('c2')).toBe('Other');
  expect(getChatDraft('c3')).toBe('');
});

test('clearing the text, or leaving only spaces, removes the draft', () => {
  setChatDraft('c1', 'Hello');
  setChatDraft('c1', '  \n ');
  expect(getChatDraft('c1')).toBe('');
});

test('the text is kept exactly as typed', () => {
  setChatDraft('c1', ' two\nlines ');
  expect(getChatDraft('c1')).toBe(' two\nlines ');
});
