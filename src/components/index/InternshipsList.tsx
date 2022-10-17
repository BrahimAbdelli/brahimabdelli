import { useTranslation } from 'next-i18next';

import { Card } from '../cards/Card';
import { CardGrid } from '../cards/CardGrid';

export const InternshipsList = () => {
  const { t } = useTranslation('common');
  return (
    <CardGrid>
      <Card
        title="Placeholder"
        link="https://auto-sans-risque.tn/home"
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
          'Firebase Google Storage',
        ]}
        highlighted
      >
        {`${t('home.internships.placeholder.description1')}`}
        <br />
        {`${t('home.internships.placeholder.description2')}`}
      </Card>
      <Card
        title="ESPRIT DSI"
        link="https://esprit.tn/"
        tags={[
          'NestJS',
          'NodeJS',
          'React',
          'Javascript',
          'Typescript',
          'MongoDB',
          'TypeORM',
        ]}
        highlighted
      >
        {`${t('home.internships.espritdsi.description1')}`}
        <br />
        {`${t('home.internships.espritdsi.description2')}`}
        <br />
      </Card>

      <Card
        title={`${t('home.internships.steg.name')}`}
        // link=""
        tags={['Spring Boot', 'Angular', 'MySQL']}
      >
        {`${t('home.internships.steg.description')}`}
      </Card>
    </CardGrid>
  );
};
