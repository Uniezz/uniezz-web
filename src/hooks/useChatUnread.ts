import { useQuery } from '@tanstack/react-query';
import { getChatUnread } from '@/api';
import { chatKeys } from '@/utils';

/** The unread count on the phone's Chat tab; polled, as the web has no chat stream. */
export function useChatUnread(isEnabled: boolean) {
  return useQuery({
    queryKey: [...chatKeys.all, 'unread'],
    queryFn: getChatUnread,
    enabled: isEnabled,
    staleTime: 15_000,
    gcTime: 10 * 60_000,
    refetchInterval: 30_000,
  });
}
