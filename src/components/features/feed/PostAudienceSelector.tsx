import { Building2, ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDropdown } from '@/hooks/useDropdown';
import type { PostSchema } from '@/schemas';
import { UIButton, UIMenu } from '@/ui/components';

type Audience = PostSchema['audience'];

export function PostAudienceSelector({
  audience,
  university,
  onSelect,
  disabled = false,
}: {
  audience: Audience;
  university: string;
  onSelect: (audience: Audience) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();
  const options = [
    { value: 'university', label: university, Icon: Building2 },
    { value: 'all', label: t('app.allUniversities'), Icon: Globe },
  ];
  const selected = audience === 'all' ? options[1] : options[0];

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-micro font-semibold text-secondary">{t('app.university')}</span>
      <div
        className="relative"
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
          leftIcon={selected.Icon}
          leftIconColor="gray"
          onClick={toggle}
          disabled={disabled}
          aria-label={t('app.university')}
          aria-expanded={isOpen}
          className="min-h-7 gap-1.5 px-2.5 py-1 text-detail font-medium text-secondary"
        >
          {selected.label}
          <ChevronDown size={14} aria-hidden="true" />
        </UIButton>
        {isOpen && (
          <UIMenu
            options={options}
            value={audience}
            onSelect={(value) => {
              if (value === 'university' || value === 'all') {
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
