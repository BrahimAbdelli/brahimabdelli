import { useEffect, useRef } from 'react';

import {
  Camera,
  Color,
  Geometry,
  Mesh,
  Program,
  Renderer,
} from 'ogl-typescript';
import { useCounter } from 'react-use';

import { fragment, vertex } from './shaders';

export function Standard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [animationId, { inc: incrementAnimationId }] = useCounter(1);

  useEffect(() => {
    const renderer = new Renderer({
      depth: false,
      dpr: 2,
      alpha: true,
    });

    const { gl } = renderer;

    const camera = new Camera(gl, {
      fov: 15,
    });
    camera.position.z = 15;

    function handleReisze() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({
        aspect: gl.canvas.width / gl.canvas.height,
      });
    }

    try {
      containerRef.current.appendChild(gl.canvas);
      gl.clearColor(0, 0, 0, 0);
      window.addEventListener('resize', handleReisze, false);
      handleReisze();
    } catch (error) {}

    const numParticles = 100;
    const position = new Float32Array(numParticles * 3);
    const random = new Float32Array(numParticles * 4);

    for (let i = 0; i < numParticles; i++) {
      position.set([Math.random(), Math.random(), Math.random()], i * 3);
      random.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4
      );
    }

    const geometry = new Geometry(gl, {
      position: {
        size: 3,
        data: position,
      },
      random: {
        size: 4,
        data: random,
      },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new Color(0.3, 0.2, 0.5),
        },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, {
      mode: gl.POINTS,
      geometry,
      program,
    });

    function update(t) {
      incrementAnimationId(requestAnimationFrame(update));

      particles.rotation.z += 0.0025;
      program.uniforms.uTime.value = t * 0.00025;

      renderer.render({
        scene: particles,
        camera,
      });
    }
    incrementAnimationId(requestAnimationFrame(update));

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [containerRef]);

  return <div className=" fixed -z-50" ref={containerRef} />;
}
