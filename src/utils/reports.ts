/** Report reasons with their labels, in the order the report forms list them. */
export const REPORT_REASONS = [
  { value: 'spam', label: 'report.spam' },
  { value: 'harassment', label: 'report.harassment' },
  { value: 'inappropriate', label: 'report.inappropriate' },
  { value: 'hate_speech', label: 'report.hateSpeech' },
  { value: 'other', label: 'report.other' },
] as const;
