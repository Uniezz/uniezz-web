import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../cn';
import { UIInput } from '../UIInput';
import { searchStyles } from './variants';

export type UISearchProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  hideIcon?: boolean;
  hideClearButton?: boolean;
};
export const UISearch = ({
  value,
  onChange,
  label,
  className,
  hideIcon = false,
  hideClearButton = false,
}: UISearchProps) => {
  const { t } = useTranslation();
  return (
    <UIInput
      type="search"
      text={value}
      onTextChange={onChange}
      iconLeft={hideIcon ? undefined : Search}
      aria-label={label}
      placeholder={label}
      clearButton={
        hideClearButton ? undefined : { label: t('app.clearSearch'), onClear: () => onChange('') }
      }
      className={cn(searchStyles(), className)}
    />
  );
};
