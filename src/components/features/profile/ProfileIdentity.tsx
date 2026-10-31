import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext, useWatch } from 'react-hook-form';

// TODO(api): Replace mock identity details with API-backed profile data.
import { PROFILEMOCKS } from '@/utils';
import { UILanguageSwitcher, UIPanel, UISwitch } from '@/ui/components';
import { type ProfileFormSchema } from '@/schemas';

export function ProfileIdentity() {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { defaultValues },
  } = useFormContext<ProfileFormSchema>();
  const photo = useWatch({ control, name: 'photo' });
  const { field: visibility } = useController({ control, name: 'visible' });
  const [photoError, setPhotoError] = useState('');
  function changePhoto(file?: File): void {
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setPhotoError(t('app.photoError'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setPhotoError(t('app.photoError'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const data = reader.result;
      const image = new Image();
      image.onerror = () => setPhotoError(t('app.photoError'));
      image.onload = () => {
        setValue('photo', data, { shouldDirty: true, shouldValidate: true });
        setPhotoError('');
      };
      image.src = data;
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className="space-y-4">
      <UIPanel surface="tint" className="rounded-profile text-center">
        <img
          src={photo}
          alt={`${defaultValues?.first} ${defaultValues?.last}`}
          className="mx-auto mb-4.5 size-22 rounded-full object-cover"
        />
        <h2 className="text-[21px] leading-[1.2] font-bold">
          {defaultValues?.first} {defaultValues?.last}
        </h2>
        <p className="mt-1.25 text-detail font-medium text-secondary">{PROFILEMOCKS.university}</p>
        <label className="mt-4.5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-white-10 bg-white-5 px-5 text-detail font-semibold focus-within:outline-2 focus-within:outline-blue">
          {t('app.changePhoto')}
          <input
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              changePhoto(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
        {photoError && (
          <p role="alert" className="mt-3 text-detail text-danger">
            {photoError}
          </p>
        )}
      </UIPanel>
      <UIPanel surface="tint" className="rounded-profile p-4.5">
        <h2 className="mb-3.5 text-base font-bold">{t('app.profileVisibility')}</h2>
        <p className="mb-3.5 text-detail leading-[1.35] text-secondary">
          {t('app.visibilityDescription')}
        </p>
        <UISwitch
          label={t('app.visibleToStudents')}
          checked={visibility.value}
          onChange={visibility.onChange}
        />
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white-10 pt-4">
          <span className="text-detail font-semibold">{t('topbar.changeLanguage')}</span>
          <UILanguageSwitcher />
        </div>
      </UIPanel>
    </div>
  );
}
