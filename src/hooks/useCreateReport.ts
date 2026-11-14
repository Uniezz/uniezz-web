import { useMutation } from '@tanstack/react-query';
import { createReport } from '@/api';
import i18n from '@/i18n';

export function useCreateReport() {
  return useMutation({
    meta: { analyticsAction: 'report_create', progress: () => i18n.t('progress.reportCreate') },
    mutationKey: ['reports', 'create'],
    mutationFn: createReport,
  });
}
