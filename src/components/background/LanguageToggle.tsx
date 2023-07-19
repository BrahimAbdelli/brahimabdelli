import type React from 'react';

import { US, FR } from 'country-flag-icons/react/3x2';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LanguageToggle() {
  const router = useRouter();

  const isDynamicSlug = router.query.slug !== undefined;
  const href = isDynamicSlug ? '/[slug]' : router.pathname;
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30
  };

  return (
    <>
      <div
        className={`flex-start flex h-[40px] w-[80px] rounded-[40px] bg-zinc-100 p-[5px] shadow-inner hover:cursor-pointer dark:bg-zinc-700 ${
          router.locale === 'en' && 'place-content-end'
        }`}
      >
        <motion.div
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black/90'
          layout
          transition={spring}
        >
          <motion.div whileTap={{ rotate: 360 }}>
            {router.locale === 'en' ? (
              <>
                {router.query.slug ? (
                  <Link
                    href='/[slug]'
                    as={`/${router.query.slug}`}
                    locale={router.locale === 'en' ? 'fr' : 'en'}
                    passHref
                  >
                    <US title='United States' className='h-6 w-6 text-yellow-300' />
                  </Link>
                ) : (
                  <Link
                    href={router.pathname}
                    locale={router.locale === 'en' ? 'fr' : 'en'}
                    passHref
                  >
                    <US title='United States' className='h-6 w-6 text-yellow-300' />
                  </Link>
                )}
              </>
            ) : (
              <>
                {router.query.slug ? (
                  <Link
                    href='/[slug]'
                    as={`/${router.query.slug}`}
                    locale={router.locale === 'fr' ? 'en' : 'fr'}
                    passHref
                  >
                    <FR title='France' className='h-6 w-6 text-slate-200' />
                  </Link>
                ) : (
                  <Link
                    href={router.pathname}
                    locale={router.locale === 'fr' ? 'en' : 'fr'}
                    passHref
                  >
                    <FR title='France' className='h-6 w-6 text-slate-200' />
                  </Link>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
