import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { panelStyles } from './variants';

export type UIPanelProps = ComponentProps<'section'> & { surface?: 'glass' | 'tint' };
export const UIPanel = ({ surface = 'glass', className, ...props }: UIPanelProps) => {
  return <section className={cn(panelStyles({ surface }), className)} {...props} />;
};
