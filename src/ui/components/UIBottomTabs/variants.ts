import { cva } from 'class-variance-authority';

export const bottomTabsStyles = cva(
  'fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-white-10 bg-ink/95 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden',
);

export const bottomTabStyles = cva(
  'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px]',
);

export const bottomTabLabelStyles = cva('max-w-full truncate');

export const bottomTabStateStyles = cva('', {
  variants: { active: { true: 'bg-white-10 text-white', false: 'text-muted' } },
});
