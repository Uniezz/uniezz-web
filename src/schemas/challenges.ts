import { z } from 'zod';
import type {
  Challenge,
  ChallengeAction,
  ChallengePeriod,
  ChallengeCreateBody,
  ChallengeFormInput,
  ChallengeFormSchema,
  ChallengeUpdateBody,
} from '@/@types';

// Runtime lists for z.enum and the form's selects; the label maps in utils/rewards are exhaustive.
export const CHALLENGE_ACTIONS = [
  'like_given',
  'like_received',
  'comment_posted',
  'reply_posted',
  'post_created',
  'file_uploaded',
  'course_rated',
  'professor_rated',
  'connection_made',
  'profile_completed',
  'friend_invited',
  'faq_approved',
] as const satisfies readonly ChallengeAction[];

export const CHALLENGE_PERIODS = [
  'day',
  'week',
  'once',
] as const satisfies readonly ChallengePeriod[];

// datetime-local inputs give "yyyy-mm-ddThh:mm" or "" when cleared.
const localDateTime = z.union([z.literal(''), z.iso.datetime({ local: true })]);

export const challengeSchema = z
  .object({
    action: z.enum(CHALLENGE_ACTIONS),
    period: z.enum(CHALLENGE_PERIODS),
    target: z.coerce.number().int().min(1).max(1000),
    reward: z.coerce.number().int().min(0).max(1000),
    startsAt: localDateTime,
    endsAt: localDateTime,
    titlePl: z.string().trim().min(1).max(80),
    descriptionPl: z.string().trim().max(300),
    titleEn: z.string().trim().max(80),
    descriptionEn: z.string().trim().max(300),
  })
  .refine(({ startsAt, endsAt }) => !startsAt || !endsAt || endsAt > startsAt, {
    path: ['endsAt'],
  });

/** The form values as the API body; empty optional fields are left out. */
export function challengeBody(values: ChallengeFormSchema): ChallengeCreateBody {
  const text = (title: string, description: string) => ({
    title,
    ...(description && { description }),
  });
  return {
    action: values.action,
    period: values.period,
    target: values.target,
    reward: values.reward,
    ...(values.startsAt && { startsAt: new Date(values.startsAt).toISOString() }),
    ...(values.endsAt && { endsAt: new Date(values.endsAt).toISOString() }),
    texts: {
      pl: text(values.titlePl, values.descriptionPl),
      ...(values.titleEn && { en: text(values.titleEn, values.descriptionEn) }),
    },
  };
}

// datetime-local wants local wall time without a zone.
function toLocalInput(iso: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

/** Form values for a new challenge, or the current values of one being edited. */
export function challengeFormValues(challenge?: Challenge): ChallengeFormInput {
  return {
    action: (challenge?.action as ChallengeFormInput['action'] | undefined) ?? 'like_given',
    period: challenge?.period ?? 'day',
    target: challenge?.target ?? 1,
    reward: challenge?.reward ?? 10,
    startsAt: toLocalInput(challenge?.startsAt ?? null),
    endsAt: toLocalInput(challenge?.endsAt ?? null),
    titlePl: challenge?.texts.pl?.title ?? '',
    descriptionPl: challenge?.texts.pl?.description ?? '',
    titleEn: challenge?.texts.en?.title ?? '',
    descriptionEn: challenge?.texts.en?.description ?? '',
  };
}

/** The editable fields as a PATCH body; texts replace every language, so others are kept. */
export function challengeUpdateBody(
  values: ChallengeFormSchema,
  current: Challenge,
): ChallengeUpdateBody {
  const { reward, startsAt, endsAt, texts } = challengeBody(values);
  // en is edited in the form, so a cleared English text must not come back from `current`.
  const otherTexts = Object.fromEntries(
    Object.entries(current.texts).filter(([language]) => language !== 'en'),
  );
  return { reward, startsAt, endsAt, texts: { ...otherTexts, ...texts } };
}
