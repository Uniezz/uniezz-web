import type { components } from '@/@types/schema';
import { api } from './client';

export async function createReport(body: components['schemas']['CreateReportInputBody']) {
  const { data } = await api.POST('/reports', { body });
  return data!;
}
