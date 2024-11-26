'use client';
import { Bounded } from '@/components/Bounded';
import Heading from '@/components/Heading';
import { useGSAP } from '@gsap/react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useRef } from 'react';
import { MdCircle } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type TextListProps = SliceComponentProps<Content.TextListSlice>;

const TextList = ({ slice }: TextListProps): JSX.Element => {
  const compRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: compRef.current,
        scrub: 4,
        start: 'top bottom',
        end: 'bottom top',
      },
    });

    tl.fromTo(
      '.tech-row',
      {
        x: (idx) => {
          return idx % 2 === 0
            ? gsap.utils.random(600, 400)
            : gsap.utils.random(-600, -400);
        },
      },
      {
        x: (idx) => {
          return idx % 2 === 0
            ? gsap.utils.random(-600, -400)
            : gsap.utils.random(600, 400);
        },
        ease: 'power1.inOut',
      }
    );
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden"
      ref={compRef}
    >
      <Bounded as={'div'}>
        <Heading as="h2" className="mb-8">
          {slice.primary.heading}
        </Heading>
      </Bounded>

      {slice.primary.tech.map(({ tech_color, tech_name }) => (
        <div
          key={tech_name}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={tech_name || undefined}
        >
          {Array.from({ length: 15 }, (_, idx) => (
            <React.Fragment key={`${tech_name}` + idx}>
              <span
                className="tech-item text-8xl font-extrabold uppercase tracking-tighter"
                style={{
                  color: idx === 7 && tech_color ? tech_color : 'inherit',
                }}
              >
                {tech_name}
              </span>
              <span className="text-3xl">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
      <div className="h-72"></div>
    </section>
  );
};

export default TextList;
