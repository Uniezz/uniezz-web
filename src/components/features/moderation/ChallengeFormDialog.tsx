import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChallengeFormDialogProps, ChallengeFormSchema } from '@/@types';
import { useCreateChallenge, useUpdateChallenge } from '@/hooks';
import { challengeBody, challengeUpdateBody } from '@/schemas';
import { UIButton, UIDialog, UIDialogFooter } from '@/ui/components';
import { toast } from '@/utils';
import { ChallengeForm } from './ChallengeForm';

/** Creates a challenge, or edits one. */
export function ChallengeFormDialog({ open, challenge, onClose }: ChallengeFormDialogProps) {
  const { t } = useTranslation();
  const formId = useId();
  const { mutateAsync: createChallenge, isPending: isCreating } = useCreateChallenge();
  const { mutateAsync: updateChallenge, isPending: isUpdating } = useUpdateChallenge();
  const isPending = isCreating || isUpdating;
  const isEditing = Boolean(challenge);

  async function submit(values: ChallengeFormSchema) {
    try {
      if (challenge) {
        await updateChallenge({ id: challenge.id, body: challengeUpdateBody(values, challenge) });
      } else {
        await createChallenge(challengeBody(values));
      }
      toast.success(t('moderation.challengeSaved'));
      onClose();
    } catch {
      toast.error(t('apiState.error'));
    }
  }

  return (
    <UIDialog
      placement="right"
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      dismissible={!isPending}
      title={t(isEditing ? 'moderation.editChallenge' : 'moderation.newChallenge')}
      description={t('moderation.challengeDescription')}
      footer={
        <UIDialogFooter>
          <UIButton bg="secondary" onClick={onClose} disabled={isPending}>
            {t('app.cancel')}
          </UIButton>
          <UIButton type="submit" form={formId} disabled={isPending}>
            {t('moderation.saveChallenge')}
          </UIButton>
        </UIDialogFooter>
      }
    >
      <ChallengeForm id={formId} challenge={challenge} onSubmit={(values) => void submit(values)} />
    </UIDialog>
  );
}
