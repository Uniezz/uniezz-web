import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatOfflineBanner } from '../../../src/components/features/chat/ChatOfflineBanner';

test('the banner text is hidden online, but its status element stays', () => {
  expect(renderToStaticMarkup(<ChatOfflineBanner />)).toBe('<div role="status"></div>');
});
