import type React from 'react';

import { useTranslation } from 'next-i18next';
import type { UseTranslationCommon } from 'src/types/types';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

const HUSSEIN_LINKS = [
  { url: 'https://www.youtube.com/@hnasr', label: 'YouTube' },
  { url: 'https://www.udemy.com/user/hussein-nasser-7/', label: 'Udemy' }
];

const SIMPLE_RESOURCES: { id: string; url: string; type: string }[] = [
  { id: 'webdevcody', url: 'https://www.youtube.com/@WebDevCody', type: 'YouTube' },
  { id: 'primeagen', url: 'https://www.youtube.com/c/theprimeagen', type: 'YouTube' },
  { id: 'devto', url: 'https://dev.to/', type: 'dev.to' },
  { id: 'fireship', url: 'https://www.youtube.com/c/fireship', type: 'YouTube' }
];

const linkClass =
  'text-fuchsia-600 dark:text-green-custom hover:underline font-mono';

export default function ResourcesList(): React.ReactElement {
  const { t } = useTranslation('common') as UseTranslationCommon;
  return (
    <CardGrid>
      <Card
        key='hussein'
        title={t('home.resources.items.hussein')}
        tags={['YouTube', 'Udemy']}
        highlighted
      >
        <>
          {t('home.resources.items.husseinDescription')}
          <span className='mt-2 block'>
            {HUSSEIN_LINKS.map(({ url, label }, i) => (
              <span key={url}>
                {i > 0 && ' · '}
                <a
                  href={url}
                  target='_blank'
                  rel='noreferrer'
                  className={linkClass}
                  onClick={(e) => e.stopPropagation()}
                >
                  {label}
                </a>
              </span>
            ))}
          </span>
        </>
      </Card>
      {SIMPLE_RESOURCES.map(({ id, url, type }) => {
        const nameKey = `home.resources.items.${id}`;
        const descKey = `home.resources.items.${id}Description`;
        const description = t(descKey, { defaultValue: '' });
        return (
          <Card
            key={id}
            title={t(nameKey)}
            link={url}
            tags={[type]}
            highlighted
          >
            {description || undefined}
          </Card>
        );
      })}
    </CardGrid>
  );
}
