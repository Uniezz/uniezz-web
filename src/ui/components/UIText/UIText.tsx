import { type VariantProps } from 'class-variance-authority';
import { type ComponentProps, type ElementType } from 'react';
import { cn } from '../../cn';
import { textStyles } from './variants';

type TextElement = Extract<
  ElementType,
  'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>;

export type UITextProps<T extends TextElement = 'p'> = VariantProps<typeof textStyles> &
  Omit<ComponentProps<T>, 'color'> & {
    as?: T;
  };

export const UIText = <T extends TextElement = 'p'>({
  as,
  children,
  size,
  weight,
  color,
  className,
  ...props
}: UITextProps<T>) => {
  const Component = (as ?? 'p') as ElementType;

  return (
    <Component className={cn(textStyles({ size, weight, color }), className)} {...props}>
      {children}
    </Component>
  );
};
