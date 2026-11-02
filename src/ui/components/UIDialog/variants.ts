import { cva } from 'class-variance-authority';

export const dialogOverlayStyles = cva('fixed inset-0 z-50 bg-black/70 backdrop-blur-md');

export const dialogTitleStyles = cva('pr-8 text-xl font-bold');

export const dialogDescriptionStyles = cva('mt-2 mb-6 text-body text-secondary');

export const dialogCloseStyles = cva('absolute top-4 right-4');

export const dialogStyles = cva(
  'fixed top-1/2 left-1/2 z-50 max-h-[90svh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-card border border-white-10 bg-surface p-6 text-white shadow-2xl',
);
