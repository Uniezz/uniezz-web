import type { PreviewStudyFileButtonProps } from '@/@types';
import { lazy, Suspense, useState } from 'react';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getStudyFile } from '@/api';
import { UIButton, UIDialog } from '@/ui/components';
import { studyFileTypeLabels } from '@/utils';

const CourseFileViewer = lazy(() => import('./CourseFileViewer'));

export function PreviewStudyFileButton({ file }: PreviewStudyFileButtonProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function preview() {
    setIsLoading(true);
    try {
      const { url } = await getStudyFile(file.id);
      setUrl(url);
    } catch {
      toast.error(t('apiState.error'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <UIButton
        size="icon"
        bg="transparent"
        className="border-0 text-secondary enabled:hover:bg-transparent enabled:hover:text-white"
        aria-label={`${t('courses.previewMaterial')}: ${file.title}`}
        data-ph-capture-attribute-label="Preview material"
        aria-busy={isLoading}
        disabled={isLoading}
        onClick={() => void preview()}
      >
        <Eye size={15} aria-hidden="true" />
      </UIButton>
      <UIDialog
        open={Boolean(url)}
        onOpenChange={(open) => !open && setUrl('')}
        placement="right"
        className="max-w-3xl"
        title={file.title}
        description={t(studyFileTypeLabels[file.type])}
      >
        {url && (
          <Suspense fallback={<p role="status">{t('apiState.loading')}</p>}>
            <CourseFileViewer url={url} />
          </Suspense>
        )}
      </UIDialog>
    </>
  );
}
