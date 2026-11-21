import { z } from 'zod';
import type { ModerationTab } from '@/@types';

const MODERATION_TABS = [
  'reports',
  'moderators',
  'log',
  'challenges',
] as const satisfies readonly ModerationTab[];

export const moderationSearchSchema = z.object({
  tab: z.enum(MODERATION_TABS).optional().catch(undefined),
});
