import { cn } from '@/ui/cn';

/** The mobile app's InterestChips: 13px medium soft chips on white-5 with a white-10 border. */
export function InterestChips({
  interests,
  label,
  wrap = false,
}: {
  interests: string[];
  label: string;
  /** wraps onto lines, as on a profile; otherwise one row that scrolls sideways under edge fades */
  wrap?: boolean;
}) {
  return (
    <ul
      aria-label={label}
      className={cn(
        'flex gap-2',
        wrap
          ? 'flex-wrap'
          : '-mx-3.5 scrollbar-hidden overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_14px,black_calc(100%-14px),transparent)] px-3.5',
      )}
    >
      {interests.map((interest) => (
        <li
          key={interest}
          className="shrink-0 rounded-full border border-white-10 bg-white-5 px-2.75 py-1.25 text-detail font-medium whitespace-nowrap text-white-80"
        >
          {interest}
        </li>
      ))}
    </ul>
  );
}
