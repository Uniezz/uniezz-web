import type { z } from 'zod';
import type { challengeSchema } from '@/schemas';
import type { components } from './schema';

export type CoinGrant = components['schemas']['CoinGrant'];
export type DailyQuests = components['schemas']['DailyQuests'];
export type QuestProgress = components['schemas']['QuestProgress'];
export type Challenge = components['schemas']['Challenge'];
export type ChallengeText = components['schemas']['ChallengeText'];
export type MyChallenge = components['schemas']['MyChallenge'];
export type ChallengeCreateBody = components['schemas']['CreateChallengeInputBody'];
export type ChallengeAction = ChallengeCreateBody['action'];
export type ChallengePeriod = ChallengeCreateBody['period'];
export type ChallengeUpdateBody = components['schemas']['UpdateChallengeInputBody'];
export type ChallengeUpdateInput = { id: string; body: ChallengeUpdateBody };
export type ChallengeFormInput = z.input<typeof challengeSchema>;
export type ChallengeFormSchema = z.output<typeof challengeSchema>;
