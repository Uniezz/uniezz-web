import { useMutation } from '@tanstack/react-query';
import { createReport } from '@/api';

export function useCreateReport() {
  return useMutation({
    meta: { analyticsAction: 'report_create' },
    mutationKey: ['reports', 'create'],
    mutationFn: createReport,
  });
}
