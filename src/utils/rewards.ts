import type { CoinGrant } from '@/@types';

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
