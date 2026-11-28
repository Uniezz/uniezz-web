import { cva } from 'class-variance-authority';

export const rowstyles = cva(
  'flex w-full flex-row items-center justify-between gap-3 border text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue',
  {
    variants: {
      appearance: {
        default: 'rounded-xl px-3.5 py-2.5 [@media(max-height:800px)]:py-1.5',
        // the mobile app's RowPickerItem appearance="inset": a constant 1px border, so selecting doesn't shift content
        inset: 'px-2.5 py-2.75',
      },
      selected: { true: '', false: '' },
    },
    compoundVariants: [
      { appearance: 'default', selected: true, className: 'border-blue/40 bg-blue-20' },
      {
        appearance: 'default',
        selected: false,
        className: 'border-white-10 bg-white-5 hover:bg-white-10',
      },
      { appearance: 'inset', selected: true, className: 'rounded-xl border-white-20 bg-white-5' },
      {
        appearance: 'inset',
        selected: false,
        // only the selected row is rounded, so the dividers on the others stay straight
        className: 'border-transparent border-b-white-5 last:border-b-transparent hover:bg-white-5',
      },
    ],
    defaultVariants: { appearance: 'default', selected: false },
  },
);

// the mobile app's RowPicker panel around inset rows
export const rowGroupStyles = cva(
  'flex flex-col gap-0.5 rounded-card border border-white/12 bg-white/3 p-1.5',
);

export const rowRadioStyles = cva(
  'flex size-5.5 shrink-0 items-center justify-center rounded-full border-[1.5px]',
  {
    variants: {
      selected: { true: 'border-sky', false: 'border-white-20' },
    },
  },
);
