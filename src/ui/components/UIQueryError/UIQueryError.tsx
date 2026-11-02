import { useTranslation } from 'react-i18next';
import { UIButton } from '../UIButton';

export type UIQueryErrorProps = { retry?: () => void };

export function UIQueryError({ retry }: UIQueryErrorProps) {
  const { t } = useTranslation();

  return (
    <div role="alert" className="space-y-3 p-4 text-detail text-secondary">
      <p>{t('apiState.error')}</p>
      {retry && (
        <UIButton bg="secondary" size="sm" onClick={retry}>
          {t('apiState.retry')}
        </UIButton>
      )}
    </div>
  );
}
