import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatBubble } from '../../../src/components/features/chat/ChatBubble';

test('the tail is on the side of the sender', () => {
  expect(renderToStaticMarkup(<ChatBubble variant="in" tail />)).toContain('rounded-bl-[6px]');
  expect(renderToStaticMarkup(<ChatBubble variant="out" tail />)).toContain('rounded-br-[6px]');
  expect(renderToStaticMarkup(<ChatBubble variant="out" />)).not.toContain('[6px]');
});

test('the sender and time render only when given', () => {
  expect(renderToStaticMarkup(<ChatBubble variant="in">Hi</ChatBubble>)).not.toContain(
    'chat-bubble-',
  );
  const html = renderToStaticMarkup(
    <ChatBubble variant="in" sender="Anna" meta="14:05">
      Hi
    </ChatBubble>,
  );
  expect(html).toContain('Anna');
  expect(html).toContain('14:05');
});
