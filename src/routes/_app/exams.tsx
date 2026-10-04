import { UIText } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/exams')({
  component: ExamsPage,
});

function ExamsPage() {
  return (
    <div className="p-8">
      <UIText as="h1" size="xxl" weight="bold">
        Exams &amp; Courses
      </UIText>
    </div>
  );
}
