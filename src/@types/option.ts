import { type ComponentType } from 'react';

export type Option = {
  value: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};
