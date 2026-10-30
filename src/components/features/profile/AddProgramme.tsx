import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

import { PROFILEMOCKS } from '@/utils';
import type { Programme } from '@/@types';
import { UIButton, UIDialog, UIField } from '@/ui/components';

export function AddProgramme({
  programmes,
  onAdd,
}: {
  programmes: Programme[];
  onAdd: (programme: Programme) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { register, control, handleSubmit, reset } = useForm<{
    name: string;
  }>({
    defaultValues: { name: 'Informatyka' },
  });
  const name = useWatch({ control, name: 'name' });
  const exists = programmes.some((p) => p.name === name);
  return (
    <>
      <UIButton
        size="sm"
        bg="secondary"
        leftIcon={Plus}
        className="h-9.5 min-h-9.5 px-3 py-0 text-micro"
        onClick={() => {
          reset();
          setOpen(true);
        }}
      >
        {t('app.addProgramme')}
      </UIButton>
      <UIDialog
        open={open}
        onOpenChange={setOpen}
        title={t('app.addProgramme')}
        description={t('app.localOnly')}
      >
        <div className="space-y-4">
          <UIField label={t('app.studyProgrammes')}>
            <select className="app-control" {...register('name', { required: true })}>
              {PROFILEMOCKS.initialProgrammes.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
          </UIField>
          {exists && <p className="text-label text-secondary">{t('app.programmeExists')}</p>}
          <UIButton
            disabled={exists}
            onClick={handleSubmit(({ name }) => {
              const programme = PROFILEMOCKS.initialProgrammes.find((p) => p.name === name);
              if (programme && !programmes.some((p) => p.name === name)) {
                onAdd(programme);
                setOpen(false);
              }
            })}
          >
            {t('app.addProgramme')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
