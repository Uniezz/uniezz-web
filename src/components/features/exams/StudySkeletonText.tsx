export type StudySkeletonTextProps = { count?: number };

/** The mobile app's UISkeletonText: a few faded text lines while comments or reviews load. */
export function StudySkeletonText({ count = 1 }: StudySkeletonTextProps) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 py-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <span className="h-3 w-4/5 animate-pulse rounded-full bg-white-10" />
          <span className="h-3 w-2/5 animate-pulse rounded-full bg-white-10" />
        </div>
      ))}
    </div>
  );
}
