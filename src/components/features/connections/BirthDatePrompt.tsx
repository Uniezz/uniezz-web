import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/utils';
import { useMyConnectionPreferences, useUpdateMyConnectionPreferences } from '@/hooks';
import { birthDateSchema, type BirthDateFormSchema } from '@/schemas';
import { UIButton, UIDialog, UIField } from '@/ui/components';

/** Asks for the birth date once, when connection preferences have none. */
export function BirthDatePrompt() {
  const { t } = useTranslation();
  const { history, navigate } = useRouter();
  const { data: preferences } = useMyConnectionPreferences();
  const { mutateAsync: savePreferences, isPending } = useUpdateMyConnectionPreferences();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthDateFormSchema>({
    resolver: zodResolver(birthDateSchema),
    defaultValues: { birthDate: '' },
  });
  const [dismissed, setDismissed] = useState(false);
  const open = Boolean(preferences && !preferences.birthDate && !dismissed);

  // Connections need a birth date, so skipping the prompt leaves the page.
  function leave() {
    setDismissed(true);
    if (history.canGoBack()) history.back();
    else void navigate({ to: '/feed', search: { postFrom: undefined }, replace: true });
  }

  async function submit(values: BirthDateFormSchema) {
    try {
      await savePreferences(values);
      setDismissed(true);
      toast.success(t('connections.ageSubmitted'));
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <UIDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) leave();
      }}
      dismissible={!isPending}
      title={t('connections.birthDate')}
      description={t('connections.birthDateHint')}
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <UIField
          label={t('connections.birthDate')}
          error={errors.birthDate ? t('connections.birthDateInvalid') : undefined}
        >
          <input
            type="date"
            className="app-control [color-scheme:dark]"
            max={new Date().toISOString().slice(0, 10)}
            {...register('birthDate')}
          />
        </UIField>
        <p className="text-label font-medium text-warning">{t('connections.birthDateOnce')}</p>
        <div className="flex justify-end gap-3">
          <UIButton bg="secondary" onClick={leave} disabled={isPending}>
            {t('app.cancel')}
          </UIButton>
          <UIButton type="submit" disabled={isPending}>
            {t('app.save')}
          </UIButton>
        </div>
      </form>
    </UIDialog>
  );
}
