import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UIButton } from '@/ui/components';
import { type UploadSchema } from '@/schemas';
import { UploadMaterial } from './UploadMaterial';

export function UploadMaterialButton({ onSubmit }: { onSubmit: (data: UploadSchema) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <UIButton size="sm" leftIcon={Upload} onClick={() => setOpen(true)}>
        {t('exams.action')}
      </UIButton>
      {open && (
        <UploadMaterial
          onClose={() => setOpen(false)}
          onSubmit={(material) => {
            onSubmit(material);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
