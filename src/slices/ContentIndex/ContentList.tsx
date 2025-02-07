'use client';
import { useGSAP } from '@gsap/react';
import { Content, isFilled } from '@prismicio/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ListItem } from './ListItem';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice['primary']['content_type'];
  viewMoreText: Content.ContentIndexSlice['primary']['view_more_text'];
  fallbackItemImage: Content.ContentIndexSlice['primary']['fallback_item_image'];
};

export const ContentList = memo(
  ({
    items,
    contentType,
    fallbackItemImage,
    viewMoreText = 'Read More',
  }: Props) => {
    console.log('rerender');

    const component = useRef(null);
    const revealRef = useRef(null);
    const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollDelta, setScrollDelta] = useState(0);

    const [isHovering, setIsHovering] = useState(false);

    const urlPrefix = contentType === 'Blog' ? '/blog' : '/projects';

    // useGSAP(() => {
    //   gsap.to(component.current, { opacity: 1 });

    //   // itemsRef.current.forEach((item) => {
    //   //   gsap.fromTo(
    //   //     item,
    //   //     {
    //   //       opacity: 0,
    //   //       y: 20,
    //   //     },
    //   //     {
    //   //       opacity: 1,
    //   //       y: 0,
    //   //       duration: 0.4,
    //   //       ease: 'power1.inOut',
    //   //       scrollTrigger: {
    //   //         trigger: item,
    //   //         start: 'top bottom-=100px',
    //   //         end: 'bottom center',
    //   //         toggleActions: 'play none none none',
    //   //       },
    //   //     }
    //   //   );
    //   // });
    // }, []);

    useGSAP(() => {
      if (!revealRef.current) {
        return;
      }

      gsap.to(revealRef.current, {
        x: mousePos.x - 45,
        y: mousePos.y - 55,
        duration: 0.1,
      });
    }, [mousePos]);

    // Mouse Move Event Listener
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({
          x: e.clientX,
          y: e.clientY + window.scrollY,
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

    // Scroll Event Listener
    useEffect(() => {
      const handleScroll = () => {
        setScrollDelta(window.scrollY);
        setMousePos((prev) => ({
          ...prev,
          y: prev.y + (window.scrollY - scrollDelta),
        }));
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [scrollDelta]);

    // if page refresh with scrolled Y
    useEffect(() => {
      setScrollDelta(window.scrollY);
    }, []);

    useGSAP(() => {
      gsap.to(revealRef.current, {
        opacity: isHovering ? 1 : 0,
        visibility: 'visible',
        ease: 'power3.out',
        duration: 0.4,
        scale: isHovering ? 1 : 0.2,
      });
    }, [isHovering]);

    const onMouseEnter = useCallback(() => {
      if (!isHovering) {
        setIsHovering(true);
      }
    }, [isHovering]);

    const onMouseLeave = useCallback(() => {
      setIsHovering(false);
    }, []);

    return (
      <div className="overflow-hidden cursor-none">
        <ul
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6  opacity-100 overflow-hidden"
          onMouseLeave={onMouseLeave}
          onMouseEnter={() => onMouseEnter()}
          ref={component}
        >
          {items.map((item, index) => (
            <li key={index}>
              {isFilled.keyText(item.data.title) ? (
                <div
                  key={item.uid}
                  className="list-item opacity-100 h-full"
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                >
                  <ListItem
                    item={item}
                    urlPrefix={urlPrefix}
                    viewMoreText={viewMoreText}
                    fallbackItemImage={fallbackItemImage}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </li>
          ))}
        </ul>

        <div
          className="hover-reveal pointer-events-none absolute left-0 top-0 z-10 h-24 w-24 rounded-full bg-cover bg-center opacity-0 transition-[background] duration-300 bg-white text-sky-950 font-medium flex items-center justify-center "
          ref={revealRef}
        >
          Explore
        </div>
      </div>
    );
  }
);

ContentList.displayName = 'ContentList';
