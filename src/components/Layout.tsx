import type React from 'react';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { throttle } from 'lodash';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import { FaArrowUp } from 'react-icons/fa';

import { useSiteSettingStore } from 'src/store/siteSetting';
import { useThemeStore } from 'src/store/theme';

import Footer from './footer/Footer';
import Header from './header/Header';
import { SideBarMenu } from './modules/SideBarMenu';

function Layout({ children }: Readonly<PropsWithChildren>): React.JSX.Element {
  const mode: 'light' | 'dark' = useThemeStore((state) => state.mode);

  useEffect(() => {
    useSiteSettingStore.subscribe(({ enableSideBarMenu }) => {
      if (enableSideBarMenu) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset['theme'] = mode;
    document.documentElement.classList.add(mode);
    return () => {
      document.documentElement.classList.remove(mode);
    };
  }, [mode]);

  return (
    <div className='flex flex-col min-h-screen supports-[height:100dvh]:min-h-dvh-100 bg-base-100 text-base-content'>
      <Head>
        <meta name='msapplication-TileColor' content={mode === 'dark' ? '#313335' : '#f3f4f6'} />
        <meta name='theme-color' content={mode === 'dark' ? '#313335' : '#f3f4f6'} />
      </Head>
      <NextNProgress startPosition={0.2} />
      <Header />
      <main className='grow'>{children}</main>
      <Footer />
      <SideBarMenu />
      <ScrollTopButton />
    </div>
  );
}

const ScrollTopButton: () => React.JSX.Element = (): React.JSX.Element => {
  const [visibleScrollTopButton, setVisibleScrollTopButton]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const scrollTopButtonRef: React.RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement>(null);
  const progressIndicatorRef: React.RefObject<SVGSVGElement | null> = useRef<SVGSVGElement>(null);

  useEffect((): (() => void) => {
    const circumference: number = 87.9;

    const scrollEvent: () => void = (): void => {
      const scrollableHeight: number = document.body.scrollHeight - globalThis.innerHeight;
      const scrollProgress: number = 100 * (globalThis.scrollY / scrollableHeight);
      const clampedProgress: number = Math.max(0, Math.min(scrollProgress || 0, 100));

      const dashOffset: number = (clampedProgress / 100) * circumference;

      const progressIndicator: SVGSVGElement | null = progressIndicatorRef.current;
      if (progressIndicator) {
        progressIndicator.style.strokeDashoffset = (circumference - dashOffset).toFixed(1);
        progressIndicator.style.strokeDasharray = circumference.toFixed(1);
      }
      if (
        globalThis.pageYOffset < 100 ||
        Math.round(globalThis.innerHeight + globalThis.pageYOffset) >
          Math.round(document.body.scrollHeight - 50)
      ) {
        setVisibleScrollTopButton(false);
        return;
      }
      setVisibleScrollTopButton(true);
    };

    const throttledScrollEvent: ReturnType<typeof throttle> = throttle(scrollEvent, 100);

    scrollEvent();
    globalThis.addEventListener('scroll', throttledScrollEvent);
    return (): void => globalThis.removeEventListener('scroll', throttledScrollEvent);
  }, []);

  const handleClickScrollTopButton: () => void = (): void => {
    if (globalThis.scrollTo) {
      globalThis.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const scrollTopButton: HTMLButtonElement | null = scrollTopButtonRef.current;
      if (scrollTopButton) {
        scrollTopButton.focus();
        setTimeout((): void => {
          scrollTopButton.blur();
        }, 1000);
      }
    }
  };

  return (
    <div
      className={classNames(
        'fixed bottom-3 right-3 z-10 transition-[opacity_scale] duration-300 rounded-full bg-base-100 hover:scale-110',
        visibleScrollTopButton ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <button
        ref={scrollTopButtonRef}
        tabIndex={-1}
        className='relative btn btn-circle btn-ghost min-w-0 min-h-0 w-[30px] h-[30px] btn-sm bg-base-100 border-none p-0 shadow-md overflow-hidden hover:bg-base-200/10 !outline-none group'
        onClick={handleClickScrollTopButton}
      >
        <FaArrowUp className='transition-transform duration-1000 group-focus:-translate-y-[200%] group-active:-translate-y-[200%]' />
        <svg
          ref={progressIndicatorRef}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[inherit] h-[inherit] stroke-primary fill-transparent stroke-2 -rotate-90 transition-all'
          viewBox='0 0 30 30'
        >
          <circle cx='15' cy='15' r='14' />
        </svg>
      </button>
    </div>
  );
};

export default Layout;
