import { UIText } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/feed')({
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="p-8">
      <UIText as="h1" size="xxl" weight="bold">
        Feed
      </UIText>
    </div>
  );
}
