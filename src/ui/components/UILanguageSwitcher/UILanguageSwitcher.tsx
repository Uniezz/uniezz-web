import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDropdown } from '@/hooks';
import { LNG_OPTIONS } from '@/utils';
import { UIButton } from '../UIButton';
import { UIMenu } from '../UIMenu';

export function UILanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const Flag = LNG_OPTIONS.find((option) => option.value === language)?.Icon;

  return (
    <div className="relative flex" ref={ref}>
      <UIButton
        bg="secondary"
        size="pill"
        onClick={toggle}
        aria-label={t('topbar.changeLanguage')}
        aria-expanded={isOpen}
      >
        {Flag && <Flag className="h-4 w-6 shrink-0 rounded-xs" />}
        {t('topbar.languageCode')}
        <ChevronDown size={14} />
      </UIButton>
      {isOpen && (
        <UIMenu
          options={LNG_OPTIONS}
          value={language}
          onSelect={(language) => {
            void i18n.changeLanguage(language);
            close();
          }}
        />
      )}
    </div>
  );
}
