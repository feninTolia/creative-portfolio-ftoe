'use client';
import { useGSAP } from '@gsap/react';
import { Content, ImageField, isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Link from 'next/link';
import { Fragment, useRef, useState } from 'react';
import { MdArrowOutward } from 'react-icons/md';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice['primary']['content_type'];
  viewMoreText: Content.ContentIndexSlice['primary']['view_more_text'];
  fallbackItemImage: Content.ContentIndexSlice['primary']['fallback_item_image'];
};

export const ContentList = ({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = 'Read More',
}: Props) => {
  const component = useRef(null);
  const revealRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const [isHovering, setIsHovering] = useState(false);

  const urlPrefix = contentType === 'Blog' ? '/blog' : '/projects';

  useGSAP(() => {
    gsap.to(component.current, { opacity: 1 });

    itemsRef.current.forEach((item) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: 'elastic.out(1,0.3)',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=100px',
            end: 'bottom center',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  useGSAP(() => {
    if (currentItem === null) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      console.log(window.scrollY);

      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
      // const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      // const maxY = window.scrollY + window.innerHeight - 350;
      // const maxX = window.innerWidth - 250;

      // with image
      // gsap.to(revealRef.current, {
      //   x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
      //   y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
      //   rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
      //   ease: 'back.out(2)',
      //   duration: 1.3,
      // });

      //without cursor

      gsap.to(revealRef.current, {
        x: mousePos.x - 45,
        y: mousePos.y - 55,
        duration: 0,
      });

      lastMousePos.current = mousePos;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentItem]);

  useGSAP(() => {
    gsap.to(revealRef.current, {
      opacity: isHovering ? 1 : 0,
      visibility: 'visible',
      ease: 'power3.out',
      duration: 0.4,
      scale: isHovering ? 1 : 0.2,
    });
  }, [isHovering]);

  // const contentImages = items.map((item) => {
  //   const image = isFilled.image(item.data.cover_image)
  //     ? item.data.cover_image
  //     : fallbackItemImage;

  //   return asImageSrc(image, { fit: 'crop', w: 220, h: 320, exp: -10 });
  // });

  const contentImage = (coverImage: ImageField<never>) =>
    isFilled.image(coverImage) ? coverImage : fallbackItemImage;

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
    if (!isHovering) setIsHovering(true);
  };
  const onMouseLeave = () => {
    setCurrentItem(null);
    setIsHovering(false);
  };

  // Preload images
  // useEffect(() => {
  //   contentImages.forEach((url) => {
  //     if (!url) return;
  //     const img = new Image();
  //     img.src = url;
  //   });
  // }, [contentImages]);

  return (
    <div className="overflow-hidden">
      <ul
        className="grid border-b border-b-slate-100 opacity-0 overflow-hidden"
        onMouseLeave={onMouseLeave}
        ref={component}
      >
        {items.map((item, index) => (
          <Fragment key={item.uid}>
            {isFilled.keyText(item.data.title) && (
              <li
                key={item.uid}
                className=" list-item opacity-0"
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                onMouseEnter={() => onMouseEnter(index)}
              >
                <Link
                  href={`${urlPrefix}/${item.uid}`}
                  className="cursor-none flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                  aria-label={item.data.title}
                >
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      {item.data.title}
                    </span>
                    <div className="flex gap-3 text-yellow-400 text-lg font-bold">
                      {item.tags.map((tag, idx) => (
                        <span key={tag + idx}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <PrismicNextImage
                      field={contentImage(item.data.cover_image)}
                      imgixParams={{ fit: 'crop', w: 220, h: 120 }}
                      className="h-20 w-32 object-cover rounded-lg"
                    />
                    <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                      {viewMoreText}
                      <MdArrowOutward />
                    </span>
                  </div>
                </Link>
              </li>
            )}
          </Fragment>
        ))}
      </ul>

      {/* Hover element */}
      {/* with image */}
      {/* <div
        className="hover-reveal pointer-events-none absolute 
        left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300
        bg-white"
        style={{
          backgroundImage:
            currentItem !== null ? `url(${contentImages[currentItem]})` : '',
        }}
        ref={revealRef}
      ></div> */}

      {/* without cursor */}
      <div
        className="hover-reveal pointer-events-none absolute left-0 top-0 z-10 h-24 w-24 rounded-full bg-cover bg-center opacity-0 transition-[background] duration-300 bg-white text-sky-950 font-medium flex items-center justify-center "
        ref={revealRef}
      >
        Explore
      </div>
    </div>
  );
};
