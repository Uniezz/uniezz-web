import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { postTagAdditionSchema, type PostSchema } from '@/schemas';
import { UIButton } from '@/ui/components';

export function PostTagsField({ control }: { control: Control<PostSchema> }) {
  const { t } = useTranslation();
  const {
    field: { value: tags, onChange },
  } = useController({ control, name: 'tags' });
  const {
    field: { value: draft, onChange: setDraft, onBlur },
  } = useController({ control, name: 'tagDraft' });
  const next = postTagAdditionSchema.safeParse([...tags, draft]);

  function addTag() {
    if (!next.success) return;
    onChange(next.data);
    setDraft('');
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
          maxLength={30}
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
            <span key={tag} className="app-tag inline-flex items-center gap-2">
              {tag}
              <button
                type="button"
                aria-label={`${t('app.remove')} ${tag}`}
                className="rounded-sm text-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-blue"
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
