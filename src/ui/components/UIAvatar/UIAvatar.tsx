import { type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { avatarStatusStyles, avatarStyles, avatarTextStyles } from './variants';

export type UIAvatarProps = Omit<VariantProps<typeof avatarStyles>, 'withImage'> &
  ComponentProps<'div'> & {
    imgSrc?: string;
    avatarSymbols?: string;
    isOnline?: boolean;
    alt?: string;
  };

export const UIAvatar = ({
  imgSrc,
  size,
  avatarSymbols,
  isOnline = false,
  alt,
  className,
  ...props
}: UIAvatarProps) => {
  const withImage = Boolean(imgSrc);

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div className={avatarStyles({ size, withImage })}>
        {withImage ? (
          <img
            src={imgSrc}
            alt={alt ?? avatarSymbols ?? ''}
            className="h-full w-full object-cover"
          />
        ) : avatarSymbols ? (
          <span className={avatarTextStyles({ size })}>{avatarSymbols}</span>
        ) : null}
      </div>
      {isOnline ? <div className={avatarStatusStyles({ size })} /> : null}
    </div>
  );
};
