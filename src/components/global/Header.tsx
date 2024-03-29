import { useState } from 'react';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import LanguageToggle from '../background/LanguageToggle';
import ThemeToggle from './ThemeToggle';

const MobileMenu: React.FC<{ children: any }> = ({ children }) => (
  <nav className="p-4 flex flex-col space-y-3 md:hidden">{children}</nav>
);

const MenuAlt4Svg: React.FC<{ menuOpen: any }> = ({ menuOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`transition duration-100 ease h-8 w-8 ${
      menuOpen ? 'transform rotate-90' : ''
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const pages = ['HOME'];

const navLinks = pages.map((page) => (
  <a
    key={page}
    className="no-underline text-gray-800 font-semibold hover:text-gray-600"
    href={`#${page}`}
  >
    {page}
  </a>
));

const Navbar: React.FC<{ menuOpen: any; setMenuOpen: any }> = ({
  menuOpen,
  setMenuOpen,
}) => {
  const { t } = useTranslation('common');
  const [showModal] = useState(false);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="cursor-pointer">
          <span className="no-underline dark:text-gray-300 text-slate-600 hover:text-gray-60 font-montserrat text-xs font-extrabold">
            BRAHIM ABDELLI
          </span>
        </div>
      </div>
      <nav className="items-center justify-between flex-wrap space-x-6 hidden md:block">
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow flex space-x-6 py-2">
            <Link href="/">
              <a className="no-underline dark:text-gray-300 text-slate-600 hover:text-gray-800 hover:dark:text-gray-300 font-montserrat text-xs font-extrabold pt-3">
                {t('header.home')}
              </a>
            </Link>
            <div className="pt-2">
              <ThemeToggle />
            </div>
            <div>
              <a
                className="flex items-center justify-center px-2 font-medium rounded-md text-black dark:text-green-custom shadow uppercase dark:hover:bg-slate-700 hover:bg-slate-100 
                hover:shadow-lg transform transition hover:-translate-y-1 focus:ring-2 focus:ring-blue-600 ring-offset-2 outline-none 
                focus:bg-blue-800 focus:shadow-lg active:bg-blue-900 pt-2"
                href="#"
                onClick={() => window.open(`/${t('header.resume')}`)}
              >
                {t('header.download')}
              </a>
            </div>
            <LanguageToggle />
          </div>
        </div>
        {showModal ? (
          <>
            <div
              className="fixed inset-0 overflow-hidden z-50"
              aria-labelledby="slide-over-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </>
        ) : null}
      </nav>

      <button
        type="button"
        aria-label="Toggle mobile menu"
        className="rounded md:hidden focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50"
      >
        <div className="flex">
          <div onClick={() => setMenuOpen(!menuOpen)} className="pt-1">
            <MenuAlt4Svg menuOpen={menuOpen} />
          </div>
          <ThemeToggle />
          <div className="pl-4">
            <LanguageToggle />
          </div>
        </div>
      </button>
    </div>
  );
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        {menuOpen && <MobileMenu>{navLinks}</MobileMenu>}
      </div>
    </header>
  );
}
