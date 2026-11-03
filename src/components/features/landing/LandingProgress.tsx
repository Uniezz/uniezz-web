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
        style={{ top: scrollYProgress.to((progress) => `${progress * 100}%`) }}
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
