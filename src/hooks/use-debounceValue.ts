import { useState, useEffect } from 'react';


export const useDebounce = <T>(value: T, delay: number = 500) => {
  const [decouncedValue, setDecouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDecouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay])

  return decouncedValue;
};