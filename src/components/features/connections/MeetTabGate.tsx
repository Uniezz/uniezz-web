import { useNavigate } from '@tanstack/react-router';
import { useState, type MouseEvent } from 'react';

import { useMyConnectionPreferences } from '@/hooks';
import { UIBottomTabs } from '@/ui/components';
import { BirthDateSheet } from './BirthDateSheet';

/**
 * The phone tab bar with the mobile app's Meet gate: while the birth date is missing, the Meet tab
 * opens the birth date sheet over the current tab, and goes to Meet once it is saved.
 */
export function MeetTabGate() {
  const navigate = useNavigate();
  const { data: preferences, isPending } = useMyConnectionPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const isLocked = isPending || !preferences?.birthDate;
  const handleTabClick = (to: string, event: MouseEvent) => {
    if (to !== '/connections' || !isLocked) return;
    event.preventDefault();
    if (!isPending) setIsOpen(true);
  };
  const handleSaved = () => {
    setIsOpen(false);
    void navigate({ to: '/connections' });
  };
  return (
    <>
      <UIBottomTabs onTabClick={handleTabClick} />
      <BirthDateSheet open={isOpen} onOpenChange={setIsOpen} onSaved={handleSaved} />
    </>
  );
}
