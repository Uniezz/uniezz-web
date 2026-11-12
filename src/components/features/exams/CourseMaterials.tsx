import { useTranslation } from 'react-i18next';
import { useCourseFiles } from '@/hooks';
import { UIButton, UIQueryError } from '@/ui/components';
import { studyFileTypeLabels } from '@/utils';
import { DownloadStudyFileButton } from './DownloadStudyFileButton';

export function CourseMaterials({ courseId }: { courseId: string }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCourseFiles(courseId);
  const files = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  return (
    <section className="space-y-3" aria-label={t('courses.materials')}>
      <h3 className="text-section font-semibold">{t('courses.materials')}</h3>
      {isPending && <p role="status">{t('apiState.loading')}</p>}
      {!isPending && !isError && files.length === 0 && (
        <p className="text-secondary">{t('courses.noMaterials')}</p>
      )}
      <ul className="divide-y divide-white-10">
        {files.map((file) => (
          <li key={file.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-semibold wrap-anywhere">{file.title}</p>
              <p className="text-detail text-secondary">{t(studyFileTypeLabels[file.type])}</p>
            </div>
            <DownloadStudyFileButton fileId={file.id} />
          </li>
        ))}
      </ul>
      {isError && <UIQueryError retry={() => void refetch()} />}
      {hasNextPage && !isError && (
        <UIButton
          size="sm"
          bg="secondary"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
          data-ph-capture-attribute-label="Load more course materials"
        >
          {t('apiState.loadMore')}
        </UIButton>
      )}
    </section>
  );
}
