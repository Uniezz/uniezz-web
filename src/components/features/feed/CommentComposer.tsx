import { ArrowUp, X } from 'lucide-react';
import { type FormEvent, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

/** The mobile app's comment composer, pinned to the bottom of the post screen on a phone. */
export function CommentComposer({
  value,
  onChange,
  onSubmit,
  isSending,
  canSend,
  banner,
  onCancel,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSending: boolean;
  canSend: boolean;
  /** "Replying to X" or "Edit comment", with an ✕ that cancels it */
  banner?: string;
  onCancel: () => void;
  inputRef: Ref<HTMLTextAreaElement>;
}) {
  const { t } = useTranslation();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 z-30 -mx-4 mt-auto -mb-4 flex flex-col gap-2 bg-ink px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      {banner && (
        <div className="flex items-center gap-2 px-1">
          <span className="min-w-0 flex-1 truncate text-detail text-secondary">{banner}</span>
          <button
            type="button"
            aria-label={t('postComposer.cancel')}
            data-ph-capture-attribute-label="Cancel comment reply or edit"
            onPointerDown={(event) => event.preventDefault()}
            onClick={onCancel}
            className="-m-2 p-2 text-white-60 focus-visible:outline-2 focus-visible:outline-blue"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        {/* a plain multiline field, as the app's: Return adds a line, only Send sends */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={1}
          maxLength={1000}
          autoComplete="off"
          aria-label={t('app.addComment')}
          placeholder={t('app.addComment')}
          className="field-sizing-content max-h-30 min-h-12 min-w-0 flex-1 resize-none rounded-3xl border border-white/14 bg-white-5 px-4 py-3 text-base leading-[22px] text-white outline-none placeholder:text-white-60"
        />
        <button
          type="submit"
          disabled={isSending || !canSend}
          aria-label={t('app.send')}
          data-ph-capture-attribute-label={t('app.send')}
          onPointerDown={(event) => event.preventDefault()}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
