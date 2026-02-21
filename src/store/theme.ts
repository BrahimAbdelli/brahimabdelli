import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface ThemeStore extends ThemeState {
  changeTheme: (mode: ThemeState['mode']) => void;
}

const defaultState: ThemeState = {
  mode: 'dark'
};

const initialState: ThemeState = { ...defaultState };

export const useThemeStore: UseBoundStore<StoreApi<ThemeStore>> = create(
  persist<ThemeStore>(
    (set, _get) => ({
      ...initialState,
      changeTheme(mode) {
        switch (mode) {
          case 'dark':
          case 'light': {
            set(() => ({
              mode
            }));
            break;
          }
          default: {
            set(() => ({
              mode: 'dark'
            }));
            break;
          }
        }
      }
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      version: 0.4
    }
  )
);
