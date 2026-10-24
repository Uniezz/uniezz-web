import { LibraryBig, MapPin, MessageSquare, Newspaper, Sparkles } from 'lucide-react';
import { type NavGroup, type NavItem } from '@/types';

const MAIN_NAV: NavItem[] = [
  { to: '/feed', labelKey: 'feed.title', leftIcon: Newspaper },
  { to: '/chat', labelKey: 'chat.title', leftIcon: MessageSquare },
  { to: '/connections', labelKey: 'connections.title', leftIcon: Sparkles },
];

const ACADEMICS_NAV: NavItem[] = [
  { to: '/exams', labelKey: 'exams.title', leftIcon: LibraryBig },
  { to: '/guide', labelKey: 'guide.title', leftIcon: MapPin },
];

export const NAV_GROUPS: NavGroup[] = [
  { items: MAIN_NAV },
  { titleKey: 'sidebar.academics', items: ACADEMICS_NAV },
];
