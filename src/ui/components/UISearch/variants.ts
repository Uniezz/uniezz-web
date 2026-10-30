import { cva } from 'class-variance-authority';

export const searchStyles = cva(
  'min-h-11 rounded-full py-2 [&_input]:placeholder:text-secondary [&_svg]:size-4 [&_svg]:text-secondary',
);
