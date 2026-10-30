import { createFileRoute } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { PROFILEMOCKS } from '@/utils';
import { UIButton, UITopbar } from '@/ui/components';
import { profileFormSchema, type ProfileFormSchema } from '@/schemas';
import { ProfileIdentity, PersonalDetails, StudyProgrammes } from '@/components/features/profile';

export const Route = createFileRoute('/_app/profile')({ component: ProfilePage });
function ProfilePage() {
  const { t } = useTranslation();
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first: 'Jan',
      last: 'Kowalski',
      visible: true,
      photo: '/app/avatar.png',
      programmes: PROFILEMOCKS.initialProgrammes,
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isDirty },
  } = form;
  const saved = isSubmitSuccessful && !isDirty;
  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit((data) => {
          reset(data);
          toast.success(t('app.savedLocally'));
        })}
      >
        <UITopbar title={t('app.yourProfile')}>
          <UIButton
            type="submit"
            size="sm"
            leftIcon={Check}
            className="h-9 min-h-9 shrink-0 px-3 py-0 text-detail whitespace-nowrap"
          >
            {saved ? t('app.saved') : t('app.saveChanges')}
          </UIButton>
        </UITopbar>
        <div className="grid items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <ProfileIdentity />
          <div className="space-y-4.5">
            <PersonalDetails />
            <StudyProgrammes />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
