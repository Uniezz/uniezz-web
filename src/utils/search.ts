export function matchesSearch(query: string, ...values: string[]): boolean {
  return values.join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}

/** The backend searches up to 5 words of at least 3 characters and rejects anything else. */
export function profileSearchQuery(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => [...word].length >= 3)
    .slice(0, 5)
    .join(' ');
}
