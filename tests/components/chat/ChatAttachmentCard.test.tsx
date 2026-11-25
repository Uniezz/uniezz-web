import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChatAttachmentCard } from '../../../src/components/features/chat/ChatAttachmentCard';

const file = { name: 'photo.png', size: 1024 };

test('upload progress is announced, also when the percent is unknown', () => {
  const card = (progress?: number) =>
    renderToStaticMarkup(
      <ChatAttachmentCard
        {...file}
        state="uploading"
        progress={progress}
        progressLabel="Uploading"
      />,
    );
  expect(card(0)).toContain('aria-valuenow="0"');
  expect(card()).toContain('role="progressbar"');
  expect(card()).not.toContain('aria-valuenow');
});

test('an error shows text, and a finished card has no progress bar', () => {
  expect(
    renderToStaticMarkup(<ChatAttachmentCard {...file} state="error" error="Upload failed" />),
  ).toContain('Upload failed');
  expect(renderToStaticMarkup(<ChatAttachmentCard {...file} state="done" />)).not.toContain(
    'progressbar',
  );
});
