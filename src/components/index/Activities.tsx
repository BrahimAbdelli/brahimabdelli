import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

const CardGrid = dynamic(() => import('../cards/CardGrid'), {
  ssr: false,
});
const Card = dynamic(() => import('../cards/Card'), {
  ssr: false,
});

export default function Activities() {
  const { t } = useTranslation('common');
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
      <Card title="Reading" tags={[t('home.activities.reading.books')]}>
        {`${t('home.activities.reading.description')}`}
      </Card>
      <Card
        title="Sports"
        tags={['Jogging', 'Football', t('home.activities.music.name')]}
      >
        {`${t('home.activities.sports.description')}`}
      </Card>
    </CardGrid>
  );
}
