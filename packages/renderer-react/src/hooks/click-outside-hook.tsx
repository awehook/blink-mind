import { useEffect, useRef, useState } from 'react';

export function useClickOutside(callback: EventListener) {
  const container = useRef(null);
  const [isTouchEvent, setTouchEvent] = useState(false);
  const eventType = isTouchEvent ? 'touchend' : 'click';

  function handleEvent(e: Event) {
    if (e.type === 'click' && isTouchEvent) { return; } // prettier-ignore

    if (container.current && e.target !== null) {
      if (!container.current.contains(e.target as Node)) {
        callback(e);
      }
    }
  }

  useEffect(() => {
    document.addEventListener(eventType, handleEvent, true);

    return () => {
      document.removeEventListener(eventType, handleEvent, true);
    };
  });

  useEffect(() => {
    setTouchEvent('ontouchstart' in document.documentElement);
  }, []);

  return container;
}
