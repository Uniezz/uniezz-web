import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../cn';
import { universityLogoStyles } from './variants';

export type UIUniversityLogoProps = VariantProps<typeof universityLogoStyles> & {
  universityId: string;
  className?: string;
};

export const UIUniversityLogo = ({ universityId, size, className }: UIUniversityLogoProps) => (
  <span className={cn(universityLogoStyles({ size }), className)} aria-hidden="true">
    {universityId.toUpperCase().slice(0, 3)}
    {/* A missing logo hides itself, leaving the short name underneath, as on the login page. */}
    <img
      src={`/universities/${universityId}.png`}
      alt=""
      className="absolute inset-0 size-full bg-white object-contain p-[12%]"
      onError={(event) => (event.currentTarget.hidden = true)}
    />
  </span>
);
