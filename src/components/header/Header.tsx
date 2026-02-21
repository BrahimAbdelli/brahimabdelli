import type React from 'react';

import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { throttle } from 'lodash';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { shallow } from 'zustand/shallow';

import { SearchForm } from 'src/components/search/SearchForm';
import { useNotionStore } from 'src/store/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';

import LanguageToggle from 'src/components/background/LanguageToggle';
import { ThemeChangeButton } from '../modules/ThemeChangeButton';
import { useRouter } from 'next/router';
import { BlogProperties } from 'src/types/notion';
import type { UseTranslationCommon } from 'src/types/types';

const Header: React.FC = (): React.JSX.Element => {
  const [visibleHeader, setVisibleHeader]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(true);
  const { hydrated, enableSideBarMenu, closeSideBarMenu, openSideBarMenu }: ReturnType<typeof useSiteSettingStore.getState> = useSiteSettingStore();
  const blogProperties: BlogProperties | undefined = useNotionStore(
    ({ blogProperties }) => blogProperties,
    shallow
  );
  const { t } = useTranslation('common') as UseTranslationCommon;

  const handleClickSideBarMenuButton: () => void = (): void => {
    if (enableSideBarMenu) {
      closeSideBarMenu();
    } else {
      openSideBarMenu();
    }
  };

  useEffect(() => {
    let prevYOffset: number = window.pageYOffset || 0;

    const scrollEvent: () => void = (): void => {
      const nextYOffset: number = window.pageYOffset;
      if (
        nextYOffset === 0 ||
        Math.round(window.innerHeight + window.pageYOffset) >
          Math.round(document.body.scrollHeight - 44)
      ) {
        prevYOffset = nextYOffset;
        setVisibleHeader(true);
        return;
      }
      if (prevYOffset > nextYOffset) {
        setVisibleHeader(true);
      } else if (prevYOffset < nextYOffset) {
        setVisibleHeader(false);
      }
      prevYOffset = nextYOffset;
    };

    const throttleScrollEvent: ReturnType<typeof throttle> = throttle(scrollEvent, 300);

    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  const router: ReturnType<typeof useRouter> = useRouter();
  const pathname: string = router.pathname;
  return (
    <nav
      className={classNames(
        'sticky left-0 h-[var(--header-height)] bg-base-200/50 backdrop-blur-xl transition-[top] duration-300 z-10',
        visibleHeader && !enableSideBarMenu ? 'top-0' : '-top-[var(--header-height)]'
      )}
    >
      <div className='h-full flex justify-between items-center mx-auto p-2 gap-x-1'>
        <div className='flex-1 whitespace-nowrap'>
          <Link
            className='no-underline dark:text-gray-300 text-slate-600 hover:text-gray-800 hover:dark:text-gray-300 font-montserrat text-xs font-extrabold btn btn-ghost btn-sm'
            href='/'
          >
            {pathname === '/' ? `${t('header.home')}` : 'HOME'}
          </Link>
          <Link
            className='no-underline dark:text-gray-300 text-slate-600 hover:text-gray-800 hover:dark:text-gray-300 font-montserrat text-xs font-extrabold btn btn-ghost btn-sm'
            href='/articles'
          >
            Articles
          </Link>
        </div>
        <div className='max-w-[150px] sm:max-w-[200px]'>
          <SearchForm />
        </div>

        <div className='flex items-center gap-2'>
          <LanguageToggle />
          <ThemeChangeButton />

          {hydrated ? (
            blogProperties && (
              <button
                className='btn btn-circle btn-sm btn-ghost text-xl'
                onClick={handleClickSideBarMenuButton}
                aria-label={enableSideBarMenu ? 'Close menu' : 'Open menu'}
              >
                {enableSideBarMenu ? <FaArrowRight /> : <HiMenu />}
              </button>
            )
          ) : (
            <div className='w-8' />
          )}
        </div>
      </div>
    </nav>
  );
};
Header.displayName = 'Header';

export default Header;
