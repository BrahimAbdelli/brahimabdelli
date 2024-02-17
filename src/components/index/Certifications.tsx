import type React from 'react';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

export default function Certifications() {
  return (
    <CardGrid>
      <Card
        title='CKAD : Certified Kubernetes Application Developer'
        link='https://www.credly.com/badges/8b07b358-af2b-49cb-97e6-ab1b7f8adce6'
        tags={['Kubernetes, Devops, Docker']}
        highlighted
      >
        A certification that certifies that candidates can design, build and deploy cloud-native
        applications for Kubernetes.
      </Card>
    </CardGrid>
  );
}
