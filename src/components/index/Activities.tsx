import { useTranslation } from 'next-i18next';
import type { UseTranslationCommon } from 'src/types/types';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

export default function Activities() {
  const { t } = useTranslation('common') as UseTranslationCommon;
  return (
    <CardGrid>
      <Card
        title={`${t('home.activities.music.name')}`}
        tags={[t('home.activities.music.name'), 'FL Studio']}
      >
        {`${t('home.activities.music.description1')}`}
        <br />
        {`${t('home.activities.music.description2')}`}
      </Card>
      <Card title='Reading' tags={[t('home.activities.reading.books')]}>
        {`${t('home.activities.reading.description')}`}
      </Card>
      <Card title={`${t('home.activities.travel.name')}`} tags={[t('home.activities.travel.name')]}>
        {`${t('home.activities.travel.description')}`}
      </Card>
    </CardGrid>
  );
}
