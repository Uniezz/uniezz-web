import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useProfileProgrammes } from '@/hooks';
import { useDropdown } from '@/hooks/useDropdown';
import type { components } from '@/@types/schema';
import { UIButton, UIDialog, UIField, UIMenu } from '@/ui/components';
import { addProgrammeSchema } from '@/schemas';

export function AddProgramme({
  programmes,
  faculties,
}: {
  programmes: components['schemas']['Programme'][];
  faculties: string[];
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { saveProgramme, isSaving: isPending } = useProfileProgrammes();
  const { ref, isOpen, toggle, close } = useDropdown();
  const { register, control, handleSubmit, reset, setValue } = useForm<{
    programme: string;
    faculty: string;
  }>({
    resolver: zodResolver(addProgrammeSchema),
    defaultValues: { programme: '', faculty: '' },
  });
  const name = useWatch({ control, name: 'programme' });
  const faculty = useWatch({ control, name: 'faculty' });
  const facultyOptions = faculties
    .filter((item) => item.toLocaleLowerCase().includes(faculty.trim().toLocaleLowerCase()))
    .map((item) => ({ value: item, label: item, Icon: Building2 }));
  const exists = programmes.some(
    (p) => p.programme.toLocaleLowerCase() === name.trim().toLocaleLowerCase(),
  );

  async function addProgramme({ programme, faculty }: { programme: string; faculty: string }) {
    try {
      await saveProgramme({
        programme: {
          programme,
          faculty,
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
        description={t('app.addProgrammeDescription')}
        className="overflow-visible"
      >
        <div className="space-y-4">
          <UIField label={t('app.programme')}>
            <input autoComplete="off" className="app-control" {...register('programme')} />
          </UIField>
          <UIField label={t('app.faculty')}>
            <div
              className="relative"
              ref={ref}
              onKeyDown={(event) => {
                if (event.key === 'Escape') close();
              }}
            >
              <input
                autoComplete="off"
                className="app-control"
                aria-expanded={isOpen}
                onFocus={() => !isOpen && toggle()}
                {...register('faculty', { onChange: () => !isOpen && toggle() })}
              />
              {isOpen && facultyOptions.length > 0 && (
                <UIMenu
                  options={facultyOptions}
                  value={faculty}
                  className="left-0 max-h-60 w-full overflow-y-auto"
                  onSelect={(value) => {
                    setValue('faculty', value, { shouldValidate: true });
                    close();
                  }}
                />
              )}
            </div>
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
