import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useFeatureFlagEnabled } from '@posthog/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { components } from '@/@types/schema';
import type { FeedPostSource } from '@/@types';
import { apiErrorCode } from '@/api';
import { FeedPosts, PostCardSkeleton } from '@/components/features/feed';
import {
  useDeleteAvatar,
  useDeleteBanner,
  useDeleteMyProfile,
  useFeedPosts,
  useScrolledPast,
  useSignOut,
  useUpdateMyProfile,
  useUpdateProfileLanguage,
  useUploadImage,
} from '@/hooks';
import { avatarImageSchema, bannerImageSchema } from '@/schemas';
import { cn } from '@/ui/cn';
import {
  UIAvatar,
  UIButton,
  UICoin,
  UIDialog,
  UIEmpty,
  UIQueryError,
  UISubTabs,
  UIUniversityLogo,
} from '@/ui/components';
import { authorName, formatCompactNumber, isStaff, toast } from '@/utils';
import { PersonalDetailsSheet } from './PersonalDetailsSheet';
import { PrivacySheet } from './PrivacySheet';
import { ProfileMenu, type ProfileMenuItem } from './ProfileMenu';
import { ProfilePhoneHero } from './ProfilePhoneHero';
import { ProfilePhotos } from './ProfilePhotos';
import { ProgrammeSummaryCard } from './ProgrammeSummaryCard';
import { ProgrammesSheet } from './ProgrammesSheet';

type Profile = components['schemas']['Profile'];
type Sheet = 'details' | 'programmes' | 'privacy' | null;

const postTabs = ['posts', 'liked', 'saved'] as const satisfies readonly FeedPostSource[];
// the header's height under the safe area: 44px row plus its 12px bottom padding
const HEADER_HEIGHT = 56;

