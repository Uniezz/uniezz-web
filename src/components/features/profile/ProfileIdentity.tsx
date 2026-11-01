import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext, useWatch } from 'react-hook-form';

import { useUniversities } from '@/hooks';
import { UIButton, UILanguageSwitcher, UIPanel, UISwitch, UIUniversityLogo } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';
import { readImageFile } from '@/utils/image';

export function ProfileIdentity({
  universityId,
  onRemoveAvatar,
}: {
  universityId: string;
  onRemoveAvatar: () => Promise<void>;
}) {
  const { data: universities } = useUniversities();
  const { t } = useTranslation();
  const {
    control,
    setValue,
    trigger,
    setError,
    clearErrors,
    formState: { defaultValues, errors },
  } = useFormContext<ProfileFormSchema>();
  const {
    field: { value: photo },
  } = useController({ control, name: 'photo' });
  const {
    field: { onChange: setAvatarFile },
  } = useController({ control, name: 'avatarFile' });
  const privacy = useWatch({ control, name: 'privacy' });
  const [preview, setPreview] = useState('');
  const [readingImage, setReadingImage] = useState(false);
  async function changePhoto(file?: File): Promise<void> {
    if (!file) return;
    setAvatarFile(file);
    if (!(await trigger('avatarFile'))) return;
    setReadingImage(true);
    try {
      setPreview(await readImageFile(file));
      clearErrors('avatarFile');
    } catch {
      setAvatarFile(undefined);
      setError('avatarFile', { type: 'validate', message: t('app.photoError') });
    } finally {
      setReadingImage(false);
    }
  }
  return (
    <div className="space-y-4">
      <UIPanel surface="tint" className="rounded-profile text-center">
        <img
          src={preview || photo}
          alt={`${defaultValues?.first} ${defaultValues?.last}`}
          className="mx-auto mb-4.5 size-22 rounded-full object-cover"
        />
        <h2 className="text-[21px] leading-[1.2] font-bold">
          {defaultValues?.first} {defaultValues?.last}
        </h2>
        <p className="mt-1.25 text-detail font-medium text-balance text-secondary">
          <UIUniversityLogo universityId={universityId} size="xs" className="mr-1.5 align-middle" />
          {universities?.find((item) => item.id === universityId)?.name ??
            universityId.toUpperCase()}
        </p>
        <label className="mt-4.5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-white-10 bg-white-5 px-5 text-detail font-semibold focus-within:outline-2 focus-within:outline-blue">
          {t('app.changePhoto')}
          <input
            type="file"
            disabled={readingImage}
            className="sr-only"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              void changePhoto(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
        {(preview || photo !== '/app/avatar.png') && (
          <UIButton
            bg="transparent"
            size="pill"
            className="mt-2 text-danger"
            disabled={readingImage}
            onClick={async () => {
              try {
                await onRemoveAvatar();
                setPreview('');
                clearErrors('avatarFile');
              } catch {
                toast.error(t('apiState.error'));
              }
            }}
          >
            {t('students.removePhoto')}
          </UIButton>
        )}
        {errors.avatarFile && (
          <p role="alert" className="mt-3 text-detail text-warning">
            {t('app.photoError')}
          </p>
        )}
      </UIPanel>
      <UIPanel surface="tint" className="rounded-profile p-4.5">
        <h2 className="mb-3.5 text-base font-bold">{t('app.profileVisibility')}</h2>
        <div className="space-y-3">
          <UISwitch
            label={t('apiState.showEmail')}
            checked={privacy.showEmail}
            onChange={(value) => setValue('privacy.showEmail', value, { shouldDirty: true })}
          />
          <UISwitch
            label={t('apiState.showFaculty')}
            checked={privacy.showFaculty}
            onChange={(value) => setValue('privacy.showFaculty', value, { shouldDirty: true })}
          />
          <UISwitch
            label={t('apiState.showYear')}
            checked={privacy.showYear}
            onChange={(value) => setValue('privacy.showYear', value, { shouldDirty: true })}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white-10 pt-4">
          <span className="text-detail font-semibold">{t('topbar.changeLanguage')}</span>
          <UILanguageSwitcher />
        </div>
      </UIPanel>
    </div>
  );
}
