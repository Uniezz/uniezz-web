import {
  BookOpen,
  CircleHelp,
  Info,
  LibraryBig,
  MessageCircle,
  House,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
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

const MODERATION_NAV: NavItem = {
  to: '/moderation',
  labelKey: 'moderation.title',
  leftIcon: ShieldCheck,
};

export const NAV_GROUPS: NavGroup[] = [
  { items: MAIN_NAV },
  { section: 'academics', items: ACADEMICS_NAV },
];

/** `staff`: moderators and admins also get the moderation tools, after the academics items. */
export function getNavigationGroups(chatEnabled: boolean, staff = false): NavGroup[] {
  const groups = staff
    ? NAV_GROUPS.map((group) =>
        group.section === 'academics'
          ? { ...group, items: [...group.items, MODERATION_NAV] }
          : group,
      )
    : NAV_GROUPS;
  if (chatEnabled) return groups;
  return groups
    .map(({ items, ...group }) => ({
      ...group,
      items: items.filter(({ to }) => to !== '/chat'),
    }))
    .filter(({ items }) => items.length > 0);
}

// The phone's bottom tabs: the mobile app's tab icons and labels. Rewards open from the profile avatar, moderation from the profile.
const BOTTOM_TABS: NavItem[] = [
  { to: '/feed', labelKey: 'tabs.feed', leftIcon: Newspaper },
  { to: '/chat', labelKey: 'tabs.chat', leftIcon: MessageCircle },
  { to: '/connections', labelKey: 'tabs.connections', leftIcon: Sparkles },
  { to: '/exams', labelKey: 'tabs.exams', leftIcon: LibraryBig },
  { to: '/faq', labelKey: 'tabs.faq', leftIcon: Info },
];

export function getBottomTabs(chatEnabled: boolean): NavItem[] {
  return chatEnabled ? BOTTOM_TABS : BOTTOM_TABS.filter(({ to }) => to !== '/chat');
}

// Selecting the current tab clears carried-over return paths and conversation filters.
export const RESET_TAB_SEARCH = {
  postFrom: undefined,
  chatType: undefined,
  conversationId: undefined,
};
