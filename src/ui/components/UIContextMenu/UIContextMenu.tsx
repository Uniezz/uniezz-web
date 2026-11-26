import { Ellipsis } from 'lucide-react';
import { useId, type MouseEvent, type ReactNode } from 'react';

import type { Option } from '@/@types';
import { cn } from '../../cn';
import { UIMenu } from '../UIMenu';

export type UIContextMenuProps = {
  options: Option[];
  onSelect: (value: string) => void;
  /** Accessible name of the "…" button, for touch and keyboard users. */
  label: string;
  /** Which edge of the content the menu lines up with. */
  align?: 'start' | 'end';
  children: ReactNode;
  className?: string;
};

/**
 * Right-clicking the content, or its "…" button, opens a menu of actions under it. Without options
 * there is no menu. The menu is a native popover, like the one in `UISelect`.
 */
export const UIContextMenu = ({
  options,
  onSelect,
  label,
  align = 'start',
  children,
  className,
}: UIContextMenuProps) => {
  const id = useId();
  const menuId = `context-menu-${id}`;
  const anchor = `--context-${id.replace(/[^\w-]/g, '')}`;
  const hasOptions = options.length > 0;

  function openMenu(event: MouseEvent) {
    const { nativeEvent } = event;
    // No long press on touch screens; they use the "…" button.
    if (nativeEvent instanceof PointerEvent && nativeEvent.pointerType === 'touch') return;
    // With selected text, the browser menu stays, so the student can copy part of a message.
    if (window.getSelection()?.toString()) return;
    event.preventDefault();
    const open = () => document.getElementById(menuId)?.togglePopover(true);
    // On a Mac this event comes before the mouse button is released, and the release closes popovers.
    // A release outside the window never reaches here, so a later left click must not open the menu.
    if (event.buttons > 0)
      window.addEventListener('mouseup', (up) => up.button === 2 && open(), { once: true });
    else open();
  }

  function selectOption(value: string) {
    document.getElementById(menuId)?.hidePopover();
    onSelect(value);
  }

  return (
    <>
      <div
        className={cn(
          'group/context flex items-center gap-1',
          align === 'end' && 'flex-row-reverse',
          className,
        )}
        style={{ anchorName: anchor }}
        onContextMenu={hasOptions ? openMenu : undefined}
      >
        {children}
        {hasOptions ? (
          <button
            type="button"
            popoverTarget={menuId}
            aria-label={label}
            data-ph-capture-attribute-label={label}
            className="grid size-8 shrink-0 place-items-center rounded-full text-white-60 opacity-0 outline-none group-hover/context:opacity-100 group-has-[+:popover-open]/context:opacity-100 hover:bg-white-10 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-blue pointer-coarse:opacity-100"
          >
            <Ellipsis size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {hasOptions ? (
        <UIMenu
          id={menuId}
          popover="auto"
          options={options}
          value=""
          size="compact"
          style={{
            position: 'fixed',
            positionAnchor: anchor,
            inset: 'auto',
            top: 'anchor(bottom)',
            ...(align === 'start' ? { left: 'anchor(left)' } : { right: 'anchor(right)' }),
            margin: '8px 0',
            positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
          }}
          className="max-h-72 overflow-y-auto bg-surface not-open:hidden"
          onSelect={selectOption}
        />
      ) : null}
    </>
  );
};
