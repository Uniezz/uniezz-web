export function formatCompactNumber(value: number, locale: string | undefined) {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 })
    .format(value)
    .replace(/([KMGT])$/, (unit) => unit.toLowerCase());
}
