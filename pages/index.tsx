import type React from 'react';

import { LazyMotion, domAnimation, m, motion, useAnimation } from 'framer-motion';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import { BlogProperties, GetNotionBlock } from 'src/types/notion';

import Card from 'src/components/cards/Card';
import CardGrid from 'src/components/cards/CardGrid';
import Activities from 'src/components/index/Activities';
import InternshipsList from 'src/components/index/InternshipsList';
import LatestArticles from 'src/components/index/LatestArticles';
import NameTitle from 'src/components/index/NameTitle';
import ProjectsList from 'src/components/index/ProjectsList';
import ResourcesList from 'src/components/index/ResourcesList';
import Certifications from 'src/components/index/Certifications';
import SectionTitle from 'src/components/index/SectionTitle';
import TechStack from 'src/components/index/TechStack';
import type { Article } from 'src/lib/articles';

import {
  containerClasses,
  containerClassesNoYPadding,
  linkClasses,
  sectionBodyClasses,
  switchableTexts
} from 'src/components/styles';

interface HomeProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
  latestArticles?: Article[];
}

const Home: NextPage<HomeProps> = ({ latestArticles = [] }) => {
  const { inView, ref }: ReturnType<typeof useInView> = useInView();
  const animationControl: ReturnType<typeof useAnimation> = useAnimation();
  const { t }: ReturnType<typeof useTranslation> = useTranslation('common');

  if (inView) {
    void animationControl.start({
      x: 0,
      transition: {
        delay: 0.5
      }
    });
  }
  return (
    <div>
      <main>
          <LazyMotion features={domAnimation}>
            <section className='z-50'>
              <div className='flex flex-col justify-center relative pt-24 sm:pt-32 lg:pt-40'>
                <div className={`${containerClassesNoYPadding}`}>
                  <m.div
                    initial={{ opacity: 0, scale: 1, y: -100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 100 }}
                  >
                    <NameTitle big accentText={`${t('home.hello')}`}>
                      {t('home.name')}
                    </NameTitle>
                  </m.div>
                  <div className='mt-6 sm:mt-8 max-w-prose'>
                    <p className='text-slate-500 dark:text-slate-400 text-lg sm:text-xl leading-relaxed'>
                      {t('home.bio')}
                    </p>
                  </div>
                  <div className='h-6 md:h-8'></div>
                  <div className='flex items-center gap-5'>
                    <Link href='https://github.com/BrahimAbdelli' target='_blank' aria-label='GitHub' className='text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors'>
                      <svg viewBox='0 0 24 24' className='w-6 h-6' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                    </Link>
                    <Link href='https://www.linkedin.com/in/brahimabdelli/' target='_blank' aria-label='LinkedIn' className='text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors'>
                      <svg viewBox='0 0 24 24' className='w-6 h-6' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                    </Link>
                    <Link href='mailto:brahim.abdelli994@gmail.com' target='_blank' aria-label='Email' className='text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors'>
                      <svg viewBox='0 0 24 24' className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='2' y='4' width='20' height='16' rx='2'/><path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/></svg>
                    </Link>
                  </div>
                </div>
              </div>

              {latestArticles.length > 0 && (
                <div className={`${containerClassesNoYPadding} py-10 lg:py-16`} id='articles'>
                  <m.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h2 className='text-lg font-mono text-fuchsia-500 dark:text-green-custom mb-6'>
                      {t('home.articles.name', { defaultValue: 'Latest Articles' })}
                    </h2>
                    <LatestArticles articles={latestArticles} />
                  </m.div>
                </div>
              )}

              <div className={containerClasses} id='about' ref={ref}>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                  whileHover={{ scale: 1.009 }}
                >
                  <SectionTitle big accentText='01'>
                    {`${t('home.aboutme.name')}`}
                  </SectionTitle>
                  <div className={`${sectionBodyClasses}`}>
                    <p className={`${switchableTexts}`}>{`${t('home.aboutme.bio1')}`}</p>
                    <p className={`${switchableTexts}`}>{`${t('home.aboutme.bio2')}`}</p>
                    <p className={`${switchableTexts}`}>{`${t('home.aboutme.bio3')}`}</p>
                  </div>
                </motion.div>
              </div>

              <div className={containerClasses} id='experience'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='02'>
                    {t('home.workexperience.name')}
                  </SectionTitle>
                  <div className={`${sectionBodyClasses} ${switchableTexts}`}>
                    <div>
                      <p>{t('home.workexperience.softeam.descriptionShort')}</p>
                      <TechStack value={t('home.workexperience.softeam.tech')} />
                    </div>
                    <a
                      href='https://www.linkedin.com/company/softeam-/'
                      className='inline-flex items-center justify-center px-6 py-3 border border-slate-200 dark:border-transparent text-base font-medium rounded-md text-slate-800 bg-slate-100 hover:bg-slate-200 dark:text-white dark:bg-slate-800 dark:hover:bg-slate-700 md:py-4 md:text-lg md:px-8 transition'
                    >
                      {t('home.company.softeam')}
                    </a>
                    <div className='h-6 md:h-8'></div>
                    <div>
                      <p>{t('home.workexperience.excellia.description')}</p>
                      <TechStack value={t('home.workexperience.excellia.tech')} />
                    </div>
                    <a
                      href='https://www.linkedin.com/company/excellia-solutions-tn'
                      className='inline-flex items-center justify-center px-6 py-3 border border-slate-200 dark:border-transparent text-base font-medium rounded-md text-slate-800 bg-slate-100 hover:bg-slate-200 dark:text-white dark:bg-slate-800 dark:hover:bg-slate-700 md:py-4 md:text-lg md:px-8 transition'
                    >
                      {t('home.company.excellia')}
                    </a>
                  </div>
                </motion.div>
              </div>

              <div className={containerClasses} id='projects'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='03'>
                    {`${t('home.projects.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p className={`${switchableTexts}`}>{`${t('home.projects.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <ProjectsList />
                </motion.div>
              </div>
              <div className={containerClasses} id='certifications'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='04'>
                    {`${t('home.certifications.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.certifications.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <Certifications />
                </motion.div>
              </div>

              <div className={containerClasses} id='internships'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='05'>
                    {`${t('home.internships.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.internships.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <InternshipsList />
                </motion.div>
              </div>

              <div className={containerClasses} id='school'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='06'>
                    {`${t('home.school.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.school.description2')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <CardGrid>
                    <Card title={t('home.schools.esprit')} link='https://esprit.tn/' highlighted>
                      {`${t('home.school.espritinfo.description')}`}
                    </Card>
                    <Card title={t('home.schools.esprit')} link='https://esprit.tn/' highlighted>
                      {`${t('home.school.espritelectro.description')}`}
                    </Card>
                    <Card title={t('home.schools.isetrades')} link='http://www.isetr.rnu.tn/' highlighted>
                      {`${t('home.school.isetrades.description')}`}
                    </Card>
                  </CardGrid>
                </motion.div>
              </div>

              <div className={containerClasses} id='activities'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='07'>
                    {`${t('home.activities.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.activities.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <Activities />
                </motion.div>
              </div>

              <div className={containerClasses} id='resources'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0 }}
                  variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                  }}
                >
                  <SectionTitle big accentText='08'>
                    {`${t('home.resources.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.resources.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <ResourcesList />
                </motion.div>
              </div>

              <div className={containerClasses} id='contact'>
                <SectionTitle big accentText='09'>
                  {`${t('home.contanctme')}`}
                </SectionTitle>
                <div className='flex items-center gap-5'>
                  <Link href='https://github.com/BrahimAbdelli' target='_blank' aria-label='GitHub' className='text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors'>
                    <svg viewBox='0 0 24 24' className='w-7 h-7' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                  </Link>
                  <Link href='https://www.linkedin.com/in/brahimabdelli/' target='_blank' aria-label='LinkedIn' className='text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors'>
                    <svg viewBox='0 0 24 24' className='w-7 h-7' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                  </Link>
                  <Link href='mailto:brahim.abdelli994@gmail.com' target='_blank' aria-label='Email' className='text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-green-custom transition-colors'>
                    <svg viewBox='0 0 24 24' className='w-7 h-7' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='2' y='4' width='20' height='16' rx='2'/><path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/></svg>
                  </Link>
                </div>
              </div>

              <div className='h-8 md:h-12 lg:h-16'></div>

              <div className={`${containerClasses} pb-6 md:pb-12 lg:pb-24`}>
                <div className='font-mono dark:text-slate-400 text-slate-600 text-xs md:text-sm lg:text-base'>
                  {`${t('home.copyright')}`} {new Date().getFullYear()} {t('home.name')}.
                  <br />
                  {`${t('home.takecare')}`}
                </div>
              </div>
            </section>
          </LazyMotion>
      </main>
    </div>
  );
};

export const getStaticProps = async ({
  locale
}: {
  locale: string | undefined;
}) => {
  const { featureFlags } = await import('src/lib/featureFlags');

  let latestArticles: Article[] = [];
  if (!featureFlags.useNotion) {
    const { getAllArticles } = await import('src/lib/articles');
    latestArticles = getAllArticles().slice(0, 3);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      latestArticles: structuredClone(latestArticles),
    }
  };
};

export default Home;
