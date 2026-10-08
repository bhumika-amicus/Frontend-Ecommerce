import { useState, useEffect, useCallback } from 'react';

interface FetchOptions {
  skip?: boolean;
}

export function useFetch<T>(
  fetchFunction: (signal: AbortSignal) => Promise<T>,
  dependencies: any[] = [],
  options?: FetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  // If skip is true initially, we are not loading
  const [isLoading, setIsLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // 1. Guard Clause for the skip option
    if (options?.skip) {
      setIsLoading(false);
      setData(null);
      return;
    }

    // 2. Setup AbortController and initial states
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    setData(null);

    // 3. Execute the passed fetch function
    fetchFunction(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error('useFetch API Error:', err);
          setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    // 4. Cleanup on unmount or dependency change
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, refreshIndex, options?.skip]);

  return { data, isLoading, error, refetch };
}
