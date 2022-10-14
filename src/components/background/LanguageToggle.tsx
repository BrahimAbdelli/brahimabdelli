import React, { useContext } from 'react';

import { motion } from 'framer-motion';
import { I18nContext } from 'next-i18next';
import { RiMoonClearFill, RiSunFill, RiEnglishInput } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LanguageToggle() {
  /*   const {
    i18n: { language },
  } = useContext(I18nContext); */

  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  };
  const router = useRouter();

  return (
    <>
      <Link
        href={router.pathname}
        locale={router.locale === 'en' ? 'fr' : 'en'}
        passHref
      >
        <a>Switch to</a>
      </Link>
      <div
        /*         onClick={() =>
          i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')
        } */
        className={`flex-start flex h-[50px] w-[100px] rounded-[50px] bg-zinc-100 p-[5px] shadow-inner hover:cursor-pointer dark:bg-zinc-700`}
      >
        <motion.div
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black/90"
          layout
          transition={spring}
        >
          {/*           <motion.div whileTap={{ rotate: 360 }}>
            {language === 'en' ? (
              <RiEnglishInput className="h-6 w-6 text-yellow-300" />
            ) : (
              <RiMoonClearFill className="h-6 w-6 text-slate-200" />
            )}
          </motion.div> */}
        </motion.div>
      </div>
    </>
  );
}
