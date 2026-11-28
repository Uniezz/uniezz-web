import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import { useProfileForm } from '@/hooks';
import { UISwitch } from '@/ui/components';
import { apiErrorKey, toast } from '@/utils';
import { ProfileFormSheet } from './ProfileFormSheet';

export type PrivacySheetProps = {
  profile: components['schemas']['Profile'];
  open: boolean;
  onClose: () => void;
};

const PRIVACY_SETTINGS = [
  ['showEmail', 'apiState.showEmail'],
  ['showFaculty', 'apiState.showFaculty'],
  ['showYear', 'apiState.showYear'],
] as const;

/** The mobile app's PrivacySheet: three switch rows with their own Save. */
export function PrivacySheet({ profile, open, onClose }: PrivacySheetProps) {
  const { t } = useTranslation();
  const { form, saveProfile, isDirty, isPending } = useProfileForm(profile);
  const { control, reset, getValues } = form;
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleSave = async () => {
    try {
      await saveProfile(getValues());
      toast.success(t('app.saved'));
      onClose();
    } catch (error) {
      toast.error(t(apiErrorKey(error, 'apiState.profileSaveError')));
    }
  };
  return (
    <ProfileFormSheet
      open={open}
      onClose={handleClose}
      title={t('app.profileVisibility')}
      isDirty={isDirty && !isPending}
      actionLabel={t('app.save')}
      isActionDisabled={!isDirty || isPending}
      onAction={() => void handleSave()}
    >
      <div className="-mt-3.5 flex flex-col divide-y divide-white-5">
        {PRIVACY_SETTINGS.map(([key, label]) => (
          <Controller
            key={key}
            control={control}
            name={`privacy.${key}`}
            render={({ field }) => (
              <UISwitch
                label={t(label)}
                checked={field.value}
                onChange={field.onChange}
                // the app's rows: 15px medium labels, at least 52px tall
                className="min-h-13 gap-3 [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-body [&>span]:font-medium"
              />
            )}
          />
        ))}
      </div>
    </ProfileFormSheet>
  );
}
