import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudyFile } from '@/@types';
import { useDeleteStudyFile, useStudyFiles } from '@/hooks';
import { UIButton, UIDialog } from '@/ui/components';
import { apiErrorKey, toast } from '@/utils';
import type { StudyPhonePageProps } from './CoursesPhonePage';
import { StudyFilePhoneRow } from './StudyFilePhoneRow';
import { StudyPhoneList } from './StudyPhoneList';

/** The mobile app's My materials page: the student's own files, each with a trash button. */
export function FilesPhonePage({ query, universityId, semester }: StudyPhonePageProps) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useStudyFiles({ q: query || undefined, universityId, semester, mine: true });
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteStudyFile();
  const [toDelete, setToDelete] = useState<StudyFile | null>(null);
  const files = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const handleOpenChange = (open: boolean) => {
    if (!open) setToDelete(null);
  };
  const handleCancel = () => setToDelete(null);
  const handleRemove = () =>
    toDelete &&
    deleteFile(toDelete.id, {
      onSuccess: () => {
        setToDelete(null);
        toast.success(t('exams.fileDeleted'));
      },
      onError: (error) => toast.error(t(apiErrorKey(error))),
    });
  return (
    <>
      <StudyPhoneList
        label={t('study.tabMyMaterials')}
        isPending={isPending}
        isError={isError}
        isEmpty={files.length === 0}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        refetch={refetch}
      >
        {files.map((file) => (
          <StudyFilePhoneRow key={file.id} file={file} onDelete={setToDelete} />
        ))}
      </StudyPhoneList>
      <UIDialog
        open={toDelete !== null}
        onOpenChange={handleOpenChange}
        dismissible={!isDeleting}
        title={t('study.deleteFileTitle')}
        description={t('study.deleteFileDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={handleCancel}>
            {t('app.cancel')}
          </UIButton>
          <UIButton bg="danger" disabled={isDeleting} onClick={handleRemove}>
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
