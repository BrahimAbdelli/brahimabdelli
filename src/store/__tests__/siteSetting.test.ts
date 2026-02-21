/// <reference types="@testing-library/jest-dom" />
import { renderHook, act } from '@testing-library/react';

import { useSiteSettingStore } from '../siteSetting';

describe('SiteSetting Store', () => {
  beforeEach(() => {
    const store: ReturnType<typeof useSiteSettingStore.getState> = useSiteSettingStore.getState();
    store.setHydrated();
    store.closeSideBarMenu();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useSiteSettingStore());
    expect(result.current.hydrated).toBe(true);
    expect(result.current.enableSideBarMenu).toBe(false);
  });

  it('sets hydrated state', () => {
    const { result } = renderHook(() => useSiteSettingStore());

    act(() => {
      result.current.setHydrated();
    });

    expect(result.current.hydrated).toBe(true);
  });

  it('opens sidebar menu', () => {
    const { result } = renderHook(() => useSiteSettingStore());

    act(() => {
      result.current.openSideBarMenu();
    });

    expect(result.current.enableSideBarMenu).toBe(true);
  });

  it('closes sidebar menu', () => {
    const { result } = renderHook(() => useSiteSettingStore());

    act(() => {
      result.current.openSideBarMenu();
      result.current.closeSideBarMenu();
    });

    expect(result.current.enableSideBarMenu).toBe(false);
  });
});


