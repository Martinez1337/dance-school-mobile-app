import {useCallback, useState} from "react";

const usePaginatedData = (fetcher, key) => {
  const [state, setState] = useState({ data: [], page: 0, loading: false, hasMore: true });

  const reset = useCallback(() => {
    console.log(`${key} reset`);
    setState({ data: [], page: 0, loading: false, hasMore: true });
    return Promise.resolve();
  }, [key]);

  const loadMore = useCallback(async ({limit = 20, additionalParams = {}} = {}) => {
    setState(prevState => {
      if (prevState.loading || !prevState.hasMore) return prevState;

      const loadingState = { ...prevState, loading: true };

      fetcher(prevState.page, limit, additionalParams)
        .then(response => {
          if (!response || response[key].length === 0) {
            setState(currentState => ({ ...currentState, hasMore: false, loading: false }));
            return;
          }

          setState(currentState => ({
            data: [...currentState.data, ...response[key]],
            page: currentState.page + 1,
            loading: false,
            hasMore: response[key].length > 0,
          }));
        })
        .catch(error => {
          console.error(`Error fetching ${key}:`, error);
          setState(currentState => ({ ...currentState, loading: false }));
        });

      return loadingState;
    });
  }, [fetcher, key]);

  const loadMoreAsync = useCallback(async ({limit = 20, additionalParams = {}} = {}) => {
    return new Promise((resolve, reject) => {
      setState(prevState => {
        console.log('loadMoreAsync', prevState);
        if (prevState.loading || !prevState.hasMore) {
          resolve(prevState);
          return prevState;
        }

        const loadingState = { ...prevState, loading: true };

        fetcher(prevState.page, limit, additionalParams)
          .then(response => {
            if (!response || response[key].length === 0) {
              const newState = { ...prevState, hasMore: false, loading: false };
              setState(newState);
              resolve(newState);
              return;
            }

            const newState = {
              data: [...prevState.data, ...response[key]],
              page: prevState.page + 1,
              loading: false,
              hasMore: response[key].length > 0,
            };
            setState(newState);
            resolve(newState);
          })
          .catch(error => {
            console.error(`Error fetching ${key}:`, error);
            const newState = { ...prevState, loading: false };
            setState(newState);
            reject(error);
          });

        return loadingState;
      });
    });
  }, [fetcher, key]);

  return { state, loadMore, loadMoreAsync, reset };
};

export default usePaginatedData;