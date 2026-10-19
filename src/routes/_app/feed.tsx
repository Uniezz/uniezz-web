import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/_app/feed')({
  component: FeedPage,
});

function FeedPage() {
  return (
    <>
      <UITopbar
        title="Feed"
        subtitle="What's happening across Lublin"
        action={{ label: 'Create post', icon: Plus }}
      />
      <div className="p-8" />
    </>
  );
}
