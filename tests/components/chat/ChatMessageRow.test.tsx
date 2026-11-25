import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatMessageRow } from '../../../src/components/features/chat/ChatMessageRow';

test('an incoming row keeps the avatar column when it has no avatar', () => {
  const row = (align: 'start' | 'end') =>
    renderToStaticMarkup(<ChatMessageRow align={align}>Hi</ChatMessageRow>);
  expect(row('start')).toContain('data-slot="chat-message-avatar"');
  expect(row('end')).not.toContain('data-slot="chat-message-avatar"');
  expect(row('start')).toContain('role="listitem"');
});

test('rows inside a group are closer together', () => {
  const row = (position: 'middle' | 'last') =>
    renderToStaticMarkup(<ChatMessageRow align="start" position={position} />);
  expect(row('middle')).toContain('pb-1');
  expect(row('last')).toContain('pb-4');
});
