import { Building2, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDropdown } from '@/hooks/useDropdown';
import type { PostSchema } from '@/schemas';
import { UIButton, UIMenu, UIUniversityLogo } from '@/ui/components';

type Audience = PostSchema['audience'];

export function PostAudienceSelector({
  audience,
  university,
  universityId,
  onSelect,
  disabled = false,
}: {
  audience: Audience;
  university: string;
  universityId?: string;
  onSelect: (audience: Audience) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();
  const options = [
    {
      value: 'university',
      label: university,
      Icon: Building2,
      universityId,
    },
    {
      value: 'all',
      label: t('app.allUniversities'),
      description: t('app.allUniversitiesHint'),
    },
  ];
  const selected = audience === 'all' ? options[1] : options[0];

  return (
    <div className="flex items-center gap-2">
      <span className="text-micro font-semibold text-secondary">{t('app.university')}</span>
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
          leftIcon={selected.universityId ? undefined : selected.Icon}
          leftIconColor="gray"
          onClick={toggle}
          disabled={disabled}
          aria-label={t('app.university')}
          aria-expanded={isOpen}
          className="h-7 min-h-7 gap-1.5 px-2.5 py-1 text-detail font-medium text-secondary"
        >
          {selected.universityId && (
            <UIUniversityLogo universityId={selected.universityId} size="xs" />
          )}
          {selected.label}
          <ChevronDown size={14} aria-hidden="true" />
        </UIButton>
        {isOpen && (
          <UIMenu
            className="right-auto left-0"
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
