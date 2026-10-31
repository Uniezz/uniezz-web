import type { components } from '@/@types/schema';
import type { FeedFilters } from '@/@types';
import { api } from './client';

export async function getFeedPosts(filters: FeedFilters = {}, cursor?: string) {
  const { data, error } = await api.GET('/feed/posts', {
    params: { query: { limit: 20, ...filters, cursor } },
  });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing feed response');
  return data;
}

export async function getFeedPost(id: string) {
  const { data, error } = await api.GET('/feed/posts/{id}', { params: { path: { id } } });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing post response');
  return data;
}

export async function createFeedPost(
  body: components['schemas']['CreatePostInputBody'],
  key: string,
) {
  const { data, error } = await api.POST('/feed/posts', {
    body,
    params: { header: { 'Idempotency-Key': key } },
  });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing post response');
  return data;
}

export async function getFeedComments(id: string, cursor?: string) {
  const { data, error } = await api.GET('/feed/posts/{id}/comments', {
    params: { path: { id }, query: { cursor, limit: 20 } },
  });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing comments response');
  return data;
}

export async function getCommentReplies(id: string, cursor?: string) {
  const { data, error } = await api.GET('/feed/comments/{id}/replies', {
    params: { path: { id }, query: { cursor, limit: 20 } },
  });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing replies response');
  return data;
}

export async function createFeedComment({
  id,
  content,
  key,
}: {
  id: string;
  content: string;
  key: string;
}) {
  const { data, error } = await api.POST('/feed/posts/{id}/comments', {
    params: { path: { id }, header: { 'Idempotency-Key': key } },
    body: { content },
  });
  if (error) throw new Error(error.error);
  if (!data) throw new Error('Missing comment response');
  return data;
}
