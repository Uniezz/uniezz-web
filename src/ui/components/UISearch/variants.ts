import { cva } from 'class-variance-authority';

export const searchStyles = cva(
  'h-12 min-h-12 rounded-full py-0 [&_input]:placeholder:text-secondary [&_svg]:size-4 [&_svg]:text-secondary',
);
