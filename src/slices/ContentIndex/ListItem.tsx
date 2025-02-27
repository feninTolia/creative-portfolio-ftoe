import React, { memo, useCallback } from 'react';
import { Content, ImageField, isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';

type Props = {
  item: Content.BlogPostDocument | Content.ProjectDocument;
  urlPrefix: '/blog' | '/projects';
  viewMoreText: Content.ContentIndexSlice['primary']['view_more_text'];
  fallbackItemImage: Content.ContentIndexSlice['primary']['fallback_item_image'];
};

export const ListItem = memo(
  ({ item, urlPrefix, viewMoreText, fallbackItemImage }: Props) => {
    // Memoized function for determining the content image
    const contentImage = useCallback(
      (coverImage: ImageField<never>) =>
        isFilled.image(coverImage) ? coverImage : fallbackItemImage,
      [fallbackItemImage]
    );

    return (
      <Link
        href={`${urlPrefix}/${item.uid}`}
        className="cursor-none flex flex-col gap-8 justify-between border border-slate-600 px-4 py-8
         text-slate-200 h-full rounded-md hover:backdrop-blur-lg backdrop-brightness-[135%] backdrop-blur-2xl hover:backdrop-brightness-[150%]
         transition-all hover:shadow-2xl group"
      >
        <div className="flex flex-col gap-4">
          <span className="text-3xl font-bold">{item.data.title}</span>
          <div className="flex flex-wrap gap-2 text-yellow-400 text-md font-bold">
            {item.tags.map((tag, idx) => (
              <span key={tag + idx}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <PrismicNextImage
            field={contentImage(item.data.cover_image)}
            imgixParams={{ fit: 'crop', w: 220, h: 120 }}
            className=" object-cover rounded-lg"
          />
          <span className="ml-auto flex items-center gap-2 text-xl group-hover:text-white group-hover:scale-[102%] origin-left transition-all font-medium md:ml-0">
            {viewMoreText}
            <MdArrowOutward />
          </span>
        </div>
      </Link>
    );
  }
);

ListItem.displayName = 'ListItem';
