import { expect, test } from 'bun:test';

const files = [
  'variants.ts',
  'ChatAttachmentCard.tsx',
  'ChatBubble.tsx',
  'ChatJumpToLatest.tsx',
  'ChatMarker.tsx',
  'ChatMessageBubble.tsx',
  'ChatMessageRow.tsx',
  'ChatReaction.tsx',
];

const rawColor = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|color-mix)\(/i;
const paletteColor =
  /\b(?:bg|text|border|ring|outline)-(?:slate|gray|zinc|neutral|red|orange|yellow|green|blue|indigo|purple|pink)-\d{2,3}\b/g;
const shadcnColor =
  /\b(?:bg|text|border|ring)-(?:background|foreground|card|card-foreground|muted-foreground|primary-foreground|secondary-foreground|destructive|border|input|ring)\b/;
const ourBlues = ['bg-blue-20', 'bg-blue-40', 'border-blue-20', 'border-blue-40'];

test.each(files)('%s uses our color tokens only', async (file) => {
  const source = await Bun.file(
    new URL(`../../../src/components/features/chat/${file}`, import.meta.url),
  ).text();
  expect(source).not.toMatch(rawColor);
  expect(source).not.toMatch(shadcnColor);
  expect((source.match(paletteColor) ?? []).filter((name) => !ourBlues.includes(name))).toEqual([]);
});
