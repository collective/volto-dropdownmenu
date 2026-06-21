import { useEffect } from 'react';

/**
 * Calls `handler` whenever a pointer event happens outside of the element
 * referenced by `ref`. Lightweight, dependency-free replacement for the
 * (unmaintained) `react-outside-click-handler` package.
 *
 * @param {React.RefObject} ref Ref of the element considered "inside".
 * @param {Function} handler Callback invoked with the originating event.
 */
export default function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      const el = ref.current;
      // Ignore clicks inside the element or when it is not rendered yet.
      if (!el || el.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
