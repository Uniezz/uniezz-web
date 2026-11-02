import type { components } from '@/@types/schema';
import { api } from './client';

export async function createReport(body: components['schemas']['CreateReportInputBody']) {
  const { data, error, response } = await api.POST('/reports', { body });
  if (error) throw new Error(error.error, { cause: response.status });
  if (!data) throw new Error('Missing report response');
  return data;
}
