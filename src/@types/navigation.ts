import { type LinkProps } from '@tanstack/react-router';
import { type ParseKeys } from 'i18next';
import { type LucideIcon } from 'lucide-react';

export type NavItem = {
  to: NonNullable<LinkProps['to']>;
  labelKey: ParseKeys;
  leftIcon: LucideIcon;
};

export type NavGroup = {
  titleKey?: ParseKeys;
  items: NavItem[];
};
