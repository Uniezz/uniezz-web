import { cva } from 'class-variance-authority';

// on a phone, the mobile app's sheet backdrop: black 50%, no blur
export const dialogOverlayStyles = cva(
  'fixed inset-0 z-50 bg-black/40 backdrop-blur-md max-lg:bg-black-50 max-lg:backdrop-blur-none',
);

export const dialogTitleStyles = cva('pr-8 text-xl font-bold');

export const dialogDescriptionStyles = cva('mt-2 mb-6 text-body text-secondary');

export const dialogCloseStyles = cva('absolute top-4 right-4');

export const dialogStyles = cva('fixed z-50 border border-white-10 p-6 text-white shadow-2xl', {
  variants: {
    placement: {
      center:
        'top-1/2 left-1/2 max-h-[90svh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-card bg-surface',
      right: 'inset-y-0 right-0 flex h-dvh w-full max-w-2xl flex-col overflow-hidden bg-surface/85',
      // a bottom sheet on a phone, as the mobile app's UIBottomSheet; centered from lg up
      bottom:
        'max-h-[90svh] overflow-auto overscroll-contain bg-surface max-lg:inset-x-0 max-lg:bottom-0 max-lg:rounded-t-feature max-lg:border-x-0 max-lg:border-b-0 max-lg:bg-surface/85 max-lg:px-4 max-lg:pt-8 max-lg:pb-[max(24px,env(safe-area-inset-bottom))] max-lg:backdrop-blur-2xl max-lg:motion-safe:animate-sheet-up lg:top-1/2 lg:left-1/2 lg:w-[calc(100%-2rem)] lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-card',
    },
  },
  defaultVariants: { placement: 'center' },
});

export const dialogHandleStyles = cva(
  'absolute top-2.5 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-white-40 lg:hidden',
);

// the strip over the grabber that drags the sheet down
export const dialogGrabStyles = cva('absolute inset-x-0 top-0 h-7 touch-none lg:hidden');

// the mobile app's sheet title: 21 semibold
export const dialogSheetTitleStyles = cva(
  'max-lg:text-[21px] max-lg:font-semibold max-lg:tracking-[-0.6px]',
);

// `placement="right"` with `sheet`: the bottom sheet's look on a phone, the side panel from lg up
export const dialogRightSheetStyles = cva(
  'max-lg:inset-x-0 max-lg:top-auto max-lg:bottom-0 max-lg:h-auto max-lg:max-h-[90svh] max-lg:max-w-none max-lg:rounded-t-feature max-lg:border-x-0 max-lg:border-b-0 max-lg:bg-surface/85 max-lg:px-4 max-lg:pt-8 max-lg:pb-[max(24px,env(safe-area-inset-bottom))] max-lg:backdrop-blur-2xl max-lg:motion-safe:animate-sheet-up',
);
