import { ArrowUp, Search } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { searchOverlayBarStyles, searchOverlayStyles, searchOverlaySubmitStyles } from './variants';

export type UISearchOverlayProps = {
  isOpen: boolean;
  value: string;
  onChangeText: (value: string) => void;
  /** runs the search; only on submit, not per keystroke */
  onSubmit: () => void;
  /** the field lost focus; the screen closes the overlay */
  onClose: () => void;
  placeholder: string;
  submitLabel: string;
};

/** Phone-only search field pinned above the keyboard over a blurred screen, as in the mobile app. */
export const UISearchOverlay = ({
  isOpen,
  value,
  onChangeText,
  onSubmit,
  onClose,
  placeholder,
  submitLabel,
}: UISearchOverlayProps) => {
  if (!isOpen) return null;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
    // as the app's keyboard search key: submitting dismisses the keyboard, which closes the overlay
    event.currentTarget.querySelector('input')?.blur();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') event.currentTarget.blur();
  };
  // keeps focus in the field, so pressing submit doesn't blur and close before the search runs
  const keepFocus = (event: PointerEvent) => event.preventDefault();
  // iOS Safari keeps focus when a non-focusable area is tapped, so the backdrop closes itself
  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };
  return (
    <div className={searchOverlayStyles()} onPointerDown={handleBackdropPointerDown}>
      <form role="search" onSubmit={handleSubmit} className={searchOverlayBarStyles()}>
        <Search size={17} className="shrink-0 text-white-60" aria-hidden />
        <input
          autoFocus
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChangeText(event.target.value)}
          onBlur={onClose}
          onKeyDown={handleKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-body text-white outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          aria-label={submitLabel}
          data-ph-capture-attribute-label={submitLabel}
          onPointerDown={keepFocus}
          className={searchOverlaySubmitStyles()}
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
};
