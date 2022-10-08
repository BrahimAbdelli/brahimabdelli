import {
  LazyMotion,
  m,
  domAnimation,
  useAnimation,
  motion,
} from 'framer-motion';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import DarkModeSwitch from '../components/background/CircleIndicator';

import { Card } from '../components/cards/Card';
import { CardGrid } from '../components/cards/CardGrid';
import Header from '../components/global/Header';
import { Activities } from '../components/index/Activities';
import { InternshipsList } from '../components/index/InternshipsList';
import { LinkToSection } from '../components/index/LinkToSection';
import { NameTitle } from '../components/index/NameTitle';
import { ProjectsList } from '../components/index/ProjectsList';
import { SectionTitle } from '../components/index/SectionTitle';
import {
  containerClasses,
  linkClasses,
  sectionBodyClasses,
  switchableTexts,
} from '../components/styles';

const BackgroundComponent = dynamic(() =>
  import('../components/background/Background').then(
    ({ Background }) => Background
  )
);

const Home: NextPage = () => {
  const { inView, entry, ref } = useInView();
  const animationControl = useAnimation();
  if (inView) {
    animationControl.start({
      x: 0,
      transition: {
        delay: 0.5,
      },
    });
  }
  return (
    <div>
      <Head>
        <title className="text-center">Brahim Abdelli</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DarkModeSwitch />
        <BackgroundComponent />
        <Header />
        <LazyMotion features={domAnimation}>
          <section className="z-50">
            <div className="min-h-screen flex flex-col justify-center relative">
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
                <div className="h-4 sm:h-0 mt-8"></div>
                <div className={sectionBodyClasses}>
                  <LinkToSection title="About Me" href="about">
                    I have accumulated experience in designing, developing,
                    testing and deploying web apps from scratch for 2 years.
                    <br />I hold perticular interest in Javascript, Typescript
                    and Java.
                    <br />
                    Also in optimization, enhancing app performance and SEO.
                  </LinkToSection>
                  <LinkToSection title="Projects" href="projects">
                    I'm always cooking something new.
                  </LinkToSection>
                  <LinkToSection title="Work Experience" href="experience">
                    Currently a Full Stack Developer at MSS.
                  </LinkToSection>
                  <LinkToSection title="Internships" href="internships">
                    As a software engineering student i did multiple
                    internships.
                  </LinkToSection>
                  <LinkToSection title="School" href="school">
                    Graduated with the highest honours from ESPRIT in 2021 after
                    pursuing a degree in software engineering.
                  </LinkToSection>
                  <LinkToSection title="Acitivities" href="activities">
                    Multiple things catch my attention.
                  </LinkToSection>
                </div>
                <div className="h-6 md:h-8 xl:h-16"></div>
                <div className="flex space-x-3 font-mono text-slate-400 sm:text-lg md:text-xl">
                  <Link
                    href="mailto:brahim.abdelli994@gmail.com"
                    target="_blank"
                  >
                    <a className={linkClasses} target="_blank">
                      Email
                    </a>
                  </Link>
                  ·
                  <Link href="https://github.com/BrahimAbdelli" target="_blank">
                    <a className={linkClasses} target="_blank">
                      Github
                    </a>
                  </Link>
                  ·
                  <Link href="https://www.linkedin.com/in/brahimabdelli/">
                    <a className={linkClasses} target="_blank">
                      Linkedin
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className={containerClasses} id="about" ref={ref}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 0 },
                }}
                whileHover={{ scale: 1.009 }}
              >
                <SectionTitle big accentText="01">
                  About Me
                </SectionTitle>
                <div className={`${sectionBodyClasses}`}>
                  <p className={`${switchableTexts}`}>
                    I'm a Full Stack developer with a passion for building web
                    solutions. Coding is an activity i exercie everyday with
                    passion.
                  </p>
                  <p className={`${switchableTexts}`}>
                    Outside coding, i listen and make music, go out and explore
                    new places with my friends. I love video games, reading,
                    watching old movies and sports.
                  </p>
                  <p className={`${switchableTexts}`}>
                    I strive to bring good energy, technical knowledge, and a
                    strong desire to learn with me wherever I go.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className={containerClasses} id="projects">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 0 },
                }}
              >
                <SectionTitle big accentText="02">
                  Projects
                </SectionTitle>
                <div className={sectionBodyClasses}>
                  <p className={`${switchableTexts}`}>
                    Catch all my public repositories on my Github profile.
                  </p>
                </div>
                <div className="h-8 lg:h-12"></div>
                <ProjectsList />
              </motion.div>
            </div>

            <div className={containerClasses} id="experience">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 0 },
                }}
              >
                <SectionTitle big accentText="03">
                  Work Experience
                </SectionTitle>
                <div className={`${sectionBodyClasses} ${switchableTexts}`}>
                  <p>
                    I'm currently working at MSS, developing websites for
                    banking solutions and financial services. this is my first
                    work experience excluding personal projects and
                    contributions. You can check us out in Linkedin.
                  </p>
                  <a
                    href="https://tn.linkedin.com/company/majda-smart-solutions"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-8 transition"
                  >
                    Majda Smart Solutions
                    {/*                 <ChevronRightIcon
                  className="ml-3 -mr-1 md:-mr-3 h-5 w-5"
                  aria-hidden="true"
                /> */}
                  </a>
                </div>
              </motion.div>
            </div>

            <div className={containerClasses} id="internships">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 0 },
                }}
              >
                <SectionTitle big accentText="04">
                  Internships
                </SectionTitle>
                <div className={sectionBodyClasses}>
                  <p>These are the internships that i did in the past.</p>
                </div>
                <div className="h-8 lg:h-12"></div>
                <InternshipsList />
              </motion.div>
            </div>

            <div className={containerClasses} id="school">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 0 },
                }}
              >
                <SectionTitle big accentText="05">
                  School
                </SectionTitle>
                <div className={sectionBodyClasses}>
                  <p>Had my software engineering degree from ESPRIT in 2021.</p>
                </div>
                <div className="h-8 lg:h-12"></div>
                <CardGrid>
                  <Card title="ESPRIT" link="https://esprit.tn/" highlighted>
                    Studied software engineering for 3 years.
                  </Card>
                  <Card title="ESPRIT" link="https://esprit.tn/" highlighted>
                    Pursued studies in electromechanical engineering for 2 years
                    before changing the course.
                  </Card>
                  <Card
                    title="ISET Rades"
                    link="http://www.isetr.rnu.tn/"
                    highlighted
                  >
                    Bachelor's degree in mechanical engineering specializing in
                    energy.
                  </Card>
                </CardGrid>
              </motion.div>
            </div>

            <div className={containerClasses} id="activities">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                variants={{
                  visible: { opacity: 1, scale: 1 },
                  hidden: { opacity: 0, scale: 0 },
                }}
              >
                <SectionTitle big accentText="06">
                  Activities
                </SectionTitle>
                <div className={sectionBodyClasses}>
                  <p>Life doesn't stop when you stop coding.</p>
                </div>
                <div className="h-8 lg:h-12"></div>
                <Activities />
              </motion.div>
            </div>

            <div className={containerClasses} id="contact">
              <SectionTitle big accentText="07">
                Contact Me
              </SectionTitle>
              <div className="flex space-x-3 font-mono text-slate-400 sm:text-lg md:text-xl">
                <Link href="mailto:brahim.abdelli994@gmail.com" target="_blank">
                  <a className={linkClasses} target="_blank">
                    Email
                  </a>
                </Link>
                ·
                <Link href="https://github.com/BrahimAbdelli" target="_blank">
                  <a className={linkClasses} target="_blank">
                    Github
                  </a>
                </Link>
                ·
                <Link href="https://www.linkedin.com/in/brahimabdelli/">
                  <a className={linkClasses} target="_blank">
                    Linkedin
                  </a>
                </Link>
              </div>
            </div>

            <div className="h-8 md:h-12 lg:h-16"></div>

            <div className={`${containerClasses} pb-6 md:pb-12 lg:pb-24`}>
              <div className="font-mono dark:text-slate-400 text-slate-600 text-xs md:text-sm lg:text-base">
                Copyright {new Date().getFullYear()} Brahim Abdelli.
                <br />
                Take care and remember, health comes first.
              </div>
            </div>
          </section>
        </LazyMotion>
      </main>
    </div>
  );
};

export default Home;
