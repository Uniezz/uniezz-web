import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import type { FeedComment } from '@/@types';
import { useUpdateFeedComment } from '@/hooks';
import { UIButton, UIEmojiPicker } from '@/ui/components';
import { commentSchema } from '@/schemas';

export function FeedCommentEditor({
  comment,
  onClose,
}: {
  comment: FeedComment;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [content, setContent] = useState(comment.content ?? '');
  const { mutateAsync: updateComment, isPending } = useUpdateFeedComment();

  return (
    <form
      className="mt-2 space-y-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const result = commentSchema.safeParse(content);
        if (!result.success) return;
        try {
          await updateComment({ id: comment.id, content: result.data });
          onClose();
        } catch {
          toast.error(t('apiState.error'));
        }
      }}
    >
      <textarea
        autoFocus
        className="app-control min-h-20 resize-y"
        aria-label={t('apiState.editComment')}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={1000}
        disabled={isPending}
      />
      <div className="flex gap-3">
        <UIEmojiPicker align="start" disabled={isPending} />
        <UIButton type="submit" size="sm" disabled={isPending || !content.trim()}>
          {t('app.saveChanges')}
        </UIButton>
        <UIButton bg="secondary" size="sm" disabled={isPending} onClick={onClose}>
          {t('postComposer.cancel')}
        </UIButton>
      </div>
    </form>
  );
}
