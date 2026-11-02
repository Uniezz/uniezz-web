import { CalendarDays, ChevronDown, FileText, MessageCircleQuestion } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { PostSchema } from '@/schemas';
import { UIButton, UIMenu } from '@/ui/components';
import { useDropdown } from '@/hooks/useDropdown';

type PostType = PostSchema['type'];

const postTypeOptions = [
  { value: 'announcement', labelKey: 'postComposer.post', Icon: FileText },
  { value: 'question', labelKey: 'app.question', Icon: MessageCircleQuestion },
  { value: 'event', labelKey: 'app.event', Icon: CalendarDays },
] as const;

export function PostTypeSelector({
  type,
  onSelect,
  disabled = false,
  readingImage = false,
}: {
  type: PostType;
  onSelect: (type: PostType) => void;
  disabled?: boolean;
  readingImage?: boolean;
}) {
  const { t } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();
  const selected = postTypeOptions.find((option) => option.value === type) ?? postTypeOptions[0];
  const Icon = selected.Icon;

  return (
    <div className="flex items-center gap-2">
      <span className="text-micro font-semibold text-secondary">{t('postComposer.type')}</span>
      <div
        className="relative flex"
        ref={ref}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            close();
            ref.current?.querySelector('button')?.focus();
          }
        }}
      >
        <UIButton
          size="pill"
          bg="secondary"
          leftIcon={Icon}
          leftIconColor="gray"
          onClick={toggle}
          disabled={disabled || readingImage}
          aria-label={t('postComposer.type')}
          aria-expanded={isOpen}
          className={`min-h-7 gap-1.5 px-2.5 py-1 text-detail font-medium text-secondary ${readingImage && !disabled ? 'disabled:opacity-100' : ''}`}
        >
          {t(selected.labelKey)}
          <ChevronDown size={14} aria-hidden="true" />
        </UIButton>
        {isOpen && (
          <UIMenu
            className="right-auto left-0"
            options={postTypeOptions.map(({ value, labelKey, Icon: OptionIcon }) => ({
              value,
              label: t(labelKey),
              Icon: OptionIcon,
            }))}
            value={type}
            onSelect={(value) => {
              if (value === 'announcement' || value === 'question' || value === 'event') {
                onSelect(value);
                close();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
