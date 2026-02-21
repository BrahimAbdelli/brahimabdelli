import { useLayoutEffect, useContext, useSyncExternalStore, type Context } from 'react';

import { StoreApi } from 'zustand';
import { createStore } from 'zustand';
import { createContext } from 'react';
import { shallow } from 'zustand/shallow';

import {
  BlogArticleRelation,
  BlogProperties,
  ChildrensRecord,
  DatabasesRecord,
  GetNotionBlock
} from 'src/types/notion';

export interface NotionState {
  slug?: string;
  baseBlock?: GetNotionBlock['block'];
  userInfo?: GetNotionBlock['userInfo'];
  pageInfo?: GetNotionBlock['pageInfo'];
  databasesRecord: DatabasesRecord;
  childrensRecord: ChildrensRecord;
  blogProperties?: BlogProperties;
  blogArticleRelation?: BlogArticleRelation;
}

export interface NotionStore extends NotionState {
  init: (params: NotionState) => void;
}

const defaultState: NotionState = {
  childrensRecord: {},
  databasesRecord: {}
};

const initialState: NotionState = { ...defaultState };

export const initializeNotionStore: (preloadedState?: NotionState) => StoreApi<NotionStore> = (preloadedState: NotionState = defaultState) =>
  createStore<NotionStore>((set) => ({
    ...initialState,
    ...preloadedState,
    init(params) {
      set({
        ...params
      });
    }
  }));

/** Dashboard Store with zustand and context api */
let store: ReturnType<typeof initializeNotionStore>;

export const useCreateNotionStore: (initialState: NotionState) => () => StoreApi<NotionStore> = (initialState: NotionState) => {
  if (typeof window === 'undefined') {
    return () => initializeNotionStore(initialState);
  }

  store = store ?? initializeNotionStore(initialState);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState
      });
    }
  }, [initialState]);

  return () => store;
};

export const NotionZustandContext: Context<StoreApi<NotionStore> | null> = createContext<StoreApi<NotionStore> | null>(null);

export const useNotionStore: <T = NotionStore>(
  selector?: (state: NotionStore) => T,
  _equalityFn?: (a: T, b: T) => boolean
) => T = <T = NotionStore>(
  selector?: (state: NotionStore) => T,
  _equalityFn?: (a: T, b: T) => boolean
): T => {
  const store: StoreApi<NotionStore> | null = useContext(NotionZustandContext);
  if (!store) {
    const error: Error = new Error('NotionZustandContext.Provider is missing');
    throw error;
  }

  const actualSelector: (state: NotionStore) => T = selector || ((state: NotionStore) => state as T);

  const getSnapshot: () => T = (): T => {
    const currentState: NotionStore = store.getState();
    return actualSelector(currentState);
  };

  const state: T = useSyncExternalStore(
    store.subscribe,
    getSnapshot,
    getSnapshot
  );

  return state;
};

// Helper for shallow comparison (commonly used pattern)
export const useNotionStoreShallow: <T>(selector: (state: NotionStore) => T) => T = <T,>(selector: (state: NotionStore) => T): T => {
  return useNotionStore(selector, shallow);
};
