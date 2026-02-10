'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export const navLinks = [
  { id: '1', label: 'home', path: '/' },
  { id: '2', label: 'about', path: '/aboutUs' },
  { id: '3', label: 'services', path: '/services' },
  { id: '4', label: 'careers', path: '/careers' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const isExpandedRef = useRef(false);

  const pathname = usePathname();

  // Navbar expands gradually as you scroll down, contracts gradually as you scroll up (1:1 with scroll)
  const SCROLL_RANGE_PX = 200;

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    if (!header || !inner) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Desktop / large screens: keep existing width + margin animation
      mm.add('(min-width: 1024px)', () => {
        gsap.set(header, {
          width: '80%',
          left: '10%',
          y: '0',
          backgroundColor: '#ffffff',
          backdropFilter: 'blur(0px)',
        });
        gsap.set(inner, { marginLeft: '2.5rem', marginRight: '2.5rem' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: `${SCROLL_RANGE_PX}px top`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const shouldBeExpanded = self.progress > 0.4;
              if (shouldBeExpanded !== isExpandedRef.current) {
                isExpandedRef.current = shouldBeExpanded;
                header.classList.toggle('navbar--expanded', shouldBeExpanded);
              }
            },
          },
        });

        tl.to(
          header,
          {
            width: '100%',
            left: '0%',
            y: 0,
            backgroundColor: 'rgba(13, 13, 13, 0.94)',
            backdropFilter: 'blur(14px)',
            ease: 'none',
            duration: 1,
            force3D: true,
          },
          0
        );
        tl.to(
          inner,
          {
            marginLeft: '5.5rem',
            marginRight: '5.5rem',
            ease: 'none',
            duration: 1,
            force3D: true,
          },
          0
        );
      });

      // Mobile / tablet: only change background color, keep layout full-width
      mm.add('(max-width: 1023px)', () => {
        gsap.set(header, {
          width: '100%',
          left: '0%',
          y: 0,
          backgroundColor: '#ffffff',
          backdropFilter: 'blur(0px)',
        });
        gsap.set(inner, { marginLeft: '1.5rem', marginRight: '1.5rem' });

        gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: `${SCROLL_RANGE_PX}px top`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }).to(
          header,
          {
            backgroundColor: 'rgba(13, 13, 13, 0.94)',
            backdropFilter: 'blur(14px)',
            ease: 'none',
            duration: 1,
            force3D: true,
          },
          0
        );
      });
    }, header);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  // Hide menu initially
  useEffect(() => {
    if (menuRef.current) {
      gsap.set(menuRef.current, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'top',
      });

      itemRefs.current.forEach((el) => {
        if (el) gsap.set(el, { y: 20, opacity: 0 });
        const arrow = el?.querySelector('svg');
        if (arrow) gsap.set(arrow, { x: -20, opacity: 0 });
      });
    }
  }, []);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });

    if (menuOpen) {
      tl.to(menuRef.current, { scaleY: 1, opacity: 1, duration: 0.65 });
      tl.to(
        itemRefs.current,
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.6 },
        '-=0.45'
      );
      tl.to(
        itemRefs.current.map((el) => el?.querySelector('svg')),
        { x: 0, opacity: 1, stagger: 0.12, duration: 0.5 },
        '-=0.55'
      );
    } else {
      tl.to(
        itemRefs.current.map((el) => el?.querySelector('svg')),
        { x: -20, opacity: 0, stagger: 0.08, duration: 0.35 }
      );
      tl.to(
        itemRefs.current,
        { y: 20, opacity: 0, stagger: 0.1, duration: 0.45, ease: 'power3.in' },
        '-=0.2'
      );
      tl.to(
        menuRef.current,
        {
          scaleY: 0,
          opacity: 0,
          duration: 0.6,
          transformOrigin: 'top',
          ease: 'power4.inOut',
        },
        '-=0.3'
      );
    }
  }, [menuOpen]);

  return (
    <>
      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-[90px]" />

      <header
        ref={headerRef}
        className="navbar navbar--compact fixed top-0 z-[100] h-[90px] will-change-transform "
        style={{
          width: '100%',
          left: '0',
          transform: 'translateY(20%)',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          ref={innerRef}
          className="main-nav-container flex justify-between items-center  h-full lg:mx-10 "
        >
          {/* Logo */}
          <div className="nav-logo">
            <Image
              src="/maszAssets/website-logo.svg"
              width={140}
              height={50}
              alt="masz africa logo"
              style={{ height: 25, width: 'auto' }}
            />
          </div>

          <div className="nav-list flex items-center">
            {/* Desktop Nav */}
            <div className="hidden lg:flex mr-[50px] p-[20px] text-default-body">
              <ul className="flex gap-8 uppercase items-center text-md-medium">
                {navLinks.map((list) => {
                  const isActive = pathname === list.path;

                  return (
                    <li key={list.id} className="relative">
                      <Link
                        href={list.path}
                        className={`
                          relative inline-block px-1 py-1 font-medium text-default-body
                          before:content-[''] before:absolute before:left-0 before:top-[-10px]
                          before:h-[4px] before:w-0 before:bg-blue-500
                          before:transition-[width,opacity] before:duration-300 before:opacity-0
                          after:content-[''] after:absolute after:left-0 after:bottom-[-10px]
                          after:h-[4px] after:w-0 after:bg-blue-500
                          after:transition-[width,opacity] after:duration-300 after:opacity-0
                          hover:before:w-full hover:after:w-full hover:before:opacity-100 hover:after:opacity-100
                          ${
                            isActive
                              ? 'before:w-full after:w-full before:opacity-100 after:opacity-100 text-b'
                              : ''
                          }
                        `}
                      >
                        {list.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTA */}
            <div className="contact-us-cta flex justify-between items-center mr-[10px]">
              <Link
                href="/contactUs"
                className="font-medium bg-surface-card-colored-primary text-light px-[8px] py-[7px] flex"
              >
                Contact Us
                <MoveRight size={20} className="mt-[2px] mx-1" />
              </Link>
            </div>

            {/* Mobile Menu Icon */}
            <div
              className="menu-icon ml-2 w-[30px] h-[30px] flex flex-col justify-center items-center gap-[4px] cursor-pointer lg:hidden"
              onClick={toggleMenu}
            >
              <span
                className={`block h-[3px] w-full bg-black rounded transition-all duration-500 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-[3px] w-full bg-black rounded transition-all duration-500 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[3px] w-full bg-black rounded transition-all duration-500 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            ref={menuRef}
            className="nav-bar-list-items bg-surface-card-primary fixed z-40 top-[90px] w-full left-0 right-0 h-[calc(100vh-90px)] transform origin-top lg:hidden"
          >
            <ul className="navList-item">
              {navLinks.map((link, index) => (
                <li
                  key={link.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="border-b border-gray-500 px-[18px] py-[20px] flex justify-between items-center"
                >
                  <Link
                    href={link.path}
                    className="capitalize text-3xl-regular"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  <MoveRight size={20} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
