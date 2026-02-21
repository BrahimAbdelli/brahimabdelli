import type React from 'react';

import { useTranslation } from 'next-i18next';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';
import type { UseTranslationCommon } from 'src/types/types';

export default function InternshipsList(): React.ReactElement {
  const { t } = useTranslation('common') as UseTranslationCommon;
  return (
    <CardGrid>
      <Card
        title='Placeholder'
        link='https://www.auto-sans-risque.com/'
        tags={[
          'NodeJS',
          'NestJS',
          'React',
          'Redux',
          'MongoDB',
          'TypeORM',
          'TailwindCSS',
          'Bootstrap',
          'Puppeteer',
          'Socket.IO',
          'Bull',
          'Redis',
          'GPG Checkout',
          'Jest',
          'Firebase Google Storage'
        ]}
        highlighted
      >
        {`${t('home.internships.placeholder.description')}`}
      </Card>
      <Card
        title='ESPRIT DSI'
        link='https://esprit.tn/'
        tags={['NestJS', 'NodeJS', 'React', 'Javascript', 'Typescript', 'MongoDB', 'TypeORM']}
        highlighted
      >
        {`${t('home.internships.espritdsi.description1')}`}
        <br />
        {`${t('home.internships.espritdsi.description2')}`}
      </Card>

      <Card
        title={`${t('home.internships.steg.name')}`}
        tags={['Spring Boot', 'Angular', 'MySQL']}
      >
        {`${t('home.internships.steg.description')}`}
      </Card>
    </CardGrid>
  );
}
