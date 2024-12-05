'use client';
import { Bounded } from '@/components/Bounded';
import { TextSplitter } from '@/components/TextSpitter';
import { useGSAP } from '@gsap/react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import gsap from 'gsap';
import Shapes from './Shapes';
import { memo } from 'react';

gsap.registerPlugin(useGSAP);

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero = memo(({ slice }: HeroProps): JSX.Element => {
  useGSAP(() => {
    const tl = gsap.timeline();

    gsap.set('.hero', { opacity: 1 });

    tl.fromTo(
      '.split-char',
      { x: -100, opacity: 0, rotate: -10 },
      {
        x: 0,
        opacity: 1,
        rotate: 0,
        ease: 'elastic.out(1,0.3)',
        duration: 1,
        delay: 0.2,
        transformOrigin: 'left top',
        stagger: { each: 0.1, from: 'random' },
      }
    ).fromTo(
      '.job-title',
      { y: -20, opacity: 0, scale: 1 },
      { opacity: 1, y: 0, duration: 0.5, scale: 1 },
      '<50%'
    );
  });

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero opacity-0"
    >
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <Shapes />
        <div className="col-start-1 md:row-start-1">
          <h1 className="mb-8 text-[clamp(3rem,20vmin,20rem)] font-extrabold leading-none tracking-tighter ">
            <TextSplitter
              text={slice.primary.first_name}
              wordDisplayStyle="block"
              className="text-slate-300"
            />
            <TextSplitter
              text={slice.primary.last_name}
              wordDisplayStyle="block"
              className="-mt-[0.2em] text-slate-500 "
            />
          </h1>
          <span className="job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-2xl font-bold uppercase tracking-[0.2em] text-transparent opacity-1 md:text-4xl">
            {slice.primary.tag_line}
          </span>
        </div>
      </div>
    </Bounded>
  );
});

export default Hero;

Hero.displayName = 'Hero';
