import type React from 'react';

import { useTranslation } from 'next-i18next';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';
import type { UseTranslationCommon } from 'src/types/types';

export default function Certifications(): React.ReactElement {
  const { t } = useTranslation('common') as UseTranslationCommon;
  return (
    <CardGrid>
      <Card
        title={t('home.certifications.ckad.name')}
        link='https://www.credly.com/badges/8b07b358-af2b-49cb-97e6-ab1b7f8adce6'
        tags={[t('home.certifications.ckad.tags')]}
        highlighted
      >
        {t('home.certifications.ckad.description')}
      </Card>
    </CardGrid>
  );
}
