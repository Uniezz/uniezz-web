import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'caption',
        'regular',
        'xxl',
        'page-title',
        'panel-title',
        'card-title',
        'section',
        'body',
        'label',
        'detail',
        'micro',
        'profile-name',
        'countdown',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
