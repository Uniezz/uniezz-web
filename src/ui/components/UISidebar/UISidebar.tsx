import {
  GraduationCap,
  LibraryBig,
  MapPin,
  MessageSquare,
  Newspaper,
  Settings,
  Sparkles,
} from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { UINavItem } from '../UINavItem';
import { sidebarCaptionStyles, sidebarMarkStyles, sidebarStyles } from './variants';

const MAIN_NAV = [
  { to: '/feed', label: 'Feed', leftIcon: Newspaper },
  { to: '/chat', label: 'Chat', leftIcon: MessageSquare },
  { to: '/connections', label: 'Connections', leftIcon: Sparkles },
] as const;

const ACADEMICS_NAV = [
  { to: '/exams', label: 'Exams & Courses', leftIcon: LibraryBig },
  { to: '/guide', label: 'Student Guide', leftIcon: MapPin },
] as const;

type UISidebarProps = ComponentProps<'aside'> & {
  user: { initials: string; name: string; meta: string };
  counts?: Record<string, number>;
  onSettingsClick?: () => void;
};

export const UISidebar = ({
  user,
  counts,
  onSettingsClick,
  className,
  ...props
}: UISidebarProps) => {
  return (
    <aside className={cn(sidebarStyles(), className)} {...props}>
      <div className="flex items-center gap-2.5 px-1 pt-1.5 pb-5.5">
        <div className={sidebarMarkStyles()}>
          <GraduationCap className="text-ice" size={19} />
        </div>
        <span className="text-[21px] font-bold tracking-[-0.3px] text-ice">Uniezz</span>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col">
        <div className="flex flex-col gap-0.5">
          {MAIN_NAV.map((item) => (
            <UINavItem key={item.to} {...item} count={counts?.[item.to]} />
          ))}
        </div>

        <div className="flex flex-col gap-0.5 pt-2.5 pb-1">
          <span className={sidebarCaptionStyles()}>ACADEMICS</span>
          {ACADEMICS_NAV.map((item) => (
            <UINavItem key={item.to} {...item} count={counts?.[item.to]} />
          ))}
        </div>
      </nav>

      <div className="mt-auto flex items-center gap-2.5 rounded-xl bg-navy-raised p-2.5">
        <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-blue">
          <span className="text-sm font-bold text-ice">{user.initials}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="truncate text-sm font-bold text-ice">{user.name}</span>
          <span className="truncate text-caption font-normal text-navy-muted">{user.meta}</span>
        </div>
        <button
          type="button"
          aria-label="Settings"
          onClick={onSettingsClick}
          className="shrink-0 rounded-md text-navy-muted outline-none hover:text-ice focus-visible:ring-2 focus-visible:ring-ice"
        >
          <Settings size={17} />
        </button>
      </div>
    </aside>
  );
};
