/**
 * Goes on a TableVirtuoso scroller. Below `lg` each row stacks into the mobile app's study row:
 * the first cell spans the width, the rest sit in two columns, rows split by dividers.
 * Only `tr[data-index]` is restyled, so Virtuoso's spacer rows keep their measured height.
 */
export const phoneTableClass = [
  'max-lg:[&_table]:block max-lg:[&_table]:min-w-0 max-lg:[&_tbody]:block',
  'max-lg:[&_tr[data-index]]:grid max-lg:[&_tr[data-index]]:grid-cols-[minmax(0,1fr)_auto] max-lg:[&_tr[data-index]]:items-center max-lg:[&_tr[data-index]]:gap-x-3 max-lg:[&_tr[data-index]]:gap-y-1.5 max-lg:[&_tr[data-index]]:p-3',
  // a divider between neighbouring rows; spacer rows are not data rows, so none above the first
  'max-lg:[&_tr[data-index]+tr[data-index]]:border-t max-lg:[&_tr[data-index]+tr[data-index]]:border-white-5',
  'max-lg:[&_td]:min-w-0 max-lg:[&_td]:border-0 max-lg:[&_td]:p-0 max-lg:[&_td]:text-micro max-lg:[&_td]:text-secondary',
  'max-lg:[&_td:first-child]:col-span-2 max-lg:[&_td:first-child]:text-body max-lg:[&_td:first-child]:text-white',
].join(' ');
