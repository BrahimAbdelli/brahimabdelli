import { useTheme } from 'next-themes';
import Particles from 'react-tsparticles';

export default function BackgroundParticles() {
  const { theme } = useTheme();

  return (
    <Particles
      params={{
        fpsLimit: 60,
        background: { opacity: 0.4 },
        fullScreen: {
          // enable this value in case you want the particles to cover the hole background of the web page.
          enable: false,
          zIndex: 10,
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onClick: { enable: true, mode: 'attract' },
            onHover: { enable: true, mode: 'light' },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: { particles_nb: 4 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          // zIndex: 0,
          color: { value: `${theme == 'light' ? '#0000' : '#ffff'}` },
          links: {
            color: `${theme == 'light' ? '#0000' : '#ffff'}`,
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            bounce: false,
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 1,
            straight: false,
          },
          number: { density: { enable: true, value_area: 2000 }, value: 250 },
          opacity: { value: 0.2 },
          shape: { type: 'circle' },
          size: { random: true, value: 5 },
        },
        detectRetina: true,
      }}
    />
  );
}
