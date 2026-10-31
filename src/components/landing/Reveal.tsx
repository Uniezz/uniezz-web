import { type ElementType, type MouseEventHandler, type ReactNode, type Ref } from 'react';
import { animated, easings, useInView, useReducedMotion } from '@react-spring/web';
import { useState } from 'react';

const elements = {
  article: animated.article,
  div: animated.div,
  header: animated.header,
  p: animated.p,
  span: animated.span,
  ul: animated.ul,
};

type SpringStyle = {
  opacity?: number;
  y?: number | string;
  scale?: number;
  scaleX?: number;
  rotate?: number;
};

export function Reveal({
  as = 'div',
  children,
  className,
  onClick,
  delay = 0,
  from = { opacity: 0, y: 28 },
  to = { opacity: 1, y: 0 },
}: {
  as?: keyof typeof elements;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  delay?: number;
  from?: SpringStyle;
  to?: SpringStyle;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const [finished, setFinished] = useState(false);
  const [ref, style] = useInView(
    () => ({
      from,
      to,
      delay: reducedMotion ? 0 : delay * 1000,
      immediate: reducedMotion,
      config: { duration: 900, easing: easings.easeOutQuart },
      onRest: () => setFinished(true),
    }),
    { once: true, amount: 0.25 },
  );
  const Element = elements[as] as ElementType;

  return (
    <Element
      ref={ref as Ref<HTMLElement>}
      style={finished ? undefined : style}
      className={className}
      onClick={onClick}
    >
      {children}
    </Element>
  );
}
