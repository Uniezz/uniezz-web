import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { apiErrorCode } from '@/api';
import { useMyConnectionPreferences, useUpdateMyConnectionPreferences } from '@/hooks';
import { birthDateSchema, type BirthDateFormSchema } from '@/schemas';
import { UIButton, UIDialog } from '@/ui/components';
import { apiErrorKey, DEFAULT_OPEN_TO, toast, toCalendarDay } from '@/utils';

/**
 * Phone-only: the mobile app's BirthDateSheet. Discovery stays locked until the birth date is set,
 * and it can be set only once. Save sits in the sheet's header; closing just dismisses.
 */
export function BirthDateSheet({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  /** closing without saving */
  onOpenChange: (open: boolean) => void;
  /** the birth date was saved; the caller closes the sheet */
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const today = new Date();
  // the picker opens on a typical student's year, so picking needs no long scroll back
  const startDate = toCalendarDay(
    new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
  );
  const { data: preferences } = useMyConnectionPreferences();
  const { mutateAsync: savePreferences, isPending } = useUpdateMyConnectionPreferences();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthDateFormSchema>({
    resolver: zodResolver(birthDateSchema),
    defaultValues: { birthDate: startDate },
  });

  const handleSave = handleSubmit(async ({ birthDate }) => {
    try {
      // a new student is open to nothing, so the deck would stay empty until the filters are saved
      const openTo = preferences?.openTo?.length ? undefined : [...DEFAULT_OPEN_TO];
      await savePreferences({ birthDate, openTo });
      toast.success(t('connections.ageSubmitted'));
      onSaved();
    } catch (error) {
      const immutable = apiErrorCode(error) === 'birth_date_immutable';
      toast.error(t(immutable ? 'connections.birthDateImmutable' : apiErrorKey(error)));
    }
  });

  return (
    <UIDialog
      open={open}
      onOpenChange={onOpenChange}
      dismissible={!isPending}
      placement="bottom"
      title={t('connections.birthDate')}
      className="max-lg:rounded-t-feature max-lg:bg-surface/85 max-lg:px-4 max-lg:backdrop-blur-xl"
    >
      <UIButton
        size="pill"
        disabled={isPending}
        onClick={() => void handleSave()}
        className="absolute top-3.5 right-14"
      >
        {t('apiState.save')}
      </UIButton>
      <div className="mt-3 flex flex-col gap-4">
        <p className="text-detail text-secondary">{t('connections.birthDateHint')}</p>
        <label className="flex items-center justify-between gap-3">
          <span className="text-body font-semibold">{t('connections.birthDate')}</span>
          <input
            type="date"
            className="app-control w-auto scheme-dark"
            max={toCalendarDay(today)}
            aria-invalid={Boolean(errors.birthDate)}
            {...register('birthDate')}
          />
        </label>
        {errors.birthDate && (
          <p role="alert" className="text-detail text-red">
            {t('connections.birthDateInvalid')}
          </p>
        )}
        <p className="text-detail font-medium text-red">{t('connections.birthDateOnce')}</p>
      </div>
    </UIDialog>
  );
}
