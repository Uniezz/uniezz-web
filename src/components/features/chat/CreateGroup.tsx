import { useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UIButton, UIAvatar, UIField, UISearch } from '@/ui/components';
import { CHATMOCKS, matchesSearch } from '@/utils';
import { groupSchema, type GroupSchema } from '@/schemas';

const avatarForMember = (name: string): string => {
  const image = CHATMOCKS.initialConversations.find(
    (conversation) => conversation.name === name,
  )?.image;
  return image ? `/app/rPsdQ-${image}.jpg` : '/app/avatar.png';
};

export function CreateGroup({
  onBack,
  onCreate,
}: {
  onBack: () => void;
  onCreate: (name: string, members: string[], imageUrl?: string) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<GroupSchema>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: '', members: ['Kateryna Melnyk', 'Taras Hnatiuk'] },
  });
  const members = useWatch({ control, name: 'members' });
  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-5"
      onSubmit={handleSubmit(({ name, members }) => onCreate(name, members, imageUrl || undefined))}
    >
      <div className="flex items-center gap-3">
        <UIButton size="icon" bg="transparent" onClick={onBack} aria-label={t('app.back')}>
          <ArrowLeft size={18} />
        </UIButton>
        <h2 className="flex-1 text-card-title font-semibold">{t('chat.action')}</h2>
        <label className="cursor-pointer rounded-full">
          <UIAvatar size="regular" imgSrc={imageUrl || '/app/avatar.png'} alt="" />
          <input
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp"
            aria-label={t('app.changePhoto')}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              if (
                !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
                file.size > 5 * 1024 * 1024
              ) {
                setImageError(t('app.photoError'));
                return;
              }
              const reader = new FileReader();
              reader.onerror = () => setImageError(t('app.photoError'));
              reader.onload = () => {
                if (typeof reader.result !== 'string') return;
                const preview = new Image();
                preview.onerror = () => setImageError(t('app.photoError'));
                preview.onload = () => {
                  setImageUrl(reader.result as string);
                  setImageError('');
                };
                preview.src = reader.result;
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>
      <p className="text-label text-secondary">{t('app.groupDescription')}</p>
      {imageError && (
        <p role="alert" className="text-detail text-danger">
          {imageError}
        </p>
      )}
      <UIField
        label={t('app.groupName')}
        error={errors.name ? t('app.required') : undefined}
        className="gap-2 [&>span]:text-base [&>span]:font-semibold [&>span]:text-white"
      >
        <input
          className="app-control"
          {...register('name')}
          maxLength={80}
          placeholder={t('app.groupPlaceholder')}
          spellCheck={false}
        />
      </UIField>
      <h3 className="text-base font-semibold">{t('app.addPeople')}</h3>
      <UISearch
        value={search}
        onChange={setSearch}
        label={t('app.searchStudents')}
        className="rounded-xl"
      />
      <div className="grid grid-cols-[repeat(auto-fill,12rem)] gap-2">
        {members.map((name) => (
          <div
            key={name}
            className="flex min-w-0 items-center gap-2 overflow-hidden rounded-full border border-transparent bg-white-10 px-2 py-1 text-detail text-white"
          >
            <UIAvatar
              className="shrink-0"
              size="sm"
              imgSrc={avatarForMember(name)}
              alt=""
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{name}</span>
            <button
              type="button"
              aria-label={`${t('app.remove')} ${name}`}
              onClick={() =>
                setValue(
                  'members',
                  members.filter((member) => member !== name),
                )
              }
              className="flex size-6 items-center justify-center rounded-full text-white-60 transition-colors hover:text-red focus-visible:outline-2 focus-visible:outline-blue"
            >
              <Minus size={14} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-caption font-semibold text-muted uppercase">{t('app.suggested')}</p>
      <div className="scrollbar-gray min-h-0 flex-1 space-y-4 overflow-y-auto">
        {CHATMOCKS.students
          .filter((s) => !members.includes(s.name) && matchesSearch(search, s.name, s.meta))
          .map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <UIAvatar size="md" imgSrc={avatarForMember(s.name)} alt="" aria-hidden="true" />
                <div className="min-w-0">
                  <strong className="text-label font-medium">{s.name}</strong>
                  <p className="text-micro text-muted">{s.meta}</p>
                </div>
              </div>
              <UIButton
                bg="transparent"
                size="icon"
                aria-label={`${t('app.add')} ${s.name}`}
                className="group border-transparent bg-transparent enabled:hover:border-transparent enabled:hover:bg-transparent"
                onClick={() => setValue('members', [...members, s.name])}
              >
                <Plus size={16} className="transition-transform group-hover:scale-125" />
              </UIButton>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-start gap-3">
        {errors.members && (
          <p className="text-detail text-danger" role="alert">
            {t('app.minimumMembers')}
          </p>
        )}
        <UIButton
          type="submit"
          bg="primary"
          size="sm"
          className="rounded-xl text-ink enabled:hover:bg-white"
        >
          {t('app.createGroup')}
        </UIButton>
      </div>
    </form>
  );
}
