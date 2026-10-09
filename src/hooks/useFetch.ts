import { useState, useEffect, useCallback } from 'react';

interface FetchOptions {
  skip?: boolean;
}

interface FetchState<T> {
  dependencies: readonly unknown[];
  refreshIndex: number;
  data: T | null;
  error: string | null;
}

function dependenciesMatch(
  previous: readonly unknown[],
  current: readonly unknown[]
): boolean {
  return previous.length === current.length &&
    previous.every((value, index) => Object.is(value, current[index]));
}

export function useFetch<T>(
  fetchFunction: (signal: AbortSignal) => Promise<T>,
  dependencies: readonly unknown[] = [],
  options?: FetchOptions
) {
  const [fetchState, setFetchState] = useState<FetchState<T> | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const controller = new AbortController();

    fetchFunction(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setFetchState({
            dependencies: [...dependencies],
            refreshIndex,
            data: result,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error('useFetch API Error:', err);
          setFetchState({
            dependencies: [...dependencies],
            refreshIndex,
            data: null,
            error: err instanceof Error ? err.message : 'An unexpected error occurred.',
          });
        }
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, refreshIndex, options?.skip]);

  const hasCurrentResult = !options?.skip &&
    fetchState?.refreshIndex === refreshIndex &&
    dependenciesMatch(fetchState?.dependencies ?? [], dependencies);
  const data = hasCurrentResult ? fetchState?.data ?? null : null;
  const error = hasCurrentResult ? fetchState?.error ?? null : null;
  const isLoading = !options?.skip && !hasCurrentResult;

  return { data, isLoading, error, refetch };
}
