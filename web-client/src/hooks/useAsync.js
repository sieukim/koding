import { useCallback, useEffect, useReducer } from 'react';

const initialState = {
  loading: false,
  success: null,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        success: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        success: action.data ?? true,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        success: null,
        error: action.error,
      };
    case 'INITIALIZE':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(
    async (...params) => {
      dispatch({ type: 'LOADING' });
      try {
        const data = await callback(...params);
        dispatch({ type: 'SUCCESS', data });
      } catch (e) {
        dispatch({ type: 'ERROR', error: e });
      }
    },
    // eslint-disable-next-line
    [dispatch, callback, ...deps],
  );

  const initializeState = useCallback(() => {
    dispatch({ type: 'INITIALIZE' });
  }, [dispatch]);

  useEffect(() => {
    if (skip) return;
    fetchData();
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData, initializeState];
}

export default useAsync;
