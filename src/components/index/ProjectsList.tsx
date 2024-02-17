import type React from 'react';

import Card from '../cards/Card';
import CardGrid from '../cards/CardGrid';

export default function ProjectsList() {
  return (
    <CardGrid>
      <Card
        title='NestJS Boilerplate'
        link='https://github.com/BrahimAbdelli/nestjs-boilerplate'
        tags={['NestJS, MongoDB, TypeORM, Typescript']}
        highlighted
      >
        Supported by the NestJS official awesome-nestjs project that supports curated repositories
        build by the framework,This is a boilerplate that uses abstraction to create generic
        controller, service, dtos and entity, aiming to encapsulate the reusable logic throughout
        the project in one centralized base module.
      </Card>
      <Card
        title='Personal Portfolio'
        link='https://github.com/BrahimAbdelli/brahimabdelli'
        tags={['NextJS, TailwindCSS, Typescript']}
        highlighted
      >
        This is a personal Portfolio I created to showcase my work as a software engineer. I will
        try to always update this project.
      </Card>
      <Card
        title='Auto Sans Risque'
        link='https://auto-sans-risque.tn/home'
        tags={['React, NestJS, TailwindCSS, Javascript, Typescript, MongoDB, TypeORM']}
        highlighted
      >
        Previously promoted as Karhabtek.
        <br />
        It&apos;s a website that connects car experts and clients. I developed the MVP for the
        project even integrating an online payment service.
        <br />
        This project is backed by BiatLabs incubator.
        <br />
        and still in the development phase with other developers.
      </Card>
      <Card title='Clothing Company' tags={['NextJS, React ,NestJS, TailwindCSS, MongoDB']}>
        Developed a website for a clothing company allowing administrators to manage the stock.
      </Card>
      <Card
        title='Advent of Code'
        link='https://github.com/BrahimAbdelli/advent-of-code'
        tags={['Javascript']}
        highlighted
      >
        This repository contains my attempt at solving Advent of Code by annual set.
      </Card>

      <Card
        title='Tekmanda'
        link='https://www.tekmanda.com/'
        tags={['NextJS, ReactJS, Styled Components']}
        highlighted
      >
        I contributed by adding and implementing some features for this food services platform, my
        contribution was mainly in the Frontend part.
      </Card>
    </CardGrid>
  );
}
