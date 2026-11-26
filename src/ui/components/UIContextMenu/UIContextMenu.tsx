import { useId, type MouseEvent, type ReactNode } from 'react';

import type { Option } from '@/@types';
import { UIMenu } from '../UIMenu';

export type UIContextMenuProps = {
  options: Option[];
  onSelect: (value: string) => void;
  /** Which edge of the content the menu lines up with. */
  align?: 'start' | 'end';
  children: ReactNode;
  className?: string;
};

/**
 * Right-clicking the content opens a menu of actions under it. Without options there is no menu.
 * The menu is a native popover, like the one in `UISelect`.
 */
export const UIContextMenu = ({
  options,
  onSelect,
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
    // No long press on touch screens.
    if (nativeEvent instanceof PointerEvent && nativeEvent.pointerType === 'touch') return;
    event.preventDefault();
    const open = () => document.getElementById(menuId)?.togglePopover(true);
    // On a Mac this event comes before the mouse button is released, and the release closes popovers.
    if (event.buttons > 0) window.addEventListener('mouseup', open, { once: true });
    else open();
  }

  function selectOption(value: string) {
    document.getElementById(menuId)?.hidePopover();
    onSelect(value);
  }

  return (
    <>
      <div
        className={className}
        style={{ anchorName: anchor }}
        onContextMenu={hasOptions ? openMenu : undefined}
      >
        {children}
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
