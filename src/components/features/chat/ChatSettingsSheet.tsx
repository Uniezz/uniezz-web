import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { ChatSettings } from '@/@types';
import { useMyChatSettings, useUpdateMyChatSettings } from '@/hooks';
import { UIButton, UIDialog, UIRowGroup } from '@/ui/components';
import { apiErrorKey, toast, WHO_CAN_MESSAGE } from '@/utils';
import { ChatPickerRow } from './ChatPickerRow';

/** The mobile app's chat settings sheet: who may send the student a message request. */
export function ChatSettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { data: settings } = useMyChatSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateMyChatSettings();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ChatSettings>({ values: settings });

  const handleSave = handleSubmit(async (values) => {
    try {
      await updateSettings(values);
      toast.success(t('app.saved'));
      onOpenChange(false);
    } catch (error) {
      toast.error(t(apiErrorKey(error)));
    }
  });
  // a closed sheet drops unsaved changes
  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return (
    <UIDialog
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottom"
      title={t('chat.whoCanMessage')}
      className="max-lg:rounded-t-feature max-lg:bg-surface/85 max-lg:px-4 max-lg:backdrop-blur-xl"
    >
      <UIButton
        size="pill"
        disabled={!isDirty || isPending}
        onClick={() => void handleSave()}
        className="absolute top-3.5 right-14"
      >
        {t('apiState.save')}
      </UIButton>
      <div className="mt-3 flex flex-col gap-4">
        <p className="text-detail text-secondary">{t('chat.whoCanMessageHint')}</p>
        <Controller
          control={control}
          name="whoCanMessage"
          render={({ field }) => (
            <UIRowGroup label={t('chat.whoCanMessage')}>
              {WHO_CAN_MESSAGE.map(([value, label]) => (
                <ChatPickerRow
                  key={value}
                  label={`Who can message: ${value}`}
                  selected={field.value === value}
                  onClick={() => field.onChange(value)}
                >
                  <span className="truncate text-base font-semibold">{t(label)}</span>
                </ChatPickerRow>
              ))}
            </UIRowGroup>
          )}
        />
      </div>
    </UIDialog>
  );
}
