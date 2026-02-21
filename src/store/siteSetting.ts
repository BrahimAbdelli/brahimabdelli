import { create, type UseBoundStore, type StoreApi } from 'zustand';

interface SiteSettingState {
  hydrated: boolean;
  enableSideBarMenu: boolean;
}

const defaultState: SiteSettingState = {
  hydrated: false,
  enableSideBarMenu: false
};

interface SiteSettingStore extends SiteSettingState {
  setHydrated: () => void;
  openSideBarMenu: () => void;
  closeSideBarMenu: () => void;
}

export const useSiteSettingStore: UseBoundStore<StoreApi<SiteSettingStore>> = create<SiteSettingStore>((set, _get) => ({
  ...defaultState,
  setHydrated() {
    set({
      hydrated: true
    });
  },
  openSideBarMenu() {
    set({
      enableSideBarMenu: true
    });
  },
  closeSideBarMenu() {
    set({
      enableSideBarMenu: false
    });
  }
}));
