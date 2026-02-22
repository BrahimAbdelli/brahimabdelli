import { useTranslation } from 'next-i18next';
import type { UseTranslationCommon } from 'src/types/types';

import { useTranslation } from 'next-i18next';
import type { UseTranslationCommon } from 'src/types/types';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

export default function ProjectsList() {
  const { t } = useTranslation('common') as UseTranslationCommon;
  return (
    <CardGrid>
      <Card
        title='Nestier'
        link='https://github.com/BrahimAbdelli/nestjs-boilerplate'
        tags={['NodeJS', 'NestJS', 'MongoDB', 'TypeORM', 'Typescript']}
        highlighted
      >
        {`${t('home.projects.nestier.description')}`}
      </Card>
      <Card
        title='Personal Portfolio'
        link='https://github.com/BrahimAbdelli/brahimabdelli'
        tags={['NextJS, TailwindCSS, Typescript']}
        highlighted
      >
        {`${t('home.projects.portfolio.description')}`}
      </Card>
      <Card
        title='Auto Sans Risque'
        link='https://www.auto-sans-risque.com/'
        tags={['React, NodeJS, NestJS, TailwindCSS, Javascript, Typescript, MongoDB, TypeORM']}
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
        tags={['NextJS, React, NodeJS, NestJS, TailwindCSS, MongoDB']}
      >
        {`${t('home.projects.clothingcompany.description')}`}
      </Card>
      <Card
        title='Advent of Code'
        link='https://github.com/BrahimAbdelli/advent-of-code'
        tags={['Javascript']}
        highlighted
      >
        {`${t('home.projects.adventofcode.description')}`}
      </Card>

      <Card
        title='Tekmanda'
        link='https://www.tekmanda.com/'
        tags={['NextJS, ReactJS, Styled Components']}
        highlighted
      >
        {`${t('home.projects.tekmanda.description')}`}
      </Card>
    </CardGrid>
  );
}
