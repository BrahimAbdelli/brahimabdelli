import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiMoonClearFill, RiEnglishInput } from 'react-icons/ri';

export default function LanguageToggle() {
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  };
  const router = useRouter();

  return (
    <>
      <div
        className={`flex-start flex h-[50px] w-[100px] rounded-[50px] bg-zinc-100 p-[5px] shadow-inner hover:cursor-pointer dark:bg-zinc-700 ${
          router.locale === 'en' && 'place-content-end'
        }`}
      >
        <motion.div
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black/90"
          layout
          transition={spring}
        >
          <motion.div whileTap={{ rotate: 360 }}>
            {router.locale === 'en' ? (
              <>
                <Link
                  href={router.pathname}
                  locale={router.locale === 'en' ? 'fr' : 'en'}
                  passHref
                >
                  <a>
                    <RiEnglishInput className="h-6 w-6 text-yellow-300" />
                  </a>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={router.pathname}
                  locale={router.locale === 'fr' ? 'en' : 'fr'}
                  passHref
                >
                  <a>
                    <RiMoonClearFill className="h-6 w-6 text-slate-200" />
                  </a>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
