import { ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDropdown } from '@/hooks/useDropdown';
import { LNG_OPTIONS } from '@/utils';
import { UIButton } from '../UIButton';
import { UIMenu } from '../UIMenu';

export function UILanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();

  return (
    <div className="relative" ref={ref}>
      <UIButton
        leftIconColor="white"
        leftIcon={Globe}
        bg="secondary"
        size="pill"
        onClick={toggle}
        aria-label={t('topbar.changeLanguage')}
        aria-expanded={isOpen}
      >
        {t('topbar.languageCode')}
        <ChevronDown size={14} />
      </UIButton>
      {isOpen && (
        <UIMenu
          options={LNG_OPTIONS}
          value={i18n.resolvedLanguage ?? i18n.language}
          onSelect={(language) => {
            void i18n.changeLanguage(language);
            close();
          }}
        />
      )}
    </div>
  );
}
