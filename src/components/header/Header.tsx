import type React from 'react';

import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { throttle } from 'lodash';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { shallow } from 'zustand/shallow';

import { siteConfig } from 'site-config';
import { SearchForm } from 'src/components/search/SearchForm';
import { useNotionStore } from 'src/store/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';

import LanguageToggle from '../background/LanguageToggle';
import { ThemeChangeButton } from '../modules/ThemeChangeButton';
import { useRouter } from 'next/router';

const Header: React.FC = (): JSX.Element => {
  const [visibleHeader, setVisibleHeader] = useState(true);
  const { hydrated, enableSideBarMenu, closeSideBarMenu, openSideBarMenu } = useSiteSettingStore();
  const blogProperties = useNotionStore(({ blogProperties }) => blogProperties, shallow);
  const { t } = useTranslation('common');

  const handleClickSideBarMenuButton = () => {
    if (enableSideBarMenu) {
      closeSideBarMenu();
    } else {
      openSideBarMenu();
    }
  };

  useEffect(() => {
    let prevYOffset = window.pageYOffset || 0;

    const scrollEvent = () => {
      const nextYOffset = window.pageYOffset;
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

    const throttleScrollEvent = throttle(scrollEvent, 300);

    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  const { pathname } = useRouter();
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
            {t('header.home')}
          </Link>
          <Link
            className='no-underline dark:text-gray-300 text-slate-600 hover:text-gray-800 hover:dark:text-gray-300 font-montserrat text-xs font-extrabold btn btn-ghost btn-sm'
            href='/articles'
          >
            Articles
          </Link>
        </div>
        {/*         <div className='max-w-[150px] sm:max-w-[200px]'>
          <SearchForm />
        </div> */}

        <div>
          <a
            className='flex items-center justify-center px-2 font-medium rounded-md text-black dark:text-green-custom shadow uppercase dark:hover:bg-slate-700 hover:bg-slate-100 
                hover:shadow-lg transform transition hover:-translate-y-1 focus:ring-2 focus:ring-blue-600 ring-offset-2 outline-none 
                focus:bg-blue-800 focus:shadow-lg active:bg-blue-900'
            href='#'
            onClick={() => window.open(`/${t('header.resume')}`)}
          >
            {t('header.download')}
          </a>
        </div>
        <div className='flex items-center'>
          <ThemeChangeButton />
          {pathname === '/' && <LanguageToggle />}

          {hydrated ? (
            blogProperties && (
              <button
                className='btn btn-circle btn-sm btn-ghost text-xl'
                onClick={handleClickSideBarMenuButton}
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
