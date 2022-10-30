import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('../cards/Card'));
const CardGrid = dynamic(() => import('../cards/CardGrid'));

export default function ProjectsList() {
  const { t } = useTranslation('common');
  return (
    <CardGrid>
      <Card
        title="Personal Portfolio"
        link="https://github.com/BrahimAbdelli/brahimabdelli"
        tags={['NextJS, TailwindCSS, Typescript']}
        highlighted
      >
        {`${t('home.projects.portfolio.description')}`}
      </Card>
      <Card
        title="Auto Sans Risque"
        link="https://auto-sans-risque.tn/home"
        tags={[
          'React, NestJS, TailwindCSS, Javascript, Typescript, MongoDB, TypeORM',
        ]}
        highlighted
      >
        {`${t('home.projects.autosansrisque.description1')}`}
        <br />
        {`${t('home.projects.autosansrisque.description2')}`}
        <br />
        {`${t('home.projects.autosansrisque.description3')}`}
        <br />
        {`${t('home.projects.autosansrisque.description4')}`}
      </Card>
      <Card
        title={`${t('home.projects.clothingcompany.name')}`}
        // link=""
        tags={['NextJS, React ,NestJS, TailwindCSS, MongoDB']}
      >
        {`${t('home.projects.clothingcompany.description')}`}
      </Card>
      <Card
        title="Advent of Code"
        link="https://github.com/BrahimAbdelli/advent-of-code"
        tags={['Javascript']}
        highlighted
      >
        {`${t('home.projects.adventofcode.description')}`}
      </Card>

      <Card
        title="Tekmanda"
        link="https://www.tekmanda.com/"
        tags={['NextJS, ReactJS, Styled Components']}
        highlighted
      >
        {`${t('home.projects.tekmanda.description')}`}
      </Card>
    </CardGrid>
  );
}
