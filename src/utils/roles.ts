import type { WithRoles } from '@/@types';

/** Moderators and admins see the moderation tools. */
export function isStaff(profile: WithRoles) {
  return Boolean(profile?.roles?.some((role) => role === 'moderator' || role === 'admin'));
}

export function isAdmin(profile: WithRoles) {
  return Boolean(profile?.roles?.includes('admin'));
}
