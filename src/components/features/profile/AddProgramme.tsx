import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useProfileProgrammes } from '@/hooks';
import type { components } from '@/@types/schema';
import { UIButton, UIDialog, UIField } from '@/ui/components';

export function AddProgramme({ programmes }: { programmes: components['schemas']['Programme'][] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { saveProgramme, isSaving: isPending } = useProfileProgrammes();
  const { register, control, handleSubmit, reset } = useForm<{ name: string; faculty: string }>({
    defaultValues: { name: '', faculty: '' },
  });
  const name = useWatch({ control, name: 'name' });
  const exists = programmes.some(
    (p) => p.programme.toLocaleLowerCase() === name.trim().toLocaleLowerCase(),
  );

  async function addProgramme({ name, faculty }: { name: string; faculty: string }) {
    try {
      await saveProgramme({
        programme: {
          programme: name.trim(),
          faculty: faculty.trim(),
          yearOfStudy: null,
          isPrimary: programmes.length === 0,
          status: 'active',
          level: null,
          modeOfStudies: null,
        },
      });
      toast.success(t('app.saved'));
      setOpen(false);
    } catch {
      toast.error(t('apiState.profileSaveError'));
    }
  }

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
        description={t('app.studyProgrammes')}
      >
        <div className="space-y-4">
          <UIField label={t('app.studyProgrammes')}>
            <input
              autoComplete="off"
              className="app-control"
              {...register('name', { required: true, validate: (value) => Boolean(value.trim()) })}
            />
          </UIField>
          <UIField label={t('app.faculty')}>
            <input
              autoComplete="off"
              className="app-control"
              {...register('faculty', {
                required: true,
                validate: (value) => Boolean(value.trim()),
              })}
            />
          </UIField>
          {exists && <p className="text-label text-secondary">{t('app.programmeExists')}</p>}
          <UIButton disabled={exists || isPending} onClick={handleSubmit(addProgramme)}>
            {t('app.addProgramme')}
          </UIButton>
        </div>
      </UIDialog>
    </>
  );
}
