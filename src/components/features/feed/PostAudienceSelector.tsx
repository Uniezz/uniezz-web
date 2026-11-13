import { useTranslation } from 'react-i18next';

import type { PostSchema } from '@/schemas';
import { UISelect } from '@/ui/components';

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
  const options = [
    {
      value: 'university',
      label: university,
      universityId,
    },
    {
      value: 'all',
      label: t('app.allUniversities'),
      description: t('app.allUniversitiesHint'),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-micro font-semibold text-secondary">{t('app.university')}</span>
      <UISelect
        label={t('app.university')}
        value={audience}
        options={options}
        disabled={disabled}
        className="h-7 min-h-7 w-auto rounded-full border border-white-10 bg-white-5 px-2.5 py-1 text-detail font-medium text-secondary hover:bg-white-10"
        onChange={(value) => {
          if (value === 'university' || value === 'all') onSelect(value);
        }}
      />
    </div>
  );
}
