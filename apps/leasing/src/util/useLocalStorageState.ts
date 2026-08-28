import {
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getStorageItem, setStorageItem } from "./storage";

/**
 * useState backed by localStorage. Reads once on mount; writes on every change.
 * `key` should be stable and unique per use-case (not per component instance).
 */
const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = getStorageItem(key);
      return stored !== null && stored !== ""
        ? (stored as unknown as T)
        : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    setStorageItem(key, state);
  }, [key, state]);

  const setStateStable = useCallback(
    (value: SetStateAction<T>) => setState(value),
    [],
  );

  return [state, setStateStable];
};

export default useLocalStorageState;
