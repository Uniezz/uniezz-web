import { cva } from 'class-variance-authority';

// floats over the page like the mobile app's tab bar: 16 from the sides, 8 above the home indicator
export const bottomTabsStyles = cva(
  'fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+8px)] z-40 lg:hidden [:root:has([data-hide-bottom-tabs])_&]:hidden',
);

export const bottomTabsBarStyles = cva(
  'flex items-center gap-1 rounded-[26px] p-1.5 shadow-[0_8px_24px_#00000040] glass',
);

export const bottomTabStyles = cva(
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[20px] px-1 py-1.5 text-[11px] leading-[13px] outline-none focus-visible:ring-2 focus-visible:ring-blue',
);

export const bottomTabLabelStyles = cva('max-w-full truncate');

// the unread count over the icon's top right corner (mobile UIBadge)
export const bottomTabBadgeStyles = cva(
  'absolute -top-1.5 left-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue px-1 text-micro font-bold text-white',
);

export const bottomTabStateStyles = cva('', {
  variants: {
    active: {
      true: 'bg-white-10 font-semibold text-white',
      false: 'font-medium text-secondary [&_svg]:text-white-60',
    },
  },
});
