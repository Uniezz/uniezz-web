import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatReaction } from '../../../src/components/features/chat/ChatReaction';

test('a reaction is a toggle with a fixed analytics label', () => {
  const html = renderToStaticMarkup(
    <ChatReaction emoji="👍" count={2} selected aria-label="Thumbs up, 2" />,
  );
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('aria-label="Thumbs up, 2"');
  expect(html).toContain('data-ph-capture-attribute-label="Toggle message reaction"');
});
