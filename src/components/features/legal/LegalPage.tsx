import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  children?: ReactNode;
};

export function LegalPage({ title, intro, sections, children }: LegalPageProps) {
  const { t, i18n } = useTranslation();
  const isPolish = i18n.resolvedLanguage === 'pl';

  return (
    <div className="bg-app min-h-svh px-4 py-6 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 flex items-center justify-between gap-4 border-b border-white-10 pb-5">
          <Link
            to="/"
            data-ph-capture-attribute-label={isPolish ? 'Wróć na stronę główną' : 'Back to home'}
            className="flex min-h-11 items-center gap-2 text-detail text-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            <img src="/favicon.png" alt="" className="size-8 rounded-lg" />
            <span>{isPolish ? 'Wróć na stronę główną' : 'Back to Uniezz'}</span>
          </Link>
          <span className="text-detail text-secondary">{t('common.appName')}</span>
        </header>

        <main>
          <article className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              <p className="text-body leading-relaxed text-secondary">{intro}</p>
            </div>
            {children}
            <div className="space-y-8">
              {sections.map(({ title: sectionTitle, paragraphs, bullets }) => (
                <section key={sectionTitle} className="space-y-3">
                  <h2 className="text-xl font-semibold">{sectionTitle}</h2>
                  {paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-white-80">
                      {paragraph}
                    </p>
                  ))}
                  {bullets && (
                    <ul className="list-disc space-y-2 pl-6 leading-relaxed text-white-80">
                      {bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </article>
        </main>

        <footer className="mt-16 flex flex-wrap gap-x-5 gap-y-2 border-t border-white-10 pt-5 text-detail text-secondary">
          <Link
            to="/privacy"
            data-ph-capture-attribute-label={isPolish ? 'Polityka prywatności' : 'Privacy policy'}
            className="hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {isPolish ? 'Polityka prywatności' : 'Privacy policy'}
          </Link>
          <Link
            to="/terms"
            data-ph-capture-attribute-label={isPolish ? 'Regulamin' : 'Terms and conditions'}
            className="hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {isPolish ? 'Regulamin' : 'Terms and conditions'}
          </Link>
          <a
            href="mailto:info@madis.it.com"
            data-ph-capture-attribute-label={isPolish ? 'Kontakt' : 'Contact'}
            className="hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {isPolish ? 'Kontakt' : 'Contact'}
          </a>
        </footer>
      </div>
    </div>
  );
}
