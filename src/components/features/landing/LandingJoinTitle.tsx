import { animated, easings, useInView, useReducedMotion, useSpring } from '@react-spring/web';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingJoinTitle() {
  const { t } = useTranslation();
  const title = t('landing.steps.title');
  const reducedMotion = useReducedMotion();
  const [ref, inView] = useInView();
  const { sweep } = useSpring({
    from: { sweep: -0.3 },
    to: { sweep: 1.3 },
    loop: true,
    pause: !inView || !!reducedMotion,
    config: { duration: 3400, easing: easings.linear },
  });
  const words = title.split(' ');
  return (
    <h2 ref={ref} id="join-title">
      <Link to="/login" className="landing-join-heading-link" aria-label={title}>
        {words.map((word, wordIndex) => {
          const offset = words.slice(0, wordIndex).join(' ').length + (wordIndex ? 1 : 0);
          return (
            <span key={wordIndex} aria-hidden>
              {wordIndex ? ' ' : null}
              <span className="landing-join-word">
                {Array.from(word).map((letter, index) => (
                  <animated.span
                    key={index}
                    className="landing-join-letter"
                    style={{
                      opacity: reducedMotion
                        ? 1
                        : sweep.to(
                            (value) =>
                              0.45 +
                              0.55 *
                                Math.max(
                                  0,
                                  1 - Math.abs(value - (offset + index) / title.length) / 0.18,
                                ),
                          ),
                    }}
                  >
                    {letter}
                  </animated.span>
                ))}
                {wordIndex === words.length - 1 ? (
                  <ArrowUpRight className="landing-join-title-arrow" aria-hidden />
                ) : null}
              </span>
            </span>
          );
        })}
      </Link>
    </h2>
  );
}
