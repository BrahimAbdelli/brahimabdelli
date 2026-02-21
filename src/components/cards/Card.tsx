import type React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Card({
  title,
  link,
  tags,
  encrypted = false,
  children,
  highlighted = false
}: {
  title: string;
  link?: string;
  tags?: string[];
  children?: React.ReactNode;
  encrypted?: boolean;
  highlighted?: boolean;
}) {
  const content: React.JSX.Element = (
    <>
      <motion.div whileHover={{ scale: 1.009 }}>
        <div className='flex justify-between'>
          <h2 className='text-fuchsia-500 dark:text-slate-300 font-mono font-bold text-xl mb-4 dark:group-hover:text-green-custom group-hover:text-accent'>
            {title}
          </h2>
          {highlighted && (
            <span className={`flex h-4 w-4 animate-animation`}>
              <span className='animate-ping absolute inline-flex h-4 w-4 rounded-full bg-sky-400 dark:bg-green-300 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-4 w-4 bg-sky-500 dark:bg-green-500'></span>
            </span>
          )}
        </div>
      </motion.div>
      {children && (
        <p className='text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200 group-hover:text-slate-600 flex-1'>
          {children}
        </p>
      )}
      {tags && (
        <div className='mt-6 text-sm text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400 group-hover:text-slate-700 font-mono'>
          {tags.join(` · `)}
        </div>
      )}
    </>
  );
  if (link && encrypted) {
    return (
      <button className='flex flex-col bg-blue-700/10 dark:bg-blue-900/15 hover:bg-blue-700/25 dark:hover:bg-blue-900/25 group p-6 shadow-md text-left'>
        {content}
      </button>
    );
  }
  if (link && !encrypted) {
    if (link[0] === '/') {
      return (
        <Link href={link}>
          <a className='flex flex-col bg-blue-700/10 dark:bg-blue-900/15 hover:bg-blue-700/25 dark:hover:bg-blue-900/25 group p-6 shadow-md'>
            {content}
          </a>
        </Link>
      );
    }
    return (
      <a
        href={link}
        target='_blank'
        className='flex flex-col bg-blue-700/10 dark:bg-blue-900/15 hover:bg-blue-700/25 dark:hover:bg-blue-900/25 group p-6 shadow-md'
        rel='noreferrer'
      >
        {content}
      </a>
    );
  }
  return (
    <div className='flex flex-col bg-blue-700/10 dark:bg-blue-900/15 p-6 shadow-md'>
      {content}
    </div>
  );
}
