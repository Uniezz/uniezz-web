import { useCallback, useEffect, useRef, useState } from 'react';

export function useDropdown() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      // a dialog opened from the menu (staff tools) is part of it, not "outside"
      if (!ref.current || ref.current.contains(target) || target.closest?.('[role=dialog]')) return;
      close();
      // as the mobile app: a tap outside only closes the menu, so this press's click must not
      // reach what is under it. A press that turned into a scroll has no click; the next press
      // drops the guard so it can't eat a later tap.
      const swallowClick = (click: MouseEvent) => {
        click.preventDefault();
        click.stopPropagation();
      };
      document.addEventListener('click', swallowClick, { capture: true, once: true });
      document.addEventListener(
        'pointerdown',
        () => document.removeEventListener('click', swallowClick, { capture: true }),
        { capture: true, once: true },
      );
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, close]);

  return { ref, isOpen, toggle, close };
}
