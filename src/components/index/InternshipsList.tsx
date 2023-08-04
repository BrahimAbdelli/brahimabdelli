import type React from 'react';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

export default function InternshipsList() {
  return (
    <CardGrid>
      <Card
        title='Placeholder'
        link='https://auto-sans-risque.tn/home'
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
        Development of a website that connects car experts and clients
        <br />
        This project is still in the development phase with other developers.
      </Card>
      <Card
        title='ESPRIT DSI'
        link='https://esprit.tn/'
        tags={['NestJS', 'NodeJS', 'React', 'Javascript', 'Typescript', 'MongoDB', 'TypeORM']}
        highlighted
      >
        Internal site scrapping and automatic update of the indexing dictionary.
        <br />
        Development of member management, a project management and an RDI (Research, Development and
        Innovation).
        <br />
      </Card>

      <Card
        title='Tunisian Company of Electricity and Gas'
        tags={['Spring Boot', 'Angular', 'MySQL']}
      >
        Development of an internal website for library management.
      </Card>
    </CardGrid>
  );
}
