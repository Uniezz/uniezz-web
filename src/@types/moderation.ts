import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ChallengeFormSchema } from './rewards';
import type { components } from './schema';

export type QueuedReport = components['schemas']['QueuedReport'];
export type ModerationAction = components['schemas']['Action'];
export type Moderator = components['schemas']['Moderator'];

export type ReportItemProps = { report: QueuedReport };

export type BanButtonProps = {
  /** Shows only the ban or unban icon, with the label as its accessible name and tooltip. */
  iconOnly?: boolean;
  /** Shows the icon and label as a text link, like the profile's report and block links. */
  inline?: boolean;
  userId: string;
};

export type ConfirmActionButtonProps = {
  label: string;
  description: string;
  /** Resolves on success; a rejection shows the generic error toast and keeps the dialog open. */
  onConfirm: () => Promise<void>;
  success: string;
  disabled?: boolean;
  children?: ReactNode;
  /** Shows only this icon; the label becomes the accessible name and tooltip. */
  icon?: LucideIcon;
  /** Shows the icon in red, for actions that take something away. */
  danger?: boolean;
  /** With `icon`, shows the icon and label as a text link instead of an icon button. */
  inline?: boolean;
};

export type ChallengeFormDialogProps = {
  open: boolean;
  /** Left out to create a new challenge. */
  challenge?: components['schemas']['Challenge'];
  onClose: () => void;
};

export type ChallengeFormProps = {
  id: string;
  challenge?: components['schemas']['Challenge'];
  onSubmit: (values: ChallengeFormSchema) => void;
};

export type GrantModeratorButtonProps = { userId: string; icon?: LucideIcon; inline?: boolean };

export type ReportDecision = components['schemas']['UpdateReportInputBody']['status'];
export type ReportDecisionInput = { id: string; status: ReportDecision };

/** Report targets with a removal endpoint; students and discovery cards are banned instead. */
export type RemovableTarget =
  | 'post'
  | 'comment'
  | 'file'
  | 'course'
  | 'course_comment'
  | 'professor_review';
export type RemoveContentInput = { type: RemovableTarget; id: string };

export type ModerationTab = 'reports' | 'faq' | 'moderators' | 'log' | 'challenges';

/** Anything carrying staff roles, such as the signed-in profile while it loads. */
export type WithRoles = { roles: string[] | null } | undefined;
