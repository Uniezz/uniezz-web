import { BookOpen, CircleHelp, MessageCircle, House, Users } from 'lucide-react';
import { type NavGroup, type NavItem } from '@/@types';

const MAIN_NAV: NavItem[] = [
  { to: '/feed', labelKey: 'feed.title', leftIcon: House },
  { to: '/chat', labelKey: 'chat.title', leftIcon: MessageCircle },
  { to: '/connections', labelKey: 'connections.title', leftIcon: Users },
];

const ACADEMICS_NAV: NavItem[] = [
  { to: '/exams', labelKey: 'exams.title', leftIcon: BookOpen },
  { to: '/faq', labelKey: 'faq.title', leftIcon: CircleHelp },
];

export const NAV_GROUPS: NavGroup[] = [
  { items: MAIN_NAV },
  { section: 'academics', items: ACADEMICS_NAV },
];

export function getNavigationGroups(chatEnabled: boolean): NavGroup[] {
  if (chatEnabled) return NAV_GROUPS;
  return NAV_GROUPS.map(({ items, ...group }) => ({
    ...group,
    items: items.filter(({ to }) => to !== '/chat'),
  })).filter(({ items }) => items.length > 0);
}

// Selecting the current tab clears carried-over return paths and conversation filters.
export const RESET_TAB_SEARCH = {
  postFrom: undefined,
  chatType: undefined,
  conversationId: undefined,
};
