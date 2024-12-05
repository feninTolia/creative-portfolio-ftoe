'use client';
import { Button } from '@/components/Button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useGSAP } from '@gsap/react';
import { Content, KeyTextField, asLink } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function NavBar({
  settings,
}: {
  settings: Content.SettingsDocument;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)', false);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {},
    });

    // // tl.revert();
    // tl.clear();

    // // if (isDesktop) {
    tl.to('.test', {
      y: -200,
      stagger: 0.1,
      ease: 'power2.inOut',
      scrollTrigger: {
        // markers: true,
        start: '-20px top',
        end: '250px 100px',
        scrub: 1.5,
      },
    }).to('.navbar', {
      y: -100,
      z: 50,
      ease: 'power2.out',
      scrollTrigger: {
        // markers: true,
        start: '50px top',
        end: '250px 100px',
        scrub: 1,
      },
    });
    // }
  }, [isDesktop]);

  return (
    <nav aria-label="Main navigation">
      <ul className="navbar flex flex-col justify-between rounded-b-lg bg-slate-50 px-4 py-2 md:m-4 md:flex-row md:items-center md:rounded-xl">
        <div className="flex items-center justify-between">
          <NameLogo name={settings.data.name} />
          <button
            aria-expanded={open}
            aria-label="Open menu"
            className="block p-2 text-2xl text-slate-800 md:hidden"
            onClick={() => setOpen(true)}
          >
            <MdMenu />
          </button>
        </div>
        <DesktopMenu settings={settings} pathname={pathname} />
      </ul>
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end gap-4 bg-slate-50 pr-4 pt-14 transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0 ' : 'translate-x-[100%]'
        )}
      >
        <button
          aria-label="Close menu"
          aria-expanded={open}
          className="fixed right-4 top-3 block p-2 text-2xl text-slate-800 md:hidden "
          onClick={() => setOpen(false)}
        >
          <MdClose />
        </button>
        {settings.data.nav_item.map(({ link, label }, index) => (
          <React.Fragment key={label}>
            <li className="first:mt-8">
              <PrismicNextLink
                className={clsx(
                  'group relative block overflow-hidden rounded px-3 text-3xl font-bold text-slate-900 '
                )}
                field={link}
                onClick={() => setOpen(false)}
                aria-current={
                  pathname.includes(asLink(link) as string) ? 'page' : undefined
                }
              >
                <span
                  className={clsx(
                    'absolute inset-0 z-0 h-full translate-y-12 rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0',
                    pathname.includes(asLink(link) as string)
                      ? 'translate-y-6'
                      : 'translate-y-18'
                  )}
                />
                <span className="relative">{label}</span>
              </PrismicNextLink>
            </li>
            {index < settings.data.nav_item.length - 1 && (
              <span
                className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline"
                aria-hidden="true"
              >
                /
              </span>
            )}
          </React.Fragment>
        ))}
        <li>
          <Button
            linkField={settings.data.cta_link}
            label={settings.data.cta_label}
            className="ml-3"
          />
        </li>
      </div>
    </nav>
  );
}

function NameLogo({ name }: { name: KeyTextField }) {
  return (
    <Link
      href="/"
      aria-label="Home page"
      className="text-xl font-extrabold  text-slate-900"
    >
      {name}
    </Link>
  );
}

function DesktopMenu({
  settings,
  pathname,
}: {
  settings: Content.SettingsDocument;
  pathname: string;
}) {
  return (
    <div className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {settings.data.nav_item.map(({ link, label }, index) => (
        <React.Fragment key={label}>
          <li>
            <PrismicNextLink
              className={clsx(
                'test group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-900'
              )}
              field={link}
              aria-current={
                pathname.includes(asLink(link) as string) ? 'page' : undefined
              }
            >
              <span
                className={clsx(
                  'absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform  duration-300 ease-in-out group-hover:translate-y-0',
                  pathname.includes(asLink(link) as string)
                    ? 'translate-y-6'
                    : 'translate-y-8'
                )}
              />
              <span className="relative">{label}</span>
            </PrismicNextLink>
          </li>
          {index < settings.data.nav_item.length - 1 && (
            <span
              className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline"
              aria-hidden="true"
            >
              /
            </span>
          )}
        </React.Fragment>
      ))}
      <li>
        <Button
          linkField={settings.data.cta_link}
          label={settings.data.cta_label}
          className="ml-3"
        />
      </li>
    </div>
  );
}
