import { cva } from 'class-variance-authority';

export const cardStyles = cva('flex h-26 max-w-67.5 flex-col rounded-3xl p-4 glass', {
  variants: {
    type: {
      violet: 'bg-[radial-gradient(ellipse_at_top_right,#5B7CFF26,transparent_70%)]',
      green: 'bg-[radial-gradient(ellipse_at_top_right,#3DD68C26,transparent_70%)]',
      orange: 'bg-[radial-gradient(ellipse_at_top_right,#FFC24D26,transparent_70%)]',
    },
  },
  defaultVariants: {
    type: 'violet',
  },
});
