import type { components } from './schema';

export type FaqEntry = components['schemas']['Entry'];
export type FaqProposalRequest = components['schemas']['ProposalRequest'];
export type FaqLanguage = FaqEntry['language'];
export type FaqTexts = components['schemas']['TextsRequest']['texts'];
