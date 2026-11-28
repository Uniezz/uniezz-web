import { Check, ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropdown } from '@/hooks';
import { cn } from '@/ui/cn';
import { menuStyles } from '@/ui/components/UIMenu/variants';
import { LNG_OPTIONS } from '@/utils';

export type ProfileMenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export type ProfileMenuProps = {
  /** Items before the language entry. */
  items: ProfileMenuItem[];
  /** Destructive items after the language entry. */
  endItems: ProfileMenuItem[];
  onLanguageSelect: (language: string) => void;
};

const itemClass =
  'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-body font-medium outline-none enabled:hover:bg-white-5 focus-visible:ring-2 focus-visible:ring-blue disabled:opacity-40';

/** The mobile app's "More options" menu on the own profile, with its Language submenu. */
export function ProfileMenu({ items, endItems, onLanguageSelect }: ProfileMenuProps) {
  const { t, i18n } = useTranslation();
  const { ref, isOpen, toggle, close } = useDropdown();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const language = i18n.resolvedLanguage ?? i18n.language;
  const handleToggle = () => {
    setIsLanguageOpen(false);
    toggle();
  };
  const select = (item: ProfileMenuItem) => {
    close();
    item.onSelect();
  };
  const renderItem = (item: ProfileMenuItem) => (
    <button
      key={item.id}
      type="button"
      role="menuitem"
      disabled={item.disabled}
      data-ph-capture-attribute-label={item.label}
      onClick={() => select(item)}
      className={cn(itemClass, item.destructive && 'text-red')}
    >
      {item.label}
    </button>
  );
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t('app.moreOptions')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-ph-capture-attribute-label={t('app.moreOptions')}
        onClick={handleToggle}
        className="flex size-11 items-center justify-center rounded-xl glass"
      >
        <Ellipsis size={18} aria-hidden="true" />
      </button>
      {isOpen && (
        <div role="menu" className={menuStyles()}>
          {isLanguageOpen ? (
            <>
              <button
                type="button"
                role="menuitem"
                data-ph-capture-attribute-label={t('app.back')}
                onClick={() => setIsLanguageOpen(false)}
                className={cn(itemClass, 'text-secondary')}
              >
                <ChevronLeft size={16} aria-hidden="true" />
                {t('language.title')}
              </button>
              {LNG_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === language}
                  data-ph-capture-attribute-label={label}
                  onClick={() => {
                    close();
                    onLanguageSelect(value);
                  }}
                  className={itemClass}
                >
                  {Icon && <Icon className="h-4 w-6 shrink-0 rounded-xs" aria-hidden="true" />}
                  <span className="min-w-0 flex-1">{label}</span>
                  {value === language && <Check size={16} aria-hidden="true" />}
                </button>
              ))}
            </>
          ) : (
            <>
              {items.map(renderItem)}
              <button
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                data-ph-capture-attribute-label={t('language.title')}
                onClick={() => setIsLanguageOpen(true)}
                className={itemClass}
              >
                <span className="min-w-0 flex-1">{t('language.title')}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              {endItems.map(renderItem)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
