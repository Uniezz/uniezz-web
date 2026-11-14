import { cva } from 'class-variance-authority';

export const tagsStyles = cva('scrollbar-hidden flex gap-2 overflow-x-auto');

export const tagStyles = cva('shrink-0 whitespace-nowrap', {
  variants: {
    variant: { tag: 'app-tag', hashtag: 'app-hashtag' },
    highlighted: { true: 'text-sky', false: '' },
  },
  defaultVariants: { variant: 'tag', highlighted: false },
});

export const tagsCounterStyles = cva('shrink-0 text-secondary before:content-none', {
  variants: { variant: { tag: 'app-tag', hashtag: 'app-hashtag' } },
  defaultVariants: { variant: 'tag' },
});
