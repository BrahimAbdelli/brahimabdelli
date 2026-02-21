import type React from 'react';

import { useTranslation } from 'next-i18next';
import type { UseTranslationCommon } from 'src/types/types';

import { sectionTitleBigClasses, sectionTitleClasses } from '../styles';

export default function NameTitle({
  accentText,
  children,
  big = false,
}: {
  accentText?: string;
  children: React.ReactNode;
  big?: boolean;
}) {
  const { t } = useTranslation('common') as UseTranslationCommon;
  return (
    <>
      {accentText && (
        <span className='text-xl xl:text-2xl dark:text-green-custom text-fuchsia-500 font-mono'>
          {accentText}
        </span>
      )}
      <div className='h-2 lg:h-3'></div>
      <h1
        className={`${
          big ? sectionTitleBigClasses : sectionTitleClasses
        } dark:text-white text-black`}
      >
        <span className='relative'>
          <span className='overflow-x-hidden whitespace-nowrap text-brand-accent dark:text-white text-black'>
            {children}
            {big && <span className='dark:text-green-custom text-accent'>.</span>}
            <span className='text-3xl md:text-5xl inline-block animate-wiggle'>👋</span>
          </span>
        </span>
      </h1>
      <div className='mt-2'>
        <span className='h-20 pt-2 overflow-x-hidden whitespace-nowrap text-brand-accent text-3xl'>
          {`${t('home.description')}`}
        </span>
        <span className='block overflow-x-hidden whitespace-nowrap text-brand-accent text-lg sm:text-xl text-slate-400 dark:text-slate-400 mt-1'>
          {`${t('home.location')}`}
        </span>
      </div>
    </>
  );
}
