import { Card } from '../cards/Card';
import { CardGrid } from '../cards/CardGrid';

export const ProjectsList = () => (
  <CardGrid>
    <Card
      title="Personal Portfolio"
      link="https://github.com/BrahimAbdelli/brahimabdelli"
      tags={['NextJS, TailwindCSS, Typescript']}
      highlighted
    >
      This is a personal portfolio i created in order to showcase my work as a
      software engineer. I will try to always update this project.
    </Card>
    <Card
      title="Auto Sans Risque"
      link="https://auto-sans-risque.tn/home"
      tags={[
        'React, NestJS, TailwindCSS, Javascript, Typescript, MongoDB, TypeORM',
      ]}
      highlighted
    >
      Previously promoted as Karhabtek. <br />
      It's a website that connects car experts and clients together. I developed
      the MVP for the project even integrating an online payment service.
      <br />
      This project is backed by BiatLabs incubator.
      <br />
      and still in the development phase with other developers.
    </Card>
    <Card
      title="Clothing Company"
      // link="https://auto-sans-risque.tn/home"
      tags={['NextJS, React ,NestJS, TailwindCSS, MongoDB']}
    >
      Developed a website for a clothing company allowing administrators to
      manage the stock.
    </Card>
    <Card
      title="Advent of Code"
      link="https://github.com/BrahimAbdelli/advent-of-code"
      tags={['Javascript']}
      highlighted
    >
      This repository contains my attempt at solving Advent of Code by annual
      set.
    </Card>

    <Card
      title="Tekmanda"
      link="https://www.tekmanda.com/"
      tags={['NextJS, ReactJS, Styled Components']}
      highlighted
    >
      I contributed by adding and implementing some features for this food
      services platform, my contribution was mainly in the frontend part.
    </Card>
  </CardGrid>
);
