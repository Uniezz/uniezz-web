// Never red: it is only for danger.
const senderColors = ['text-sky', 'text-green', 'text-amber', 'text-pink'] as const;

/** The name colour of a group member. It comes from the id, so it is always the same for one student. */
export function senderColor(senderId: string | null) {
  if (senderId === null) return 'text-secondary';
  const sum = [...senderId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return senderColors[sum % senderColors.length];
}
