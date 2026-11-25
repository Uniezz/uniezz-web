import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  ChatMessageBubble,
  type ChatMessageBubbleProps,
} from '../../../src/components/features/chat/ChatMessageBubble';
import { createPendingMessage } from '../../../src/utils/chatMessages';

const pending = createPendingMessage(
  { conversationId: 'c1', body: 'Hello', clientId: 'k1' },
  {
    id: 'u1',
    firstName: 'Anna',
    lastName: 'Nowak',
    avatarUrl: '/anna.png',
    universityId: 'umcs',
  },
);
const render = (props: Partial<ChatMessageBubbleProps> = {}) =>
  renderToStaticMarkup(
    <ChatMessageBubble
      message={pending}
      outgoing={false}
      position="single"
      isGroup={false}
      onPreview={() => {}}
      {...props}
    />,
  );

test('only the last bubble of a group shows the avatar and the tail', () => {
  for (const position of ['single', 'last'] as const) {
    expect(render({ position })).toContain('/anna.png');
    expect(render({ position })).toContain('rounded-bl-[6px]');
  }
  for (const position of ['first', 'middle'] as const) {
    expect(render({ position })).not.toContain('/anna.png');
    expect(render({ position })).not.toContain('rounded-bl-[6px]');
  }
});

test('only own messages show the status', () => {
  expect(render({ outgoing: true })).toContain('lucide-clock');
  expect(render({ outgoing: true, message: { ...pending, status: undefined } })).toContain(
    'lucide-check',
  );
  expect(render()).not.toContain('lucide-c');
});

test('own messages have no avatar', () => {
  expect(render({ outgoing: true })).not.toContain('/anna.png');
});

test('a sent message has a menu, and a sending one does not', () => {
  const hasMenu = (props: Partial<ChatMessageBubbleProps>) =>
    render(props).includes('popover="auto"');
  expect(hasMenu({ message: { ...pending, status: undefined } })).toBe(true);
  expect(hasMenu({})).toBe(false);
});

test('a deleted message shows a marker without time, status, tail and menu', () => {
  const html = render({
    outgoing: true,
    message: { ...pending, status: undefined, body: null, deletedAt: '2026-11-25T10:00:00Z' },
  });
  expect(html).toContain('lucide-ban');
  expect(html).not.toContain('chat-bubble-meta');
  expect(html).not.toContain('rounded-br-[6px]');
  expect(html).not.toContain('popover="auto"');
});

test('a group chat shows the sender once, above the first incoming bubble', () => {
  const hasSender = (props: Partial<ChatMessageBubbleProps>) =>
    render(props).includes('chat-bubble-sender');
  expect(hasSender({ isGroup: true, position: 'first' })).toBe(true);
  expect(hasSender({ isGroup: true, position: 'single' })).toBe(true);
  expect(hasSender({ isGroup: true, position: 'middle' })).toBe(false);
  expect(hasSender({ isGroup: true, position: 'last' })).toBe(false);
  expect(hasSender({ isGroup: true, outgoing: true })).toBe(false);
  expect(hasSender({ isGroup: false })).toBe(false);
});
