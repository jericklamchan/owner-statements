export function getPropertyInitials(name: string): string {
  if (!name) return 'PR';
  return name
    .trim()
    .split(/\s+/)
    .map((w: string) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}