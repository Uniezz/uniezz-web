import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, BookOpen, MapPin, NotebookPen } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';
import { type MouseEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Glow, ParallaxImage, RiseLine } from '@/components';
import { useUniversities } from '@/hooks';
import { UIButton } from '@/ui/components';
import {
  APP_STORES,
  drawLine,
  EASE_OUT,
  fadeUp,
  inViewGroup,
  LNG_OPTIONS,
  riseIn,
  wipeUp,
} from '@/utils';

export const Route = createFileRoute('/')({ component: LandingPage });

const arrowHover =
  'transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5';
const navLink =
  'relative py-1 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100';

function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: universities = [] } = useUniversities();
  const stubRef = useRef<HTMLDivElement>(null);
  const help = [
    { title: t('landing.help.borrowTitle'), body: t('landing.help.borrowBody'), Icon: BookOpen },
    { title: t('landing.help.shareTitle'), body: t('landing.help.shareBody'), Icon: NotebookPen },
    { title: t('landing.help.cityTitle'), body: t('landing.help.cityBody'), Icon: MapPin },
  ];
  const steps = [
    { title: t('landing.steps.universityTitle'), body: t('landing.steps.universityBody') },
    { title: t('landing.steps.verifyTitle'), body: t('landing.steps.verifyBody') },
    { title: t('landing.steps.connectTitle'), body: t('landing.steps.connectBody') },
  ];

  const tearPass = async () => {
    const stub = stubRef.current;
    if (stub && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await stub.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: 'translate(-6px, 4px) rotate(-1.5deg)', opacity: 1, offset: 0.25 },
          { transform: 'translate(40px, 160px) rotate(9deg)', opacity: 0 },
        ],
        { duration: 700, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' },
      ).finished;
    }
    navigate({ to: '/login' });
  };

  const scrollToSection = (event: MouseEvent<HTMLElement>) => {
    const href = (event.target as Element).closest('a')?.getAttribute('href');
    if (!href?.startsWith('#')) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh overflow-x-clip bg-[#0c0d14] text-white select-none">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-60 bg-grain opacity-[0.06] mix-blend-overlay"
        />
        <motion.header
          onClick={scrollToSection}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="sticky top-0 z-50 flex h-19 items-center justify-between border-b border-white/5 bg-[#0c0d14]/80 px-6 backdrop-blur-xl md:h-22 md:px-14"
        >
          <a
            href="#life"
            aria-label={t('common.appName')}
            className="inline-flex rounded-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#a9baff]"
          >
            <img src="/favicon.png" alt="" className="size-10 rounded-lg object-cover" />
          </a>
          <nav
            aria-label={t('landing.navigation')}
            className="hidden items-center gap-8 text-sm text-white/60 md:flex"
          >
            <a className={navLink} href="#life">
              {t('landing.navLife')}
            </a>
            <a className={navLink} href="#community">
              {t('landing.navCommunity')}
            </a>
            <a className={navLink} href="#join">
              {t('landing.navJoin')}
            </a>
          </nav>
          <UIButton navigateTo="/login" size="sm" className="group gap-2">
            {t('landing.signIn')} <ArrowUpRight size={15} className={arrowHover} aria-hidden />
          </UIButton>
        </motion.header>

        <main>
          <section
            id="life"
            className="relative h-215 scroll-mt-19 overflow-hidden bg-[#0c0d14] md:h-205 md:scroll-mt-22"
          >
            <Glow className="-top-[15%] -left-[10%] bg-[#3655dc]/30" />
            <div className="absolute inset-x-0 top-48 h-135 md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[58%]">
              <ParallaxImage
                src="/landing/hero.jpg"
                fetchPriority="high"
                className="object-[56%_center] md:object-center"
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 1, scale: 1.16 }}
                transition={{ duration: 2.2, ease: EASE_OUT }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d14] via-transparent to-[#0c0d14] md:bg-gradient-to-r md:from-[#0c0d14] md:via-[#0c0d14]/50 md:to-transparent" />
              <div className="absolute inset-0 hidden bg-gradient-to-t from-[#0c0d14] via-transparent to-transparent md:block" />
            </div>
            <div className="relative z-10 px-6 pt-8 md:px-14 md:pt-14">
              <motion.p
                {...fadeUp(0.1)}
                className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#a9baff] md:text-[11px]"
              >
                {t('landing.hero.eyebrow')}
              </motion.p>
              <h1 className="mt-7 max-w-255 text-[clamp(50px,8.75vw,126px)] leading-[0.95] font-medium tracking-[-0.075em] text-[#f4f2ec] md:mt-8">
                <RiseLine delay={0.2}>{t('landing.hero.title')}</RiseLine>
                <RiseLine
                  delay={0.35}
                  className="mt-1 font-editorial text-[1.4em] leading-[0.95] font-normal tracking-[-0.045em] text-[#f2eee6] italic md:mt-2 md:text-[1.08em]"
                >
                  {t('landing.hero.serif')}
                </RiseLine>
              </h1>
            </div>
            <div className="absolute right-6 bottom-26 left-6 z-10 md:top-100 md:right-auto md:bottom-auto md:left-14">
              <motion.p
                {...fadeUp(0.6)}
                className="max-w-110 text-sm leading-6 text-white/80 md:text-lg md:leading-7"
              >
                {t('landing.hero.description')}
              </motion.p>
              <motion.div {...fadeUp(0.75)}>
                <UIButton navigateTo="/login" size="md" className="group mt-7 gap-3">
                  {t('landing.findPeople')}{' '}
                  <ArrowUpRight size={17} className={arrowHover} aria-hidden />
                </UIButton>
                <p className="mt-3 text-xs text-white/60">{t('landing.hero.account')}</p>
              </motion.div>
            </div>
            <motion.div
              {...fadeUp(1)}
              className="absolute bottom-12 left-14 hidden font-mono text-[10px] tracking-widest text-white/60 md:block"
            >
              <motion.span
                className="inline-block"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {t('landing.hero.scroll')}
              </motion.span>
            </motion.div>
            <motion.div
              {...fadeUp(1)}
              className="absolute right-14 bottom-12 hidden text-right font-mono text-[10px] tracking-widest whitespace-pre-line text-white/60 md:block"
            >
              {t('landing.hero.caption')}
            </motion.div>
          </section>

          <section
            aria-label={t('landing.universitiesLabel')}
            className="border-y border-white/10 px-6 py-7 md:flex md:items-center md:gap-12 md:px-14 md:py-8"
          >
            <p className="font-mono text-[10px] leading-4 tracking-widest whitespace-pre-line text-white/60">
              {t('landing.universitiesLabel')}
            </p>
            <div className="mt-5 overflow-hidden mask-x-from-90% md:mt-0 md:flex-1">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    aria-hidden={copy === 1 || undefined}
                    className="flex min-w-[100vw] shrink-0 justify-around gap-14 pr-14 text-sm font-medium whitespace-nowrap text-white/80 md:min-w-[calc(100vw-260px)]"
                  >
                    {universities.map(({ id, name }) => (
                      <li key={id}>{name}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </section>

          <section
            id="community"
            className="scroll-mt-19 px-6 py-14 md:scroll-mt-22 md:px-14 md:py-22"
          >
            <div className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
              <h2 className="text-[clamp(38px,4.2vw,60px)] leading-[1.05] font-medium tracking-[-0.055em] text-[#f2eee6]">
                <RiseLine>{t('landing.community.title')}</RiseLine>
                <RiseLine
                  delay={0.12}
                  className="font-editorial text-[1.12em] font-normal tracking-[-0.04em] italic"
                >
                  {t('landing.community.serif')}
                </RiseLine>
              </h2>
              <motion.p
                {...fadeUp(0.2)}
                className="max-w-72 text-sm leading-6 whitespace-pre-line text-white/60 md:text-base"
              >
                {t('landing.community.description')}
              </motion.p>
            </div>
            <motion.div {...inViewGroup} className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:gap-6">
              <motion.article
                {...wipeUp()}
                className="group relative h-110 overflow-hidden rounded-sm md:h-140"
              >
                <ParallaxImage src="/landing/community.jpg" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d14] via-[#0c0d14]/20 to-transparent" />
                <motion.div
                  {...riseIn(0.5)}
                  className="absolute right-5 bottom-5 left-5 md:right-8 md:bottom-8 md:left-8"
                >
                  <p className="font-mono text-[10px] tracking-widest text-white/80">
                    {t('landing.community.peopleLabel')}
                  </p>
                  <h3 className="mt-2 text-3xl font-medium tracking-tight md:text-[40px]">
                    {t('landing.community.peopleTitle')}
                  </h3>
                  <p className="mt-2 max-w-85 text-sm leading-6 text-white/80 md:text-base">
                    {t('landing.community.peopleBody')}
                  </p>
                </motion.div>
              </motion.article>
              <div className="grid gap-5 md:grid-rows-[1.6fr_1fr] md:gap-6">
                <motion.article
                  {...wipeUp(0.15)}
                  className="group relative h-68 overflow-hidden rounded-sm md:h-auto"
                >
                  <ParallaxImage src="/landing/concert.jpg" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d14] via-[#0c0d14]/15 to-transparent" />
                  <motion.div
                    {...riseIn(0.6)}
                    className="absolute right-5 bottom-5 left-5 md:right-7 md:bottom-7 md:left-7"
                  >
                    <p className="font-mono text-[10px] tracking-widest text-white/80">
                      {t('landing.community.plansLabel')}
                    </p>
                    <h3 className="mt-2 text-2xl leading-tight font-medium whitespace-pre-line md:text-[31px]">
                      {t('landing.community.plansTitle')}
                    </h3>
                  </motion.div>
                </motion.article>
                <motion.article
                  {...wipeUp(0.3)}
                  className="group min-h-50 bg-[#c8d3ff] text-[#0c1635] transition-colors duration-500 hover:bg-[#d6deff]"
                >
                  <Link
                    to="/login"
                    className="flex size-full min-h-50 flex-col justify-between p-6 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#243665] md:p-7"
                  >
                    <p className="font-mono text-[10px] tracking-widest text-[#243665]">
                      {t('landing.community.quoteLabel')}
                    </p>
                    <p className="font-editorial text-[29px] leading-none whitespace-pre-line md:text-[34px]">
                      {t('landing.community.quote')}
                    </p>
                    <div className="flex items-end justify-between font-mono text-[9px] tracking-widest text-[#243665]">
                      <span>{t('landing.community.quoteSignoff')}</span>
                      <ArrowUpRight size={19} className={arrowHover} aria-hidden />
                    </div>
                  </Link>
                </motion.article>
              </div>
            </motion.div>
          </section>

          <section className="grid gap-9 bg-[#f0eee7] px-6 py-14 text-[#14203b] md:grid-cols-[minmax(0,550px)_1fr] md:gap-24 md:px-14 md:py-22">
            <div>
              <motion.p
                {...fadeUp()}
                className="font-mono text-[10px] tracking-widest text-[#596173]"
              >
                {t('landing.help.eyebrow')}
              </motion.p>
              <h2 className="mt-5 max-w-130 text-[clamp(40px,4.7vw,68px)] leading-[1.04] font-medium tracking-[-0.06em]">
                {t('landing.help.title')
                  .split('\n')
                  .map((line, index) => (
                    <RiseLine key={line} delay={index * 0.1}>
                      {line}
                    </RiseLine>
                  ))}
              </h2>
              <motion.p
                {...fadeUp(0.3)}
                className="mt-6 max-w-110 text-sm leading-6 whitespace-pre-line text-[#596173] md:text-base"
              >
                {t('landing.help.description')}
              </motion.p>
            </div>
            <div>
              {help.map(({ title, body, Icon }, index) => (
                <motion.div
                  key={title}
                  {...fadeUp(index * 0.12)}
                  className="group relative -mx-4 grid grid-cols-[24px_1fr_22px] gap-4 rounded-sm px-4 py-6 transition-colors duration-300 hover:bg-[#14203b]/[0.04] md:gap-6 md:py-7"
                >
                  <motion.span
                    {...drawLine(index * 0.12)}
                    className="absolute inset-x-4 top-0 h-px origin-left bg-[#14203b]/15"
                  />
                  <span className="font-mono text-[11px] text-[#596173]">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-[27px]">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-115 text-sm leading-6 text-[#596173] md:text-base">
                      {body}
                    </p>
                  </div>
                  <Icon
                    size={22}
                    className="text-[#344c9f] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-12"
                    aria-hidden
                  />
                </motion.div>
              ))}
            </div>
          </section>

          <section id="join" className="scroll-mt-19 px-6 py-12 md:scroll-mt-22 md:px-14 md:py-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-medium tracking-tight text-[#f2eee6] md:text-[32px]">
                <RiseLine>{t('landing.steps.title')}</RiseLine>
              </h2>
              <motion.p
                {...fadeUp(0.2)}
                className="font-mono text-[10px] tracking-widest text-white/60"
              >
                {t('landing.steps.label')}
              </motion.p>
            </div>
            <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-10">
              {steps.map(({ title, body }, index) => (
                <motion.div key={title} {...fadeUp(index * 0.15)} className="relative pt-5">
                  <motion.span
                    {...drawLine(index * 0.15)}
                    className="absolute inset-x-0 top-0 h-px origin-left bg-white/15"
                  />
                  <p className="font-mono text-[11px] text-[#a9baff]">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-medium md:text-[19px]">{title}</h3>
                  <p className="mt-2 text-sm text-white/60">{body}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="relative grid gap-9 overflow-hidden bg-[#3655dc] px-6 py-12 md:grid-cols-[1fr_400px] md:items-center md:gap-20 md:px-14 md:py-18">
            <Glow className="-bottom-[40%] left-[20%] bg-[#a9baff]/45" />
            <div className="relative">
              <motion.p
                {...fadeUp()}
                className="font-mono text-[10px] tracking-widest text-white/80"
              >
                {t('landing.invitation.label')}
              </motion.p>
              <h2 className="mt-6 text-[clamp(50px,5.6vw,80px)] leading-[0.98] font-medium tracking-[-0.06em]">
                <RiseLine>{t('landing.invitation.title')}</RiseLine>
                <RiseLine
                  delay={0.12}
                  className="font-editorial text-[1.3em] font-normal tracking-[-0.04em] text-[#f2eee6] italic"
                >
                  {t('landing.invitation.serif')}
                </RiseLine>
              </h2>
              <motion.p {...fadeUp(0.3)} className="mt-6 text-sm text-white/80 md:text-lg">
                {t('landing.invitation.description')}
              </motion.p>
              <motion.ul {...fadeUp(0.45)} className="mt-8 flex flex-wrap gap-3">
                {APP_STORES.map(({ name, path }) => (
                  <li key={name}>
                    <span
                      role="link"
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed items-center gap-3 rounded-xl border border-white/25 bg-[#0c0d14]/25 px-4 py-2.5 text-white/90 backdrop-blur-sm"
                    >
                      <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
                        <path d={path} />
                      </svg>
                      <span className="flex flex-col leading-tight">
                        <span className="font-mono text-[9px] tracking-widest text-white/60 uppercase">
                          {t('landing.appsSoon')}
                        </span>
                        <span className="text-base font-semibold">{name}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </motion.ul>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: -4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 }}
              className="relative text-[#172038] drop-shadow-[0_30px_60px_rgba(12,13,20,0.35)]"
            >
              <div className="rounded-t-[10px] bg-[#f2eee6] p-6 pb-0 md:p-7 md:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold tracking-tight lowercase">
                    {t('common.appName')}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-[#596173]">
                    {t('landing.invitation.passLabel')}
                  </span>
                </div>
                <h3 className="mt-6 font-editorial text-[45px] leading-none md:text-[51px]">
                  {t('landing.invitation.passTitle')}
                </h3>
                <p className="mt-5 max-w-66 text-sm leading-6 text-[#596173] md:text-base">
                  {t('landing.invitation.passBody')}
                </p>
                <div className="h-6" />
              </div>
              <div
                ref={stubRef}
                className="origin-top-left rounded-b-[10px] border-t border-dashed border-[#172038]/25 bg-[#f2eee6] p-6 md:p-7"
              >
                <UIButton
                  onClick={() => void tearPass()}
                  bg="ghost"
                  className="group w-full border-[#172038] bg-[#172038] text-white enabled:hover:bg-[#243665]"
                >
                  {t('landing.invitation.passAction')}{' '}
                  <ArrowUpRight size={16} className={arrowHover} aria-hidden />
                </UIButton>
                <p className="mt-5 text-xs text-[#596173]">{t('landing.invitation.passNote')}</p>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="px-6 pt-9 pb-6 md:px-14 md:pt-12 md:pb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <p className="flex text-[clamp(82px,19vw,270px)] leading-[0.8] font-semibold tracking-[-0.09em] text-[#f2eee6] lowercase">
              <span className="sr-only">{t('common.appName')}</span>
              {[...t('common.appName')].map((letter, index) => (
                <RiseLine key={index} delay={index * 0.06} className="inline-block">
                  <span aria-hidden>{letter}</span>
                </RiseLine>
              ))}
            </p>
            <motion.div {...fadeUp(0.3)} className="md:w-80 md:shrink-0 md:pb-5">
              <p className="font-mono text-[10px] tracking-widest text-white/60">
                {t('landing.footer.city')}
              </p>
              <p className="mt-3 font-editorial text-2xl leading-none whitespace-pre-line text-white/80 md:text-[27px]">
                {t('landing.footer.statement')}
              </p>
            </motion.div>
          </div>
          <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
            <p>{t('landing.footer.copyright')}</p>
            <div className="flex flex-wrap items-center gap-5 md:gap-6">
              <span>{t('landing.footer.privacy')}</span>
              <span>{t('landing.footer.terms')}</span>
              <div className="flex items-center gap-1" aria-label={t('topbar.changeLanguage')}>
                {LNG_OPTIONS.map(({ value: code, label }, index) => (
                  <span key={code} className="flex items-center gap-1">
                    {index > 0 ? <span aria-hidden>/</span> : null}
                    <button
                      type="button"
                      onClick={() => void i18n.changeLanguage(code)}
                      aria-label={label}
                      aria-current={
                        (i18n.resolvedLanguage ?? i18n.language) === code ? 'true' : undefined
                      }
                      className="uppercase hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9baff] aria-current:text-white"
                    >
                      {code}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