/** The mobile app's own profile screen: a pushed screen without the bottom tabs. */
export function OwnProfilePhone({ profile }: { profile: Profile }) {
  const { t, i18n } = useTranslation();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tab, setTab] = useState<(typeof postTabs)[number]>('posts');
  const bannerInput = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadImage('avatar');
  const { mutateAsync: uploadBanner, isPending: isUploadingBanner } = useUploadImage('banner');
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { mutate: updateLanguage } = useUpdateProfileLanguage();
  const { mutateAsync: deleteAvatar, isPending: isRemovingPhoto } = useDeleteAvatar();
  const { mutateAsync: deleteBanner, isPending: isRemovingBanner } = useDeleteBanner();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const { mutateAsync: deleteProfile, isPending: isDeletingProfile } = useDeleteMyProfile();

  const postFilters = tab === 'posts' ? { authorId: profile.id } : undefined;
  // the same query FeedPosts runs, so each tab can say what it lacks
  const {
    data: posts,
    isPending: arePostsPending,
    isSuccess: arePostsLoaded,
  } = useFeedPosts({ ...postFilters, q: undefined }, tab);
  const arePostsEmpty = arePostsLoaded && (posts.pages[0]?.items?.length ?? 0) === 0;
  const emptyMessages = {
    posts: t('students.noPosts'),
    liked: t('students.noLikedPosts'),
    saved: t('students.noSavedPosts'),
  };
  const saved = () => toast.success(t('app.saved'));
  const failed = () => toast.error(t('apiState.profileSaveError'));
  // the app uploads a picked photo or banner right away
  const handleChangePhoto = async (file: File) => {
    if (!avatarImageSchema.safeParse(file).success) return toast.error(t('app.photoError'));
    try {
      const { mediaId } = await uploadAvatar(file);
      await updateProfile({ avatarMediaId: mediaId });
      saved();
    } catch {
      failed();
    }
  };
  const handleChangeBanner = async (file: File) => {
    if (!bannerImageSchema.safeParse(file).success) return toast.error(t('app.bannerError'));
    try {
      const { mediaId } = await uploadBanner(file);
      await updateProfile({ bannerMediaId: mediaId });
      saved();
    } catch {
      failed();
    }
  };
  const run = (action: () => Promise<unknown>) => async () => {
    try {
      await action();
      saved();
    } catch {
      failed();
    }
  };
  const handleLanguageSelect = (language: string) => {
    void i18n.changeLanguage(language);
    // saved in the background so push notifications come in this language too
    updateLanguage(language);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteProfile();
    } catch (error) {
      toast.error(
        t(
          apiErrorCode(error) === 'reauthentication_required'
            ? 'auth.reauthenticateToDelete'
            : 'apiState.error',
        ),
      );
    }
  };
  const handleTabChange = (next: (typeof postTabs)[number]) => {
    setTab(next);
    // the overview stays where it is; a list scrolled past it starts at the tabs
    const tabs = tabsRef.current;
    if (!tabs) return;
    const pinnedAt = tabs.offsetTop - HEADER_HEIGHT;
    if (window.scrollY > pinnedAt) window.scrollTo(0, pinnedAt);
  };

  const items: ProfileMenuItem[] = [
    { id: 'details', label: t('app.personalDetails'), onSelect: () => setSheet('details') },
    { id: 'programmes', label: t('study.programmes'), onSelect: () => setSheet('programmes') },
    { id: 'privacy', label: t('app.profileVisibility'), onSelect: () => setSheet('privacy') },
    {
      id: 'changeBanner',
      label: t('app.changeBanner'),
      disabled: isUploadingBanner,
      onSelect: () => bannerInput.current?.click(),
    },
    // moderation is web-only, so staff reach it from here on a phone
    ...(isStaff(profile)
      ? [
          {
            id: 'moderation',
            label: t('moderation.title'),
            onSelect: () => void navigate({ to: '/moderation' }),
          },
        ]
      : []),
  ];
  const endItems: ProfileMenuItem[] = [
    ...(profile.avatarUrl && !isRemovingPhoto
      ? [
          {
            id: 'removePhoto',
            label: t('students.removePhoto'),
            destructive: true,
            onSelect: () => void run(deleteAvatar)(),
          },
        ]
      : []),
    ...(profile.bannerUrl && !isRemovingBanner && !isUploadingBanner
      ? [
          {
            id: 'removeBanner',
            label: t('students.removeBanner'),
            destructive: true,
            onSelect: () => void run(deleteBanner)(),
          },
        ]
      : []),
    {
      id: 'logout',
      label: t('auth.logOut'),
      destructive: true,
      disabled: isSigningOut,
      onSelect: () => signOut(undefined, { onError: () => toast.error(t('apiState.error')) }),
    },
    {
      id: 'deleteProfile',
      label: t('auth.deleteAccount'),
      destructive: true,
      disabled: isDeletingProfile,
      onSelect: () => setIsDeleteOpen(true),
    },
  ];
  const tabLabels = {
    posts: t('students.posts'),
    liked: t('students.liked'),
    saved: t('students.saved'),
  };

  return (
    <div data-hide-bottom-tabs className="-mx-4 -mt-6 px-5">
      <ProfilePhoneHeader
        profile={profile}
        action={
          <>
            <CoinBalance coins={profile.coins} />
            <ProfileMenu
              items={items}
              endItems={endItems}
              onLanguageSelect={handleLanguageSelect}
            />
          </>
        }
      />
      <input
        ref={bannerInput}
        type="file"
        aria-label={t('app.changeBanner')}
        tabIndex={-1}
        className="sr-only"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) void handleChangeBanner(file);
        }}
      />
      <div className="flex flex-col gap-5 pb-3">
        <ProfilePhoneHero
          profile={profile}
          isUploadingPhoto={isUploadingAvatar || isUpdating}
          onChangePhoto={(file) => void handleChangePhoto(file)}
        />
        <ProfilePhotos />
        {profile.programmes && profile.programmes.length > 0 && (
          <section className="flex flex-col gap-3" aria-label={t('study.programmes')}>
            <h2 className="text-section font-semibold">{t('study.programmes')}</h2>
            {profile.programmes.map((programme) => (
              <ProgrammeSummaryCard key={programme.id} programme={programme} />
            ))}
          </section>
        )}
      </div>
      <PinnedTabs tabsRef={tabsRef}>
        <UISubTabs
          tabs={postTabs.map((id) => ({ id, label: tabLabels[id] }))}
          value={tab}
          onChange={handleTabChange}
          label={t('students.posts')}
          idPrefix="profile-posts"
          className="gap-0 border-white-10 px-4 [&>button]:text-label"
        />
      </PinnedTabs>
      <div
        id="profile-posts-tab-panel"
        role="tabpanel"
        aria-labelledby={`profile-posts-tab-${tab}`}
        className="pt-4 pb-15"
      >
        {arePostsPending ? (
          // the app's profile list loads with two placeholder posts
          <div className="flex flex-col gap-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : arePostsEmpty ? (
          <UIEmpty>
            <p>{emptyMessages[tab]}</p>
          </UIEmpty>
        ) : (
          <FeedPosts key={tab} search="" filters={postFilters} source={tab} />
        )}
      </div>
      <PersonalDetailsSheet
        profile={profile}
        open={sheet === 'details'}
        onClose={() => setSheet(null)}
      />
      <ProgrammesSheet
        open={sheet === 'programmes'}
        onClose={() => setSheet(null)}
        programmes={profile.programmes ?? []}
        universityId={profile.universityId}
      />
      <PrivacySheet profile={profile} open={sheet === 'privacy'} onClose={() => setSheet(null)} />
      <UIDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        dismissible={!isDeletingProfile}
        title={t('auth.deleteAccountTitle')}
        description={t('auth.deleteAccountDescription')}
      >
        <div className="flex justify-end gap-3">
          <UIButton
            bg="secondary"
            disabled={isDeletingProfile}
            onClick={() => setIsDeleteOpen(false)}
          >
            {t('app.cancel')}
          </UIButton>
          <UIButton
            bg="danger"
            disabled={isDeletingProfile}
            onClick={() => void handleDeleteConfirm()}
          >
            {t('auth.deleteAccount')}
          </UIButton>
        </div>
      </UIDialog>
    </div>
  );
}

