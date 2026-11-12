import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getStudyFile } from '@/api';
import { UIButton } from '@/ui/components';

export function DownloadStudyFileButton({ fileId }: { fileId: string }) {
  const { t } = useTranslation();
  async function download() {
    // Open synchronously so the browser treats the new tab as part of the click.
    const tab = window.open('about:blank', '_blank');
    try {
      const { url } = await getStudyFile(fileId);
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      }
    } catch {
      tab?.close();
      toast.error(t('apiState.error'));
    }
  }
  return (
    <UIButton
      size="icon"
      bg="secondary"
      aria-label={t('app.download')}
      onClick={() => void download()}
    >
      <Download size={15} />
    </UIButton>
  );
}
