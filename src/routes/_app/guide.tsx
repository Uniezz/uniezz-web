import { UITopbar } from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { MapPin } from 'lucide-react';

export const Route = createFileRoute('/_app/guide')({
  component: GuidePage,
});

function GuidePage() {
  return (
    <>
      <UITopbar
        title="Student Guide"
        subtitle="Everything you need to live in Lublin"
        action={{ label: 'Suggest a place', icon: MapPin }}
      />
      <div className="p-8" />
    </>
  );
}
