import type React from 'react';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { RiGitRepositoryFill } from 'react-icons/ri';
import { SiGithub, SiMaildotru } from 'react-icons/si';

import { siteConfig } from 'site-config';

const Footer: React.FC = (): JSX.Element => {
  const { t } = useTranslation('common');
  return (
    <footer className='text-base-content'>
      {!siteConfig.hidePoweredBy && (
        <div className='mt-4 mb-2 text-zinc-400 dark:text-zinc-700 text-center text-xs'>
          <p>
            {t('footer.poweredby')}
            <a
              className='underline'
              href='https://github.com/BrahimAbdelli/brahimabdelli'
              rel='noreferrer'
              target='_blank'
              aria-label='notion blog kit repository'
              tabIndex={-1}
            >
              Brahim Abdelli
            </a>
          </p>
        </div>
      )}
      <div className='bg-base-200'>
        <div className='flex justify-between align-center mx-auto py-2 px-4'>
          <div className='text-xl font-bold'>{siteConfig.infomation.blogname}</div>
          <div className='flex items-center gap-2 text-2xl'>
            {siteConfig.infomation.email && (
              <a href={`mailto:${siteConfig.infomation.email}`} aria-label='send mail link'>
                <SiMaildotru />
              </a>
            )}
            {siteConfig.infomation.github && (
              <a
                href={siteConfig.infomation.github}
                rel='noreferrer'
                target='_blank'
                aria-label='visit github'
              >
                <SiGithub />
              </a>
            )}
            {siteConfig.infomation.repository && (
              <a
                href={siteConfig.infomation.repository}
                rel='noreferrer'
                target='_blank'
                aria-label='visit repository'
              >
                <RiGitRepositoryFill />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
