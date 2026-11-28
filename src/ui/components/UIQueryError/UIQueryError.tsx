import { useTranslation } from 'react-i18next';
import { UIButton } from '../UIButton';

export type UIQueryErrorProps = { retry?: () => void };

export function UIQueryError({ retry }: UIQueryErrorProps) {
  const { t } = useTranslation();

  return (
    // on a phone, the mobile app's UIQueryError: centred 15px message over a full-width Retry, 12 apart, 20 padding
    <div
      role="alert"
      className="space-y-3 p-4 text-detail text-secondary max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-3 max-lg:space-y-0 max-lg:p-5 max-lg:text-center max-lg:text-body"
    >
      <p>{t('apiState.error')}</p>
      {retry && (
        <UIButton
          bg="secondary"
          size="sm"
          onClick={retry}
          className="max-lg:min-h-12 max-lg:w-full max-lg:text-body max-lg:font-normal"
        >
          {t('apiState.retry')}
        </UIButton>
      )}
    </div>
  );
}
