export function optionalSearchString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length <= 120 ? value : undefined;
}
