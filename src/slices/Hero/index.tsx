import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero = ({ slice }: HeroProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <div className="col-start-1 md:row-start-1">
          <h2>{slice.primary.first_name}</h2>
          <h2>{slice.primary.last_name}</h2>
          <h2>{slice.primary.tag_line}</h2>
        </div>
      </div>
    </section>
  );
};

export default Hero;
