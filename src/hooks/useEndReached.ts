import { useEffect, useRef } from 'react';

/**
 * A ref for an element at the end of a window-scrolled list: `onEndReached` runs when it nears
 * the viewport, as the mobile app's FlatList `onEndReached`.
 */
export function useEndReached<T extends Element>(onEndReached: () => void) {
  const ref = useRef<T>(null);
  const callback = useRef(onEndReached);
  useEffect(() => {
    callback.current = onEndReached;
  });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) callback.current();
      },
      { rootMargin: '0px 0px 600px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}
