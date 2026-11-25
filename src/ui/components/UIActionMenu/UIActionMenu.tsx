import { Ellipsis } from 'lucide-react';
import { useId } from 'react';

import type { Option } from '@/@types';
import { UIButton } from '../UIButton';
import { UIMenu } from '../UIMenu';

export type UIActionMenuProps = {
  options: Option[];
  onSelect: (value: string) => void;
  /** Accessible name of the button. It is also sent to analytics, so it has no user content. */
  label: string;
  className?: string;
};

/** A "more" button with a menu of actions. The menu is a native popover, like the one in `UISelect`. */
export const UIActionMenu = ({ options, onSelect, label, className }: UIActionMenuProps) => {
  const id = useId();
  const menuId = `action-menu-${id}`;
  const anchor = `--action-${id.replace(/[^\w-]/g, '')}`;

  return (
    <>
      <UIButton
        size="icon"
        bg="plain"
        aria-label={label}
        popoverTarget={menuId}
        style={{ anchorName: anchor }}
        className={className}
      >
        <Ellipsis size={18} aria-hidden="true" />
      </UIButton>
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
