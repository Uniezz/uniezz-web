import { type ComponentType } from 'react';

export type LngOption = {
  value: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};
