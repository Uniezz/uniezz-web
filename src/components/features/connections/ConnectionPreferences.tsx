import type { ConnectionPreferencesFormProps, ConnectionPreferencesProps } from '@/@types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ApiRequestError } from '@/api';
import { useMyConnectionPreferences, useUpdateMyConnectionPreferences } from '@/hooks';
import { UIField, UIQueryError } from '@/ui/components';

export function ConnectionPreferences({ mode, formId, onSaved }: ConnectionPreferencesProps) {
  const { t } = useTranslation();
  const { data: preferences, isPending, isError, refetch } = useMyConnectionPreferences();

  if (isPending) return <p role="status">{t('apiState.loading')}</p>;
  if (isError) return <UIQueryError retry={() => void refetch()} />;

  return (
    <ConnectionPreferencesForm
      preferences={preferences}
      mode={mode}
      formId={formId}
      onSaved={onSaved}
    />
  );
}

function ConnectionPreferencesForm({
  preferences,
  mode,
  formId,
  onSaved,
}: ConnectionPreferencesFormProps) {
  const { t } = useTranslation();
  const { mutateAsync: savePreferences, isPending } = useUpdateMyConnectionPreferences();
  const [birthDate, setBirthDate] = useState(preferences?.birthDate ?? '');
  const [intent, setIntent] = useState(preferences?.intent ?? '');
  async function save() {
    try {
      await savePreferences({
        ...(birthDate ? { birthDate } : {}),
        intent,
        openTo: [mode],
      });
      onSaved();
      toast.success(t('connections.preferencesSaved'));
    } catch (error) {
      const cause = error instanceof ApiRequestError ? error.cause : undefined;
      const needsAdult =
        cause &&
        typeof cause === 'object' &&
        'error' in cause &&
        cause.error === 'dating_requires_adult';
      toast.error(t(needsAdult ? 'connections.datingRequiresAdult' : 'apiState.error'));
    }
  }

  return (
    <form
      id={formId}
      className="space-y-3"
      aria-label={t('connections.preferencesTitle')}
      onSubmit={(event) => {
        event.preventDefault();
        if (!isPending) void save();
      }}
    >
      <h3 className="text-micro font-semibold text-secondary">{t('connections.preferences')}</h3>
      <UIField label={t('connections.birthDate')} hint={t('connections.birthDateHint')}>
        <input
          type="date"
          className="app-control"
          value={birthDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setBirthDate(event.target.value)}
        />
      </UIField>
      <UIField label={t('connections.intent')}>
        <input
          autoComplete="off"
          className="app-control"
          maxLength={200}
          placeholder={t('connections.intentPlaceholder')}
          value={intent}
          onChange={(event) => setIntent(event.target.value)}
        />
      </UIField>
    </form>
  );
}
