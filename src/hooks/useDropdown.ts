import { useCallback, useEffect, useRef, useState } from 'react';

export function useDropdown() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    // the tap's click can't reach what is under the menu: globals.css makes the page ignore
    // taps while a [data-dropdown-open] wrapper is open, so it lands on the page itself
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      // a dialog opened from the menu (staff tools) is part of it, not "outside"
      if (!ref.current || ref.current.contains(target) || target.closest?.('[role=dialog]')) return;
      close();
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, close]);

  return { ref, isOpen, toggle, close };
}
