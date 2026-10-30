import { expect, test } from 'bun:test';
import { createGroupConversation } from '../../src/utils/chat';
import type { Conversation } from '../../src/@types/chat';

const existing: Conversation[] = [
  {
    id: 'maths',
    name: 'Maths',
    preview: '',
    time: '',
    group: true,
    unread: 0,
    image: 0,
    messages: [],
  },
];

test('a new group uses its name and member preview without changing existing conversations', () => {
  const group = createGroupConversation(existing, 'Physics', ['Kateryna', 'Taras']);
  expect(group).toMatchObject({
    name: 'Physics',
    preview: 'Kateryna, Taras',
    group: true,
    unread: 0,
    messages: [],
  });
  expect(existing).toHaveLength(1);
  expect(existing[0].name).toBe('Maths');
});

test('duplicate group names retain the numbered suffix', () => {
  expect(createGroupConversation(existing, 'Maths', ['Kateryna', 'Taras']).name).toBe('Maths (2)');
});
