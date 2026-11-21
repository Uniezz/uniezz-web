import { BookOpen, CircleHelp, MessageCircle, House, ShieldCheck, Users } from 'lucide-react';
// Direct path: the components barrel imports these utils back.
import { UICoin } from '@/ui/components/UICoin';
import { type NavGroup, type NavItem } from '@/@types';

const MAIN_NAV: NavItem[] = [
  { to: '/feed', labelKey: 'feed.title', leftIcon: House },
  { to: '/chat', labelKey: 'chat.title', leftIcon: MessageCircle },
  { to: '/connections', labelKey: 'connections.title', leftIcon: Users },
  { to: '/rewards', labelKey: 'rewards.title', leftIcon: UICoin, tone: 'amber' },
];

const ACADEMICS_NAV: NavItem[] = [
  { to: '/exams', labelKey: 'exams.title', leftIcon: BookOpen },
  { to: '/faq', labelKey: 'faq.title', leftIcon: CircleHelp },
];

const STAFF_NAV: NavItem[] = [
  { to: '/moderation', labelKey: 'moderation.title', leftIcon: ShieldCheck },
];

export const NAV_GROUPS: NavGroup[] = [
  { items: MAIN_NAV },
  { section: 'academics', items: ACADEMICS_NAV },
];

/** `staff`: moderators and admins also get the moderation tools. */
export function getNavigationGroups(chatEnabled: boolean, staff = false): NavGroup[] {
  const groups = staff ? [...NAV_GROUPS, { section: 'staff', items: STAFF_NAV }] : NAV_GROUPS;
  if (chatEnabled) return groups;
  return groups
    .map(({ items, ...group }) => ({
      ...group,
      items: items.filter(({ to }) => to !== '/chat'),
    }))
    .filter(({ items }) => items.length > 0);
}

// Selecting the current tab clears carried-over return paths and conversation filters.
export const RESET_TAB_SEARCH = {
  postFrom: undefined,
  chatType: undefined,
  conversationId: undefined,
};
