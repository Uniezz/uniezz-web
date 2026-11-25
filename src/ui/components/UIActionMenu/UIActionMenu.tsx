import { Ellipsis } from 'lucide-react';
import { useId, useState, type MouseEvent, type ReactNode } from 'react';

import type { Option } from '@/@types';
import { UIButton } from '../UIButton';
import { UIMenu } from '../UIMenu';

export type UIActionMenuProps = {
  options: Option[];
  onSelect: (value: string) => void;
  /** Accessible name of the button. It is also sent to analytics, so it has no user content. */
  label: string;
  /** Right-clicking this content opens the same menu at the mouse. */
  children?: ReactNode;
  className?: string;
};

/**
 * A "more" button with a menu of actions, or only the content when there are no actions.
 * The menu is a native popover, like the one in `UISelect`.
 */
export const UIActionMenu = ({
  options,
  onSelect,
  label,
  children,
  className,
}: UIActionMenuProps) => {
  const id = useId();
  const menuId = `action-menu-${id}`;
  const anchor = `--action-${id.replace(/[^\w-]/g, '')}`;
  // Where the student right-clicked, or null when the button opened the menu.
  const [point, setPoint] = useState<{ left: number; top: number } | null>(null);
  const content = (
    <div className="contents" onContextMenu={options.length > 0 ? openAtMouse : undefined}>
      {children}
    </div>
  );

  function openAtMouse(event: MouseEvent) {
    const { nativeEvent, clientX, clientY } = event;
    // No long press on touch screens: they use the button.
    if (nativeEvent instanceof PointerEvent && nativeEvent.pointerType === 'touch') return;
    event.preventDefault();
    setPoint({ left: clientX, top: clientY });
    const open = () => document.getElementById(menuId)?.togglePopover(true);
    // On a Mac this event comes before the mouse button is released, and the release closes popovers.
    if (event.buttons > 0) window.addEventListener('mouseup', open, { once: true });
    else open();
  }

  if (options.length === 0) return content;

  return (
    <>
      {content}
      <UIButton
        size="icon"
        bg="plain"
        aria-label={label}
        popoverTarget={menuId}
        style={{ anchorName: point ? undefined : anchor }}
        className={className}
        onClick={() => setPoint(null)}
      >
        <Ellipsis size={18} aria-hidden="true" />
      </UIButton>
      {point ? <span style={{ position: 'fixed', ...point, anchorName: anchor }} /> : null}
      <UIMenu
        id={menuId}
        popover="auto"
        options={options}
        value=""
        style={{
          position: 'fixed',
          positionAnchor: anchor,
          inset: 'auto',
          top: 'anchor(bottom)',
          left: 'anchor(left)',
          margin: '8px 0',
          positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
        }}
        className="max-h-72 overflow-y-auto bg-surface not-open:hidden"
        onSelect={(value) => {
          document.getElementById(menuId)?.hidePopover();
          onSelect(value);
        }}
      />
    </>
  );
};
