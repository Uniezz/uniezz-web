import { BookOpen, Map, MessageCircle, House, Users } from 'lucide-react';
import { type NavGroup, type NavItem } from '@/@types';

const MAIN_NAV: NavItem[] = [
  { to: '/feed', labelKey: 'feed.title', leftIcon: House },
  { to: '/chat', labelKey: 'chat.title', leftIcon: MessageCircle },
  { to: '/connections', labelKey: 'connections.title', leftIcon: Users },
];

const ACADEMICS_NAV: NavItem[] = [
  { to: '/exams', labelKey: 'exams.title', leftIcon: BookOpen },
  { to: '/guide', labelKey: 'guide.title', leftIcon: Map },
];

export const NAV_GROUPS: NavGroup[] = [
  { items: MAIN_NAV },
  { titleKey: 'sidebar.academics', items: ACADEMICS_NAV },
];
