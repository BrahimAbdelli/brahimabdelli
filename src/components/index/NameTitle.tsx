import type React from 'react';

import { sectionTitleBigClasses, sectionTitleClasses } from '../styles';

export default function NameTitle({
  accentText,
  children,
  big = false
}: {
  accentText?: string;
  children: React.ReactNode;
  big?: boolean;
}) {
  return (
    <>
      {accentText && (
        <span className='text-xl xl:text-2xl dark:text-green-custom text-fuchsia-500 font-mono'>
          {accentText}
        </span>
      )}
      <div className='lg:h-4 pt-8'></div>
      <h1
        className={`${
          big ? sectionTitleBigClasses : sectionTitleClasses
        } dark:text-white text-black`}
      >
        <span className='relative'>
          <span className='h-20 pt-2 overflow-x-hidden whitespace-nowrap text-brand-accent dark:text-white text-black'>
            {children}
            {big && <span className='dark:text-green-custom text-accent'>.</span>}
            <span className='text-3xl md:text-5xl inline-block animate-wiggle'>👋</span>
          </span>
          <span className={`absolute -bottom-0 left-0 -top-1 inline-block 4 w-full `}></span>
        </span>
      </h1>
      <h1
        className={`${
          big ? sectionTitleBigClasses : sectionTitleClasses
        } dark:text-white text-black mt-4`}
      >
        <span className='relative'>
          <span className='h-20 pt-2 overflow-x-hidden whitespace-nowrap text-brand-accent text-3xl'>
            I build things.
          </span>
          <span className={`inline-block 4 w-full dark:bg-gray-900 bg-gray-50`}></span>
        </span>
      </h1>
      <div className='h-6 md:h-8 lg:h-12 xl:h-16'></div>
    </>
  );
}
