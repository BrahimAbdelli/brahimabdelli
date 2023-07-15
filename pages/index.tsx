import type React from 'react';

import { LazyMotion, domAnimation, m, motion, useAnimation } from 'framer-motion';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import { BlogProperties, GetNotionBlock } from 'src/types/notion';

import Card from '../src/components/cards/Card';
import CardGrid from '../src/components/cards/CardGrid';
import Activities from '../src/components/index/Activities';
import InternshipsList from '../src/components/index/InternshipsList';
import LinkToSection from '../src/components/index/LinkToSection';
import NameTitle from '../src/components/index/NameTitle';
import ProjectsList from '../src/components/index/ProjectsList';
import SectionTitle from '../src/components/index/SectionTitle';
import {
  containerClasses,
  linkClasses,
  sectionBodyClasses,
  switchableTexts
} from '../src/components/styles';

interface HomeProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
  // local: string;
}

const Home: NextPage<HomeProps> = () => {
  const { inView, ref } = useInView();
  const animationControl = useAnimation();
  const { t } = useTranslation('common');

  if (inView) {
    animationControl.start({
      x: 0,
      transition: {
        delay: 0.5
      }
    });
  }
  return (
    <>
      <div>
        <main>
          {/* <Header /> */}
          <LazyMotion features={domAnimation}>
            <section className='z-50'>
              <div className='min-h-screen flex flex-col justify-center relative'>
                <div className={`${containerClasses}`}>
                  <m.div
                    initial={{ opacity: 0, scale: 1, y: -100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 100 }}
                  >
                    <NameTitle big accentText={`${t('home.hello')}`}>
                      Brahim Abdelli
                    </NameTitle>
                  </m.div>
                  <div className='h-4 sm:h-0 mt-8'></div>
                  <div className={sectionBodyClasses}>
                    <LinkToSection title={`${t('home.aboutme.name')}`} href='about'>
                      {`${t('home.aboutme.description1')}`}
                      <br />
                      {`${t('home.aboutme.description2')}`}
                      <br />
                      {`${t('home.aboutme.description3')}`}
                    </LinkToSection>
                    <LinkToSection title={`${t('home.projects.name')}`} href='projects'>
                      {t('home.projects.bio')}
                    </LinkToSection>
                    <LinkToSection title={`${t('home.workexperience.name')}`} href='experience'>
                      {`${t('home.workexperience.bio')}`}
                    </LinkToSection>
                    <LinkToSection title={`${t('home.internships.name')}`} href='internships'>
                      {`${t('home.internships.bio')}`}
                    </LinkToSection>
                    <LinkToSection title={`${t('home.school.name')}`} href='school'>
                      {`${t('home.school.description1')}`}
                    </LinkToSection>
                    <LinkToSection title={`${t('home.activities.name')}`} href='activities'>
                      {`${t('home.activities.bio')}`}
                    </LinkToSection>
                  </div>
                  <div className='h-6 md:h-8 xl:h-16'></div>
                  <div className='flex space-x-3 font-mono text-slate-400 sm:text-lg md:text-xl'>
                    <Link
                      href='mailto:brahim.abdelli994@gmail.com'
                      className={linkClasses}
                      target='_blank'
                    >
                      Email
                    </Link>
                    ·
                    <Link
                      href='https://github.com/BrahimAbdelli'
                      target='_blank'
                      className={linkClasses}
                    >
                      Github
                    </Link>
                    ·
                    <Link href='https://www.linkedin.com/in/brahimabdelli/' className={linkClasses}>
                      Linkedin
                    </Link>
                  </div>
                </div>
              </div>

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
                  <SectionTitle big accentText='02'>
                    {`${t('home.projects.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p className={`${switchableTexts}`}>{`${t('home.projects.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <ProjectsList />
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
                  <SectionTitle big accentText='03'>
                    {`${t('home.workexperience.name')}`}
                  </SectionTitle>
                  <div className={`${sectionBodyClasses} ${switchableTexts}`}>
                    <p>{`${t('home.workexperience.description')}`}</p>
                    <a
                      href='https://tn.linkedin.com/company/majda-smart-solutions'
                      className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-8 transition'
                    >
                      Majda Smart Solutions
                    </a>
                  </div>
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
                  <SectionTitle big accentText='04'>
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
                  <SectionTitle big accentText='05'>
                    {`${t('home.school.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.school.description2')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <CardGrid>
                    <Card title='ESPRIT' link='https://esprit.tn/' highlighted>
                      {`${t('home.school.espritinfo.description')}`}
                    </Card>
                    <Card title='ESPRIT' link='https://esprit.tn/' highlighted>
                      {`${t('home.school.espritelectro.description')}`}
                    </Card>
                    <Card title='ISET Rades' link='http://www.isetr.rnu.tn/' highlighted>
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
                  <SectionTitle big accentText='06'>
                    {`${t('home.activities.name')}`}
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>{`${t('home.activities.description')}`}</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <Activities />
                </motion.div>
              </div>

              <div className={containerClasses} id='contact'>
                <SectionTitle big accentText='07'>
                  {`${t('home.contanctme')}`}
                </SectionTitle>
                <div className='flex space-x-3 font-mono text-slate-400 sm:text-lg md:text-xl'>
                  <Link
                    href='mailto:brahim.abdelli994@gmail.com'
                    target='_blank'
                    className={linkClasses}
                  >
                    Email
                  </Link>
                  ·
                  <Link
                    href='https://github.com/BrahimAbdelli'
                    target='_blank'
                    className={linkClasses}
                  >
                    Github
                  </Link>
                  ·
                  <Link href='https://www.linkedin.com/in/brahimabdelli/' className={linkClasses}>
                    Linkedin
                  </Link>
                </div>
              </div>

              <div className='h-8 md:h-12 lg:h-16'></div>

              <div className={`${containerClasses} pb-6 md:pb-12 lg:pb-24`}>
                <div className='font-mono dark:text-slate-400 text-slate-600 text-xs md:text-sm lg:text-base'>
                  {`${t('home.copyright')}`} {new Date().getFullYear()} Brahim Abdelli.
                  <br />
                  {`${t('home.takecare')}`}
                </div>
              </div>
            </section>
          </LazyMotion>
        </main>
      </div>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
};

export default Home;
