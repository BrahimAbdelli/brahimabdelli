import { US, FR } from 'country-flag-icons/react/3x2';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const spring: { type: 'spring'; stiffness: number; damping: number } = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35
};

export default function LanguageToggle() {
  const router: ReturnType<typeof useRouter> = useRouter();

  const isEn: boolean = router.locale === 'en';
  const slug: string | string[] | undefined = router.query['slug'];
  const href: string = typeof slug === 'string' ? `/${slug}` : router.pathname;

  return (
    <div
      data-testid='language-toggle'
      className='language-toggle relative flex h-9 w-20 items-center rounded-full border border-base-300 bg-base-200 p-1'
      role='group'
      aria-label='Language'
    >
      <motion.div
        layout
        transition={spring}
        className='absolute top-1 h-6 w-6 rounded-full bg-base-100 shadow-sm'
        style={{
          left: isEn ? 4 : 'calc(100% - 1.5rem - 4px)'
        }}
      />
      <Link
        href={href}
        locale='en'
        passHref
        className='language-toggle-link relative z-10 flex flex-1 items-center justify-center rounded-l-full py-1.5 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-base-content/20 focus:ring-inset'
        style={{ opacity: isEn ? 1 : 0.75 }}
        aria-label='Switch to English'
        data-testid='language-toggle-link-en'
      >
        <US
          title='English'
          className='h-4 w-4 rounded-sm object-cover'
          data-testid='language-toggle-flag-en'
        />
      </Link>
      <Link
        href={href}
        locale='fr'
        passHref
        className='language-toggle-link relative z-10 flex flex-1 items-center justify-center rounded-r-full py-1.5 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-base-content/20 focus:ring-inset'
        style={{ opacity: isEn ? 0.75 : 1 }}
        aria-label='Switch to French'
        data-testid='language-toggle-link-fr'
      >
        <FR
          title='Français'
          className='h-4 w-4 rounded-sm object-cover'
          data-testid='language-toggle-flag-fr'
        />
      </Link>
    </div>
  );
}
