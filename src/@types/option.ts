import { type ComponentType } from 'react';

export type Option = {
  value: string;
  label: string;
  Icon?: ComponentType<{ className?: string }>;
  /** Shows this university's logo in place of Icon */
  universityId?: string;
  description?: string;
  /** A red row, for an action that cannot be undone */
  danger?: boolean;
};