/** The mobile app's ProfileHeader: back, a small title that turns into the student once scrolled. */
export function ProfilePhoneHeader({
  profile,
  action,
  title,
}: {
  profile?: Pick<Profile, 'avatarUrl' | 'firstName' | 'lastName' | 'universityId'>;
  action?: ReactNode;
  /** Defaults to "Profile"; a student's profile says "Student profile". */
  title?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const navigate = useNavigate();
  const isScrolled = useScrolledPast(8);
  const handleBack = () =>
    window.history.length > 1 ? router.history.back() : void navigate({ to: '/feed' });
  return (
    <header
      data-compact={isScrolled || undefined}
      className={cn(
        'sticky top-0 isolate z-30 -mx-5 px-5 pt-[max(8px,env(safe-area-inset-top))] pb-3',
        'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-ink-40 before:opacity-0 before:backdrop-blur-xl before:transition-opacity data-compact:before:opacity-100',
      )}
    >
      <div className="flex h-11 items-center gap-3.5">
        <UIButton
          size="square"
          bg="glass"
          aria-label={t('app.back')}
          data-ph-capture-attribute-label="Go back"
          onClick={handleBack}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </UIButton>
        <div className="relative h-full min-w-0 flex-1">
          <h1
            className={cn(
              'absolute inset-0 flex items-center truncate text-body font-semibold transition-[opacity,translate] motion-reduce:transition-none',
              isScrolled && '-translate-y-2.5 opacity-0',
            )}
          >
            {title ?? t('app.profile')}
          </h1>
          {profile && (
            <div
              aria-hidden={!isScrolled}
              className={cn(
                'absolute inset-0 flex items-center gap-2 transition-[opacity,translate] motion-reduce:transition-none',
                !isScrolled && 'translate-y-2.5 opacity-0',
              )}
            >
              <UIAvatar size="mobileSm" imgSrc={profile.avatarUrl ?? '/app/avatar.png'} />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-body font-semibold">
                  {authorName(profile) || t('apiState.student')}
                </span>
                <span className="flex min-w-0 items-center gap-1 text-micro font-medium text-secondary">
                  <UIUniversityLogo universityId={profile.universityId} size="xs" />
                  <span className="truncate">{profile.universityId.toUpperCase()}</span>
                </span>
              </div>
            </div>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}

/** The mobile app's CoinBalance: opens rewards; hidden while the coins flag is off. */
function CoinBalance({ coins }: { coins: number }) {
  const { t, i18n } = useTranslation();
  const isEnabled = useFeatureFlagEnabled('coins') !== false;
  if (!isEnabled) return null;
  return (
    <Link
      to="/rewards"
      data-ph-capture-attribute-label={t('rewards.title')}
      aria-label={`${t('rewards.balance')}: ${coins}`}
      className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-body font-semibold glass"
    >
      <UICoin className="size-4.5" />
      {formatCompactNumber(coins, i18n.resolvedLanguage)}
    </Link>
  );
}

/** Sticks the post tabs under the header; the blurred backdrop shows only while they are pinned. */
function PinnedTabs({
  tabsRef,
  children,
}: {
  tabsRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  useEffect(() => {
    const element = sentinel.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPinned(entry ? !entry.isIntersecting : false),
      { rootMargin: `-${HEADER_HEIGHT + 8}px 0px 0px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div ref={sentinel} aria-hidden="true" />
      <div
        ref={tabsRef}
        className={cn(
          'sticky top-[calc(max(8px,env(safe-area-inset-top))+56px)] z-20 -mx-5 pb-1.5',
          isPinned && 'bg-ink-40 backdrop-blur-xl',
        )}
      >
        {children}
      </div>
    </>
  );
}

export function ProfilePhoneError({ retry, title }: { retry: () => void; title?: string }) {
  return (
    <div data-hide-bottom-tabs className="-mx-4 -mt-6 px-5">
      <ProfilePhoneHeader title={title} />
      <div className="p-5 text-center">
        <UIQueryError retry={retry} />
      </div>
    </div>
  );
}

/** The mobile app's ProfileHeroSkeleton under the header while the profile loads. */
export function ProfilePhoneSkeleton({ title }: { title?: string }) {
  const { t } = useTranslation();
  return (
    <div data-hide-bottom-tabs className="-mx-4 -mt-6 px-5">
      <ProfilePhoneHeader title={title} />
      <div
        role="status"
        aria-label={t('apiState.loading')}
        className="flex flex-col items-center gap-3.5 py-6"
      >
        <span className="size-28 animate-pulse rounded-full bg-white-10" />
        <span className="h-5.5 w-[55%] animate-pulse rounded-full bg-white-10" />
        <span className="h-3 w-[35%] animate-pulse rounded-full bg-white-10" />
      </div>
    </div>
  );
}
