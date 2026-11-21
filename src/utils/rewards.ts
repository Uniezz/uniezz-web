import type { ChallengeAction, ChallengePeriod, ChallengeText, CoinGrant } from '@/@types';

// Keys are the backend's grant reasons; an unknown reason falls back to rewards.reasonOther.
const coinGrantReasonLabels = {
  welcome: 'rewards.reasonWelcome',
  like_given: 'rewards.reasonLikeGiven',
  like_received: 'rewards.reasonLikeReceived',
  comment: 'rewards.reasonComment',
  profile_complete: 'rewards.reasonProfileComplete',
  birth_date: 'rewards.reasonBirthDate',
  referral: 'rewards.reasonReferral',
  daily_quests: 'rewards.reasonDailyQuests',
  faq_approved: 'rewards.reasonFaqApproved',
  challenge: 'rewards.reasonChallenge',
} as const satisfies Record<CoinGrant['reason'], string>;

// Keys are the backend's quest names; an unknown quest falls back to rewards.questOther.
const questLabels = {
  like: 'rewards.questLike',
  reply: 'rewards.questReply',
  post: 'rewards.questPost',
} as const;

export function coinGrantReasonLabel(reason: string) {
  return Object.hasOwn(coinGrantReasonLabels, reason)
    ? coinGrantReasonLabels[reason as keyof typeof coinGrantReasonLabels]
    : 'rewards.reasonOther';
}

export function questLabel(quest: string) {
  return Object.hasOwn(questLabels, quest)
    ? questLabels[quest as keyof typeof questLabels]
    : 'rewards.questOther';
}

/** The challenge text in the student's language; pl is always there. */
export function challengeText(texts: Record<string, ChallengeText>, language?: string) {
  return (language && texts[language]) || texts.pl;
}

// Keys are the backend's challenge actions; an unknown action falls back to rewards.challengeActionOther.
const challengeActionLabels = {
  like_given: 'rewards.challengeActionLikeGiven',
  like_received: 'rewards.challengeActionLikeReceived',
  comment_posted: 'rewards.challengeActionCommentPosted',
  reply_posted: 'rewards.challengeActionReplyPosted',
  post_created: 'rewards.challengeActionPostCreated',
  file_uploaded: 'rewards.challengeActionFileUploaded',
  course_rated: 'rewards.challengeActionCourseRated',
  professor_rated: 'rewards.challengeActionProfessorRated',
  connection_made: 'rewards.challengeActionConnectionMade',
  profile_completed: 'rewards.challengeActionProfileCompleted',
  friend_invited: 'rewards.challengeActionFriendInvited',
  faq_approved: 'rewards.challengeActionFaqApproved',
} as const satisfies Record<ChallengeAction, string>;

export const challengePeriodLabels = {
  day: 'rewards.challengePeriodDay',
  week: 'rewards.challengePeriodWeek',
  once: 'rewards.challengePeriodOnce',
} as const satisfies Record<ChallengePeriod, string>;

export function challengeActionLabel(action: string) {
  return Object.hasOwn(challengeActionLabels, action)
    ? challengeActionLabels[action as keyof typeof challengeActionLabels]
    : 'rewards.challengeActionOther';
}
