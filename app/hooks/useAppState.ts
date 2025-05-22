import { useCallback, useState } from 'react';

export function useAppState<T>(initialState: T): [T, (newState: Partial<T>) => void] {
  const [state, setState] = useState<T>(initialState);

  const updateState = useCallback((newState: Partial<T>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  }, []);

  return [state, updateState];
} 