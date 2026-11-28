import { createFileRoute } from '@tanstack/react-router';
import type { FollowList } from '@/@types';
import { FollowsScreen } from '@/components/features/profile';
import { optionalSearchStringSchema } from '@/schemas';

// Phone-only: the mobile app pushes the follower lists as their own screen; desktop opens a dialog.
export const Route = createFileRoute('/_app/follows')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { profileId: string | undefined; list: FollowList } => ({
    profileId: optionalSearchStringSchema.parse(search.profileId),
    list: search.list === 'following' ? 'following' : 'followers',
  }),
  component: FollowsPage,
});

function FollowsPage() {
  const { profileId, list } = Route.useSearch();
  const navigate = Route.useNavigate();
  const handleListChange = (next: FollowList) =>
    void navigate({ search: (previous) => ({ ...previous, list: next }), replace: true });
  return <FollowsScreen profileId={profileId} list={list} onListChange={handleListChange} />;
}
