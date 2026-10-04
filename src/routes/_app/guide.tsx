import { UIText } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/guide')({
  component: GuidePage,
});

function GuidePage() {
  return (
    <div className="p-8">
      <UIText as="h1" size="xxl" weight="bold">
        Student Guide
      </UIText>
    </div>
  );
}
