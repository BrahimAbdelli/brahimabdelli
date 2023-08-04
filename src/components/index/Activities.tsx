import type React from 'react';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

export default function Activities() {
  return (
    <CardGrid>
      <Card title='Music' tags={['Music', 'FL Studio']}>
        Making and listening to music is a huge part of my life.
        <br />
        Don&apos;t be surprised if clicking on this section one day will redirect you to Spotify.
      </Card>
      <Card title='Reading' tags={['Books']}>
        I Love reading anything from history to novels.
      </Card>
      <Card title='Sports' tags={['Jogging', 'Football', 'Music']}>
        Anything that gets the blood pumping and involves challenges.
      </Card>
    </CardGrid>
  );
}
