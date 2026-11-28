import { useRef, type MouseEvent, type PointerEvent } from 'react';

const LONG_PRESS_MS = 500;

/**
 * Handlers for a long press, as the app's onLongPress: a touch held for 500ms runs `onLongPress` and
 * swallows the click that follows. A right-click (contextmenu) runs it too.
 */
export function useLongPress(onLongPress: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fired = useRef(false);
  const isTouch = useRef(false);
  const cancel = () => clearTimeout(timer.current);
  return {
    onPointerDown: (event: PointerEvent) => {
      isTouch.current = event.pointerType !== 'mouse';
      fired.current = false;
      if (!isTouch.current) return;
      timer.current = setTimeout(() => {
        fired.current = true;
        onLongPress();
      }, LONG_PRESS_MS);
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (event: MouseEvent) => {
      event.preventDefault();
      cancel();
      if (fired.current) return;
      fired.current = isTouch.current;
      onLongPress();
    },
    onClickCapture: (event: MouseEvent) => {
      if (!fired.current) return;
      fired.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
