import { useState, useEffect, useCallback } from "react";
import { getStorageItem, setStorageItem } from "./storage";

/**
 * useState backed by localStorage. Reads once on mount; writes on every change.
 * `key` should be stable and unique per use-case (not per component instance).
 */
const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = getStorageItem(key);
      // getStorageItem already JSON.parses the value
      return stored !== null && stored !== ""
        ? (stored as unknown as T)
        : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // setStorageItem JSON.stringifies non-string values internally
      setStorageItem(key, state);
    } catch {
      // Ignore write failures (e.g. private browsing storage quota).
    }
  }, [key, state]);

  const setStateStable = useCallback(
    (value: React.SetStateAction<T>) => setState(value),
    [],
  );

  return [state, setStateStable];
};

export default useLocalStorageState;
