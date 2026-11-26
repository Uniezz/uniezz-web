/** Like Intl.DateTimeFormat, but with no dot after a short month ("лист." becomes "лист"). */
export function dateFormatter(locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  const formatter = new Intl.DateTimeFormat(locale, options);
  return {
    format: (date: Date) =>
      formatter
        .formatToParts(date)
        .map(({ type, value }) => (type === 'month' ? value.replace('.', '') : value))
        .join(''),
  };
}
