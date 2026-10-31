import { useTranslation } from 'react-i18next';
import { emptyStyles } from './variants';

export const UIEmpty = () => {
  const { t } = useTranslation();
  return (
    <p role="status" className={emptyStyles()}>
      {t('app.empty')}
    </p>
  );
};
