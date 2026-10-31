import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Message, Conversation } from '@/@types';
import { cn } from '@/ui/cn';
import { UIAvatar, UIButton, UIEmpty, UIPanel } from '@/ui/components';
import { textFormSchema, type TextFormSchema } from '@/schemas';
// TODO(api): Replace mock chat status and context content with API-backed conversation data.
import { CHATMOCKS } from '@/utils';

export function ChatThread({
  current,
  onBack,
  onSend,
}: {
  current: Conversation;
  onBack: () => void;
  onSend: (message: Message) => void;
}) {
  const { t } = useTranslation();
  const { register, control, handleSubmit, reset } = useForm<TextFormSchema>({
    resolver: zodResolver(textFormSchema),
    defaultValues: { text: '' },
    mode: 'onChange',
  });
  const [isMultiline, setIsMultiline] = useState(false);
  const messageDraft = useWatch({ control, name: 'text' });
  const submit = handleSubmit(({ text }) => {
    onSend({
      text,
      outgoing: true,
      time: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(),
      ),
    });
    reset({ text: '' });
    setIsMultiline(false);
  });
  return (
    <UIPanel className="flex h-full min-h-0 flex-col p-0">
      <div className="flex items-center gap-3 border-b border-white-5 px-5 py-4">
        <UIButton
          bg="transparent"
          size="icon"
          className="md:hidden"
          aria-label={t('app.back')}
          onClick={onBack}
        >
          <ArrowLeft size={18} />
        </UIButton>
        <UIAvatar
          imgSrc={
            current.imageUrl || (current.image ? `/app/rPsdQ-${current.image}.jpg` : undefined)
          }
          avatarSymbols={current.name.slice(0, 2)}
        />
        <div>
          <h2 className="text-section font-semibold">{current.name}</h2>
          {current.name === 'Kateryna Melnyk' && (
            <p className="text-detail text-secondary">{CHATMOCKS.status}</p>
          )}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-auto px-7 py-5">
        <div className="space-y-2.5 overflow-auto" role="log" aria-label={t('app.messages')}>
          {current.name === 'Kateryna Melnyk' && (
            <>
              <LinkToHousing />
              <p className="text-center text-detail text-muted">{t('app.todayLabel')}</p>
            </>
          )}
          {current.messages.map((m, i) => (
            <div key={i} className={`flex ${m.outgoing ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-story px-3.5 py-2.5 text-body leading-[1.4] md:max-w-[420px] ${m.outgoing ? 'rounded-br-[6px] bg-blue' : 'rounded-bl-[6px] border border-white-10 bg-white-10'}`}
              >
                <p className="break-words whitespace-pre-wrap">{m.text}</p>
                <span
                  className={`mt-1 block text-right text-caption ${m.outgoing ? 'text-white-80' : 'text-secondary'}`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
          {current.messages.length === 0 && <UIEmpty />}
          {current.name === 'Kateryna Melnyk' && (
            <p className="text-detail text-muted">
              {CHATMOCKS.typing} {t('app.typing')}
            </p>
          )}
        </div>
      </div>
      <form
        className={cn(
          'relative mx-5 mb-5 flex items-end border border-white-10 bg-white-5 p-2 pr-12 pl-4',
          isMultiline ? 'rounded-2xl' : 'rounded-full',
        )}
        onSubmit={submit}
      >
        <textarea
          aria-label={t('app.message')}
          {...register('text')}
          onInput={(event) => setIsMultiline(event.currentTarget.scrollHeight > 48)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              void submit();
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder={t('app.writeMessage')}
          className="field-sizing-content max-h-32 min-h-9.5 min-w-0 flex-1 resize-none bg-transparent p-2 text-body leading-[1.4] outline-none placeholder:text-secondary"
        />
        {messageDraft?.trim() && (
          <UIButton
            type="submit"
            size="icon"
            bg="secondary"
            leftIcon={Send}
            aria-label={t('app.send')}
            className={cn(
              'absolute right-1.5 border-transparent',
              isMultiline ? 'bottom-1.5' : 'top-1/2 -translate-y-1/2',
            )}
          >
            {''}
          </UIButton>
        )}
      </form>
    </UIPanel>
  );
}

function LinkToHousing() {
  return (
    <a
      href="/feed"
      className="mx-auto block max-w-xs rounded-2xl border border-white-10 bg-white-5 p-2 text-micro text-secondary"
    >
      {CHATMOCKS.context}
      <br />
      <strong className="text-label text-white">{CHATMOCKS.housing}</strong>
    </a>
  );
}
