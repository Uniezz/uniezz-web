import { type ComponentProps } from 'react';
import { cn } from '../../cn';

type BrandBackgroundProps = ComponentProps<'div'> & { variant?: 'auth' | 'app' };

export function BrandBackground({ className, variant = 'auth', ...props }: BrandBackgroundProps) {
  return <div className={cn(variant === 'auth' ? 'bg-mesh' : 'bg-app', className)} {...props} />;
}
