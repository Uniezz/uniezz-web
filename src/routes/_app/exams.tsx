import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Paperclip } from 'lucide-react';

export const Route = createFileRoute('/_app/exams')({
  component: ExamsPage,
});

function ExamsPage() {
  return (
    <>
      <UITopbar
        title="Exams & Courses"
        subtitle="Past papers, course reviews and professor ratings"
        action={{ label: 'Upload material', icon: Paperclip }}
      />
      <div className="p-8" />
    </>
  );
}
