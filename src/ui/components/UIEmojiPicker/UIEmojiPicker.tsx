import { EmojiPicker } from 'frimousse';
import { FaceSlightlySmiling } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '../../cn';
import { UIButton } from '../UIButton';
import { emojiPickerStyles, emojiSearchStyles, emojiStyles } from './variants';

export type UIEmojiPickerProps = {
  /** Which edge of the button the picker lines up with; `start` opens it to the right. */
  align?: 'start' | 'end';
  disabled?: boolean;
  className?: string;
};

/** Inserts the picked emoji at the cursor of the nearest surrounding textarea. */
export const UIEmojiPicker = ({ align, disabled, className }: UIEmojiPickerProps) => {
  const { t, i18n } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();

  function insert(emoji: string) {
    const field = ref.current?.parentElement?.closest(':has(textarea)')?.querySelector('textarea');
    if (!field) return;
    field.focus();
    // shortcut: execCommand is deprecated, but it is the only insert that keeps undo history and
    // fires React's onChange for both controlled and register()-ed fields; replace when browsers
    // ship an alternative.
    document.execCommand('insertText', false, emoji);
    close();
  }

  return (
    <div
      ref={ref}
      className={cn('relative flex', className)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <UIButton
        size="icon"
        bg="transparent"
        aria-label={t('app.addEmoji')}
        aria-expanded={isOpen}
        disabled={disabled}
        className="text-secondary transition-colors enabled:hover:bg-transparent enabled:hover:text-white aria-expanded:text-white"
        onClick={toggle}
      >
        <FaceSlightlySmiling size={20} aria-hidden="true" />
      </UIButton>
      {isOpen && (
        <EmojiPicker.Root
          locale={i18n.resolvedLanguage ?? 'en'}
          columns={8}
          onEmojiSelect={({ emoji }) => insert(emoji)}
          className={emojiPickerStyles({ align })}
        >
          <EmojiPicker.Search
            autoFocus
            aria-label={t('app.searchEmoji')}
            placeholder={t('app.searchEmoji')}
            className={emojiSearchStyles()}
          />
          <EmojiPicker.Viewport className="relative flex-1 outline-none">
            <EmojiPicker.Loading className="p-3 text-detail text-secondary">
              {t('apiState.loading')}
            </EmojiPicker.Loading>
            <EmojiPicker.Empty className="p-3 text-detail text-secondary">
              {t('app.noEmoji')}
            </EmojiPicker.Empty>
            <EmojiPicker.List
              components={{
                CategoryHeader: ({ category, ...props }) => (
                  <div
                    {...props}
                    className="rounded-md bg-surface px-2 py-1.5 text-micro font-semibold text-secondary backdrop-blur-xl"
                  >
                    {category.label}
                  </div>
                ),
                Emoji: ({ emoji, ...props }) => (
                  <button type="button" {...props} className={emojiStyles()}>
                    {emoji.emoji}
                  </button>
                ),
              }}
            />
          </EmojiPicker.Viewport>
        </EmojiPicker.Root>
      )}
    </div>
  );
};
