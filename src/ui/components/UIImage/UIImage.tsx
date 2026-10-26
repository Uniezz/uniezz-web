import { type VariantProps } from 'class-variance-authority';
import { Image, Loader } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '../../cn';
import { UIText } from '../UIText';
import { imageStyles } from './variants';

type UIImageProps = VariantProps<typeof imageStyles> &
  Omit<ComponentProps<'img'>, 'src'> & {
    imageSrc?: string;
    isLoading?: boolean;
  };

export const UIImage = ({
  imageSrc,
  aspect,
  isLoading,
  alt = '',
  className,
  ...props
}: UIImageProps) => {
  return (
    <div
      className={cn(
        imageStyles({ aspect }),
        'flex items-center justify-center border border-white/10 bg-surface',
        className,
      )}
    >
      {isLoading ? (
        <Loader className="text-muted" />
      ) : imageSrc ? (
        <img src={imageSrc} alt={alt} className={imageStyles({ aspect })} {...props} />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Image size={24} className="text-secondary" />
          <UIText color="secondary" size="xs">
            No image
          </UIText>
        </div>
      )}
    </div>
  );
};
