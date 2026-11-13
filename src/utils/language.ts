import BY from 'country-flag-icons/react/3x2/BY';
import DE from 'country-flag-icons/react/3x2/DE';
import ES from 'country-flag-icons/react/3x2/ES';
import GB from 'country-flag-icons/react/3x2/GB';
import PL from 'country-flag-icons/react/3x2/PL';
import RU from 'country-flag-icons/react/3x2/RU';
import UA from 'country-flag-icons/react/3x2/UA';
import { type Option } from '@/@types';

export const LNG_OPTIONS: Option[] = [
  { value: 'pl', label: 'Polski', Icon: PL },
  { value: 'uk', label: 'Українська', Icon: UA },
  { value: 'ru', label: 'Русский', Icon: RU },
  { value: 'be', label: 'Беларуская', Icon: BY },
  { value: 'es', label: 'Español', Icon: ES },
  { value: 'de', label: 'Deutsch', Icon: DE },
  { value: 'en', label: 'English', Icon: GB },
];
