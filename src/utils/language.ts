import GB from 'country-flag-icons/react/3x2/GB';
import PL from 'country-flag-icons/react/3x2/PL';
import RU from 'country-flag-icons/react/3x2/RU';
import UA from 'country-flag-icons/react/3x2/UA';
import { type LngOption } from '@/types';

export const LNG_OPTIONS: LngOption[] = [
  { value: 'pl', label: 'Polski', Icon: PL },
  { value: 'uk', label: 'Українська', Icon: UA },
  { value: 'ru', label: 'Русский', Icon: RU },
  { value: 'en', label: 'English', Icon: GB },
];
