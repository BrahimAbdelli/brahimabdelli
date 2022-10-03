import { Card } from '../cards/Card';
import { CardGrid } from '../cards/CardGrid';

export const Activities = () => (
  <CardGrid>
    <Card title="Music" tags={['Music', 'FL Studio']}>
      Making and listening to music is a huge part of my life.
      <br /> Don't be surprised if clicking on this section one day will
      redirect you to Spotify.
    </Card>
    <Card title="Reading" tags={['Books']}>
      I Love reading anything from history to novels.
    </Card>
    <Card title="Sports" tags={['Jogging, Football, Swimming']}>
      Anything that gets the blood pumping and involves challenges.
    </Card>
  </CardGrid>
);