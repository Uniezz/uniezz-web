import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatMarker } from '../../../src/components/features/chat/ChatMarker';

test('each marker variant has its own look', () => {
  expect(renderToStaticMarkup(<ChatMarker variant="chip">Today</ChatMarker>)).toContain(
    'rounded-full',
  );
  expect(renderToStaticMarkup(<ChatMarker variant="divider">New</ChatMarker>)).toContain(
    'before:bg-blue-40',
  );
  expect(renderToStaticMarkup(<ChatMarker variant="note">Joined</ChatMarker>)).toContain(
    'text-secondary',
  );
});
