import { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TableVirtuoso } from 'react-virtuoso';
import { useSearch } from '@tanstack/react-router';
import type { StudyFile } from '@/@types';
import { fixedTable, tableCellTextClass, tableHeaderCellClass } from '@/ui/virtuoso';
import { DownloadStudyFileButton } from './DownloadStudyFileButton';
import { studyFileTypeLabels } from '@/utils';
import { useDeleteStudyFile, useMyProfile, useStudyFiles } from '@/hooks';
import { UIButton, UIDialog, UIEmpty, UIPanel, UIQueryError } from '@/ui/components';

// Name columns share the spare width; the rest fit their longest label in every language.
const columnWidths = ['', '10rem', '9rem', '6.5rem'];
const tableComponents = fixedTable(columnWidths);

export function MaterialTable() {
  const { t, i18n } = useTranslation();
  const { tab, university, semester, q } = useSearch({ from: '/_app/exams' });
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useStudyFiles({ q, universityId: university, semester, mine: tab === 'mine' || undefined });
  const { data: me } = useMyProfile();
  const [toDelete, setToDelete] = useState<StudyFile | null>(null);
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteStudyFile();
  const files = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const date = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' });

  return (
    <UIPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
      {!isPending && !isError && files.length === 0 ? (
        <UIEmpty />
      ) : (
        <div className="min-h-0 min-w-0 flex-1 overflow-x-auto">
          <div className="flex h-full min-w-[640px] flex-col">
            <table className="w-full table-fixed text-left text-body">
              <colgroup>
                {columnWidths.map((width, index) => (
                  <col key={index} style={width ? { width } : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {[t('postComposer.title'), t('app.type'), t('feed.date'), t('app.actions')].map(
                    (label) => (
                      <th key={label} scope="col" className={tableHeaderCellClass}>
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
            </table>
            <TableVirtuoso
              data={files}
              computeItemKey={(_, file) => file.id}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
              }}
              className="scrollbar-gray min-h-0 flex-1"
              components={tableComponents}
              aria-label={t(tab === 'mine' ? 'app.myUploads' : 'app.pastPapers')}
              itemContent={(_, file) => (
                <>
                  <td className="border-t border-white-5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="shrink-0 text-secondary" aria-hidden="true" />
                      <span className="font-semibold">{file.title}</span>
                    </div>
                  </td>
                  <td className={tableCellTextClass}>{t(studyFileTypeLabels[file.type])}</td>
                  <td className={tableCellTextClass}>{date.format(new Date(file.createdAt))}</td>
                  <td className="border-t border-white-5 px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <DownloadStudyFileButton fileId={file.id} />
                      {me?.id === file.authorId && (
                        <UIButton
                          size="icon"
                          bg="secondary"
                          aria-label={t('exams.deleteFile')}
                          className="text-danger"
                          onClick={() => setToDelete(file)}
                        >
                          <Trash2 size={15} />
                        </UIButton>
                      )}
                    </div>
                  </td>
                </>
              )}
            />
          </div>
        </div>
      )}
      {isError && <UIQueryError retry={() => void refetch()} />}
      <UIDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t('exams.deleteFileTitle')}
        description={t('exams.deleteFileDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" disabled={isDeleting} onClick={() => setToDelete(null)}>
            {t('postComposer.cancel')}
          </UIButton>
          <UIButton
            bg="danger"
            disabled={isDeleting}
            onClick={() =>
              toDelete &&
              deleteFile(toDelete.id, {
                onSuccess: () => {
                  setToDelete(null);
                  toast.success(t('exams.fileDeleted'));
                },
                onError: () => toast.error(t('apiState.error')),
              })
            }
          >
            {t('app.remove')}
          </UIButton>
        </div>
      </UIDialog>
    </UIPanel>
  );
}
