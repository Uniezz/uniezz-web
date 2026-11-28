/** The mobile app's StudyRowSkeleton: a glass card with two text bars over two rating bars. */
export function StudyRowSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 rounded-2xl p-3 glass">
      <div className="flex flex-col gap-1.5">
        <span className="h-3.5 w-3/5 animate-pulse rounded-full bg-white-10" />
        <span className="h-2.5 w-2/5 animate-pulse rounded-full bg-white-10" />
      </div>
      <div className="flex justify-between gap-2">
        <span className="h-6 w-22.5 animate-pulse rounded-lg bg-white-10" />
        <span className="h-6 w-30 animate-pulse rounded-lg bg-white-10" />
      </div>
    </div>
  );
}
