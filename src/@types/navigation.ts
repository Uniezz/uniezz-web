import { type LinkProps } from '@tanstack/react-router';
import { type ParseKeys } from 'i18next';
import { type ComponentType } from 'react';

export type NavItem = {
  to: NonNullable<LinkProps['to']>;
  labelKey: ParseKeys;
  /** A Lucide icon or any icon that takes the same `size` and `className`. */
  leftIcon: ComponentType<{ size?: number; className?: string }>;
  /** `amber`: the label turns amber while the item is active (Rewards). */
  tone?: 'amber';
};

export type NavGroup = {
  section?: string;
  items: NavItem[];
};
