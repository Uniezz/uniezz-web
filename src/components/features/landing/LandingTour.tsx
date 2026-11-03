import { useLandingScroll } from '@/hooks/useLandingScroll';
import { useTranslation } from 'react-i18next';
import { LandingFeedPreview } from './LandingFeedPreview';
import { LandingPeoplePreview } from './LandingPeoplePreview';
import { LandingProfilePreview } from './LandingProfilePreview';
import { LandingChatPreview } from './LandingChatPreview';
import { LandingStudyPreview } from './LandingStudyPreview';
import { LandingFaqPreview } from './LandingFaqPreview';

const chapters = [
  { id: 'feed', label: 'feed.title', Preview: LandingFeedPreview },
  {
    id: 'people',
    label: 'connections.title',
    Preview: LandingPeoplePreview,
  },
  {
    id: 'profile',
    label: 'app.profile',
    Preview: LandingProfilePreview,
  },
  { id: 'chat', label: 'chat.title', Preview: LandingChatPreview },
  { id: 'study', label: 'exams.title', Preview: LandingStudyPreview },
  { id: 'faq', label: 'faq.title', Preview: LandingFaqPreview },
] as const;

export function LandingTour() {
  const { t } = useTranslation();
  const { ref, activeStep, isPinned } = useLandingScroll(chapters.length);
  const goToChapter = (index: number) => {
    const section = ref.current;
    if (!section) return;
    if (!isPinned) {
      section.querySelector(`#tour-${chapters[index].id}`)?.scrollIntoView({ behavior: 'auto' });
      return;
    }
    const distance =
      section.offsetHeight - (section.firstElementChild?.clientHeight ?? window.innerHeight - 80);
    const top = section.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top: top + (distance * (index + 0.3)) / chapters.length,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={ref}
      id="explore"
      className="landing-tour"
      aria-label={t('landing.tour.navigation')}
    >
      <div className="landing-tour-stage landing-container">
        <div className="landing-tour-scenes">
          {chapters.map(({ id, label, Preview }, index) => (
            <article
              key={id}
              id={`tour-${id}`}
              className="landing-tour-scene"
              data-active={activeStep === index}
              aria-hidden={isPinned && activeStep !== index ? true : undefined}
              inert={isPinned && activeStep !== index}
            >
              <div className="landing-tour-copy">
                <p className="mb-5 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-mono tracking-widest text-sky">{t(label)}</span>
                </p>
                <h2 className="landing-display">{t(`landing.tour.${id}.title`)}</h2>
                <p className="mt-6 max-w-100 text-base leading-relaxed text-secondary">
                  {t(`landing.tour.${id}.body`)}
                </p>
              </div>
              <div className="landing-tour-product">
                <Preview />
              </div>
            </article>
          ))}
        </div>
        <nav aria-label={t('landing.tour.navigation')} className="landing-tour-tabs">
          {chapters.map(({ id, label }, index) => (
            <button
              key={id}
              type="button"
              onClick={() => goToChapter(index)}
              aria-current={isPinned && activeStep === index ? 'step' : undefined}
              className="landing-chapter-link"
            >
              <span>{t(label)}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
