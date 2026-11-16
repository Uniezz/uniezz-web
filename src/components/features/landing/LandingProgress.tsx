import { animated, useReducedMotion, useScroll } from '@react-spring/web';

export function LandingProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    immediate: !!reducedMotion,
    config: { mass: 0.3, tension: 220, friction: 24 },
  });
  return (
    <div className="landing-progress" aria-hidden>
      <animated.span className="landing-progress-thread" style={{ scaleY: scrollYProgress }} />
      <animated.div
        className="landing-yarn-ball"
        // transform instead of top: moving top re-runs layout on every scroll frame.
        style={{
          transform: scrollYProgress.to(
            (progress) => `translate(-50%, calc(-50% + ${progress * 40}vh))`,
          ),
        }}
      >
        <animated.img
          src="/landing/yarn-ball.png"
          alt=""
          width={192}
          height={192}
          draggable={false}
          style={{
            rotate: scrollYProgress.to((progress) => `${reducedMotion ? 0 : progress * 720}deg`),
          }}
        />
      </animated.div>
    </div>
  );
}
