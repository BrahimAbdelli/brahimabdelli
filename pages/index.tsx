import type React from 'react';

import { LazyMotion, domAnimation, m, motion, useAnimation } from 'framer-motion';
import type { NextPage } from 'next';
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
}

const Home: NextPage<HomeProps> = () => {
  const { inView, ref } = useInView();
  const animationControl = useAnimation();

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
                    <NameTitle big accentText="Hello! It's me">
                      Brahim Abdelli
                    </NameTitle>
                  </m.div>
                  <div className='h-4 sm:h-0 mt-8'></div>
                  <div className={sectionBodyClasses}>
                    <LinkToSection title='ABOUT ME' href='about'>
                      I have accumulated experience in designing, developing, testing, and deploying
                      web apps from scratch for 2 years.
                      <br />
                      I hold a particular interest in Javascript, Typescript, and Java.
                      <br />
                      Also in optimization, enhancing app performance and SEO.
                    </LinkToSection>
                    <LinkToSection title='PROJECTS' href='projects'>
                      I&apos;m always cooking something new.
                    </LinkToSection>
                    <LinkToSection title='WORK EXPERIENCE' href='experience'>
                      Currently a Full Stack Developer at MSS.
                    </LinkToSection>
                    <LinkToSection title='INTERNSHIPS' href='internships'>
                      As a software engineering student I did multiple internships.
                    </LinkToSection>
                    <LinkToSection title='SCHOOL' href='school'>
                      Graduated with the highest honors from ESPRIT in 2021 after pursuing a degree
                      in software engineering.
                    </LinkToSection>
                    <LinkToSection title='ACTIVITIES' href='activities'>
                      Multiple things catch my attention.
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
                    ABOUT ME
                  </SectionTitle>
                  <div className={`${sectionBodyClasses}`}>
                    <p className={`${switchableTexts}`}>
                      I&apos;m a Full Stack developer with a passion for building web solutions.
                      Coding is an activity I exercise every day with passion.
                    </p>
                    <p className={`${switchableTexts}`}>
                      Outside coding, I listen and make music, go out and explore new places with my
                      friends. I love video games, reading, watching old movies, and sports.
                    </p>
                    <p className={`${switchableTexts}`}>
                      I strive to bring good energy, technical knowledge, and a strong desire to
                      learn with me wherever I go.
                    </p>
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
                    PROJECTS
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p className={`${switchableTexts}`}>
                      Catch all my public repositories on my GitHub profile.
                    </p>
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
                    WORK EXPERIENCE
                  </SectionTitle>
                  <div className={`${sectionBodyClasses} ${switchableTexts}`}>
                    <p>
                      I&apos;m currently working at MSS, developing websites for banking solutions
                      and financial services. this is my first work experience excluding personal
                      projects and contributions. You can check us out in Linkedin.
                    </p>
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
                    INTERNSHIPS
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>These are the internships that I did in the past.</p>
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
                    SCHOOL
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>Had my software engineering degree from ESPRIT in 2021.</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <CardGrid>
                    <Card title='ESPRIT' link='https://esprit.tn/' highlighted>
                      Studied software engineering for 3 years.
                    </Card>
                    <Card title='ESPRIT' link='https://esprit.tn/' highlighted>
                      Pursued studies in electromechanical engineering for 2 years before changing
                      the course.
                    </Card>
                    <Card title='ISET Rades' link='http://www.isetr.rnu.tn/' highlighted>
                      Bachelor&apos;s degree in mechanical engineering specializing in energy.
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
                    ACTIVITIES
                  </SectionTitle>
                  <div className={sectionBodyClasses}>
                    <p>Life doesn&apos;t stop when you stop coding.</p>
                  </div>
                  <div className='h-8 lg:h-12'></div>
                  <Activities />
                </motion.div>
              </div>

              <div className={containerClasses} id='contact'>
                <SectionTitle big accentText='07'>
                  Contact Me
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
                  Copyright {new Date().getFullYear()} Brahim Abdelli.
                  <br />
                  Take care and remember, health comes first.
                </div>
              </div>
            </section>
          </LazyMotion>
        </main>
      </div>
    </>
  );
};

export default Home;
