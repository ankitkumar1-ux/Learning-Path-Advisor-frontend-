import { useCallback, useRef } from "react";

export function useThrottle<A extends unknown[], R>(
  callback: (...args: A) => R,
  delay: number
): (...args: A) => void {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: A) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      const execute = () => {
        lastRun.current = Date.now();
        callback(...args);
      };

      if (timeSinceLastRun >= delay) {
        execute();
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          execute();
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay]
  );
}
