import type { QueuedReport, RemovableTarget } from '@/@types';

const reportReasonLabels = {
  spam: 'report.spam',
  harassment: 'report.harassment',
  inappropriate: 'report.inappropriate',
  hate_speech: 'report.hateSpeech',
  other: 'report.other',
} as const satisfies Record<QueuedReport['reason'], string>;

// Keys are the backend's report target types; an unknown type falls back to moderation.targetOther.
const reportTargetLabels = {
  post: 'moderation.targetPost',
  comment: 'moderation.targetComment',
  user: 'moderation.targetUser',
  candidate: 'moderation.targetCandidate',
  file: 'moderation.targetFile',
  course: 'moderation.targetCourse',
  course_comment: 'moderation.targetCourseComment',
  professor_review: 'moderation.targetProfessorReview',
} as const;

// The report targets the moderation API can remove; users are banned instead.
const removableTargets: readonly string[] = [
  'post',
  'comment',
  'file',
  'course',
  'course_comment',
  'professor_review',
] satisfies readonly RemovableTarget[];

export function isRemovableTarget(type: string): type is RemovableTarget {
  return removableTargets.includes(type);
}

export function reportReasonLabel(reason: QueuedReport['reason']) {
  return reportReasonLabels[reason];
}

export function reportTargetLabel(targetType: string) {
  return Object.hasOwn(reportTargetLabels, targetType)
    ? reportTargetLabels[targetType as keyof typeof reportTargetLabels]
    : 'moderation.targetOther';
}

function snapshotText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/**
 * The reported content as it looked, from the snapshot the backend kept; its shape depends on
 * the target, and ids such as postId or universityId are left out.
 */
export function snapshotPreview(snapshot: QueuedReport['snapshot']) {
  const name = [snapshotText(snapshot.firstName), snapshotText(snapshot.lastName)]
    .filter(Boolean)
    .join(' ');
  const body = [snapshot.content, snapshot.description, snapshot.intent, snapshot.bio]
    .map(snapshotText)
    .filter(Boolean)
    .join('\n\n');
  const tags = Array.isArray(snapshot.interests)
    ? snapshot.interests.map(snapshotText).filter((tag) => tag !== undefined)
    : [];
  return {
    heading: snapshotText(snapshot.title) ?? snapshotText(snapshot.name) ?? (name || undefined),
    body: body || undefined,
    tags,
  };
}

// Keys are the backend's action types; an unknown type falls back to moderation.actionOther.
const moderationActionLabels = {
  review_report: 'moderation.actionReviewReport',
  dismiss_report: 'moderation.actionDismissReport',
  remove_post: 'moderation.actionRemovePost',
  remove_comment: 'moderation.actionRemoveComment',
  remove_file: 'moderation.actionRemoveFile',
  remove_course: 'moderation.actionRemoveCourse',
  ban: 'moderation.actionBan',
  unban: 'moderation.actionUnban',
  grant_moderator: 'moderation.actionGrantModerator',
  revoke_moderator: 'moderation.actionRevokeModerator',
} as const;

export function moderationActionLabel(type: string) {
  return Object.hasOwn(moderationActionLabels, type)
    ? moderationActionLabels[type as keyof typeof moderationActionLabels]
    : 'moderation.actionOther';
}
