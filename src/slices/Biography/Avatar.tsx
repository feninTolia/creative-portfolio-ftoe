'use client';
import { useGSAP } from '@gsap/react';
import { ImageFieldImage } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import clsx from 'clsx';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

type Props = { image: ImageFieldImage; className?: string };

export const Avatar = ({ image, className }: Props) => {
  const component = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.avatar',
      { opacity: 0, scale: 1.4 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.inOut' }
    );

    window.onmousemove = (e) => {
      if (!component.current) return;
      const componentRect = component.current.getBoundingClientRect();
      const componentCenterX = componentRect.left + componentRect.width / 2;
      const componentCenterY = componentRect.top + componentRect.height / 2;

      const componentPercent = {
        x: (e.clientX - componentCenterX) / componentRect.width / 2,
        y: (e.clientY - componentCenterY) / componentRect.height / 2,
      };

      const distFromCenter = 1 - Math.abs(componentPercent.x);

      gsap
        .timeline({
          defaults: { duration: 0.5, overwrite: 'auto', ease: 'power3.out' },
        })
        .to(
          '.avatar',
          {
            rotation: gsap.utils.clamp(-2, 2, 5 * componentPercent.x),
            x: gsap.utils.clamp(-20, 20, 50 * componentPercent.x),
            y: gsap.utils.clamp(-20, 20, 50 * componentPercent.y),
            duration: 0.5,
          },
          0
        )
        .to(
          '.highlight',
          {
            opacity: distFromCenter - 0.7,
            x: -10 + 20 * componentPercent.x,
            duration: 0.5,
          },
          0
        );
    };
  });
  return (
    <div ref={component} className={clsx('relative h-full w-full', className)}>
      <div className="avatar  relative aspect-square overflow-hidden rounded-3xl border-2 border-slate-700 opacity-0">
        <PrismicNextImage
          field={image}
          alt=""
          className="avatar-image h-full w-full object-fill"
          imgixParams={{ q: 90 }}
        />
        <div className="highlight absolute inset-0 hidden w-full scale-110 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 md:block"></div>
      </div>
    </div>
  );
};
