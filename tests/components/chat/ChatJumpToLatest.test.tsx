import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatJumpToLatest } from '../../../src/components/features/chat/ChatJumpToLatest';

test('the unread count shows only above zero', () => {
  const button = (unreadCount?: number) =>
    renderToStaticMarkup(<ChatJumpToLatest unreadCount={unreadCount} aria-label="Latest" />);
  expect(button(3)).toContain('>3</span>');
  expect(button(0)).not.toContain('<span');
  expect(button()).toContain('data-ph-capture-attribute-label="Jump to latest message"');
});
