import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { parsePostTagDraft, postTagAdditionSchema, type PostSchema } from '@/schemas';
import { UIButton } from '@/ui/components';
import { cn } from '@/ui/cn';
import { PostTag } from './PostTag';

export function PostTagsField({
  control,
  phone = false,
}: {
  control: Control<PostSchema>;
  /** The mobile app's tags field: one 30-character tag at a time, removable chips under it. */
  phone?: boolean;
}) {
  const { t } = useTranslation();
  const {
    field: { value: tags, onChange },
  } = useController({ control, name: 'tags' });
  const {
    field: { value: draft, onChange: setDraft, onBlur },
  } = useController({ control, name: 'tagDraft' });
  const draftTags = parsePostTagDraft(draft);
  const next = postTagAdditionSchema.safeParse([...tags, ...draftTags]);

  function addTag() {
    if (!next.success) return;
    onChange(next.data);
    setDraft('');
  }

  if (phone) {
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <label htmlFor="post-tag" className="text-detail font-semibold text-white-80">
            {t('postComposer.tags')}
          </label>
          <span className="text-micro text-secondary">
            {t('postComposer.tagsHint', { used: tags.length })}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            id="post-tag"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={onBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                event.preventDefault();
                addTag();
              }
            }}
            maxLength={30}
            enterKeyHint="done"
            placeholder={t('postComposer.tagsPlaceholder')}
            className="h-12 min-w-0 flex-1 rounded-xl border border-white/12 bg-white/3 px-4 text-base text-white outline-none placeholder:text-white-60"
          />
          <button
            type="button"
            aria-label={t('postComposer.addTag')}
            data-ph-capture-attribute-label={t('postComposer.addTag')}
            disabled={!next.success || draftTags.length === 0}
            onPointerDown={(event) => event.preventDefault()}
            onClick={addTag}
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-full text-ink focus-visible:outline-2 focus-visible:outline-blue',
              next.success && draftTags.length > 0 ? 'bg-white' : 'bg-white-40',
            )}
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <PostTag
                key={tag}
                tag={tag}
                onRemove={() => onChange(tags.filter((item) => item !== tag))}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor="post-tag" className="text-micro font-semibold text-secondary">
        {t('postComposer.tags')}
      </label>
      <div className="flex gap-2">
        <input
          id="post-tag"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && draft.trim() && !event.nativeEvent.isComposing) {
              event.preventDefault();
              addTag();
            }
          }}
          className="app-control flex-1"
          maxLength={319}
          disabled={tags.length >= 10}
          placeholder={t('postComposer.tagsPlaceholder')}
        />
        <UIButton
          size="icon"
          bg="secondary"
          aria-label={t('postComposer.addTag')}
          disabled={!next.success}
          onPointerDown={(event) => event.preventDefault()}
          onClick={addTag}
        >
          <Plus size={18} aria-hidden="true" />
        </UIButton>
      </div>
      <span className="text-detail text-secondary">
        {t('postComposer.tagsHint', { used: tags.length })}
      </span>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="app-hashtag pr-1.5">
              {tag}
              <button
                type="button"
                data-ph-capture-attribute-label="Remove tag"
                aria-label={`${t('app.remove')} ${tag}`}
                className="ml-1.5 rounded-sm text-secondary transition-colors hover:text-danger focus-visible:outline-2 focus-visible:outline-blue"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => onChange(tags.filter((item) => item !== tag))}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
