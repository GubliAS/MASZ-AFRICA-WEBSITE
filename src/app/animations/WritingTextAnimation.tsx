'use client'

import React, { useRef } from 'react'

import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';


gsap.registerPlugin(ScrollTrigger, SplitText);

interface AnimationCopyProps {
  children?: React.ReactNode;
  colorInitial?: string;
  colorAccent?: string;
  colorFinal?: string;
  /** When true, animates from the first letter on mount (time-based) instead of scroll-driven. Use after line-by-line reveal. */
  animateOnMount?: boolean;
}

interface SplitRefs {
  wordSplit: any
  charSplit: any
}



export default function AnimationCopy({ 
    children,
    colorInitial = '#dddddd',
    colorAccent = '#abff02',
    colorFinal = '#000000',
    animateOnMount = false,
 }: AnimationCopyProps ){

    const containerRef = useRef<HTMLDivElement | null>(null);
    const splitRefs = useRef<SplitRefs[]>([]);
    const lastScrollProgress = useRef(0);
    const colorTransitionTimers = useRef(new Map());
    const completedChars = useRef(new Set());
    const lastCharColor = useRef(new Map<number, string>());

    useGSAP(() => {

        if (!containerRef.current) return;

        const container = containerRef.current;
        // Check if parent is already visible — if so, hide during SplitText; if not, keep hidden
        const parent = container.parentElement;
        const isParentVisible = parent && window.getComputedStyle(parent).visibility !== 'hidden';
        if (isParentVisible) {
            // Hide during SplitText so reflow happens off-screen — prevents visible jump when copy appears
            gsap.set(container, { opacity: 0 });
        } else {
            // Already hidden by parent, keep it hidden
            gsap.set(container, { opacity: 0, visibility: 'hidden' });
        }

        splitRefs.current = [];
        lastScrollProgress.current = 0;
        colorTransitionTimers.current.clear();
        completedChars.current.clear();
        lastCharColor.current.clear();

        let elements = [];
        if (container?.hasAttribute("data-copy-wrapper")){
            elements = Array.from(container.children);
        } else {
            elements = [container]
        }

        elements.forEach((element) => {
            const wordSplit = SplitText.create(element, {
                type: 'words',
                wordsClass: 'word'
            });

            const charSplit = SplitText.create(wordSplit.words, {
                type: 'chars',
                charsClass: "char"
            });


            splitRefs.current.push({ wordSplit, charSplit });
        });

        const allChars = splitRefs.current.flatMap(
            ({ charSplit }) => charSplit.chars
        );

        gsap.set(allChars, { color: colorInitial });

        if (animateOnMount) {
            gsap.to(container, { opacity: 1, duration: 0.25, ease: 'power2.out', force3D: true });
            gsap.to(allChars, {
                color: colorFinal,
                duration: 0.12,
                stagger: 0.02,
                ease: 'none',
                overwrite: 'auto',
            });
            return;
        }

        const scheduleFinalTransition = (char: any, index: number) => {
            if (colorTransitionTimers.current.has(index)) {
                clearTimeout(colorTransitionTimers.current.get(index));
            }


            const timer = setTimeout(() => {
                if (!completedChars.current.has(index)) {
                    gsap.to(char, {
                        duration: 0.1,
                        ease: "none",
                        color: colorFinal,
                        onComplete: () => {
                            completedChars.current.add(index)
                        }
                    })
                }
                colorTransitionTimers.current.delete(index);
            }, 100);

            colorTransitionTimers.current.set(index, timer);
        };

        ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const totalChars = allChars.length;
                const isScrollDown = progress >= lastScrollProgress.current;
                const currentCharIndex = Math.floor(progress * totalChars);
                const lastColor = lastCharColor.current;
                allChars.forEach((char: any, index: number) => {
                    let targetColor: string;
                    if (!isScrollDown && index >= currentCharIndex) {
                        if (colorTransitionTimers.current.has(index)){
                            clearTimeout(colorTransitionTimers.current.get(index));
                            colorTransitionTimers.current.delete(index);
                        }
                        completedChars.current.delete(index);
                        targetColor = colorInitial;
                    } else if (completedChars.current.has(index)) {
                        return;
                    } else if (index <= currentCharIndex) {
                        targetColor = colorAccent;
                        if (!colorTransitionTimers.current.has(index)) scheduleFinalTransition(char, index);
                    } else {
                        targetColor = colorInitial;
                    }
                    if (lastColor.get(index) !== targetColor) {
                        lastColor.set(index, targetColor);
                        gsap.set(char, { color: targetColor });
                    }
                });
                lastScrollProgress.current = progress;
            },

        });

        // Fade in after SplitText + ScrollTrigger — GPU layer for smooth reveal
        // Only fade in if parent is visible (otherwise parent controls visibility)
        if (isParentVisible) {
            gsap.to(container, { opacity: 1, duration: 0.4, ease: 'power2.out', force3D: true });
        } else {
            // Parent will handle visibility, just ensure opacity is ready
            gsap.set(container, { opacity: 1, visibility: 'inherit' });
        }

    }, {
        scope: containerRef,
        dependencies: [colorInitial, colorAccent, colorFinal, animateOnMount],
    })

    if (React.Children.count(children) === 1) {
        const child = children as React.ReactElement;
        return React.cloneElement(child, {
            ref: containerRef,
            style: { 
                ...(child.props?.style as object), 
                contain: 'layout paint',
                willChange: 'color',
            },
        });
    }

    return (

        <div ref={containerRef} data-copy-wrapper="true" style={{ contain: 'layout paint', willChange: 'color' }}>
            {children}
        </div>
    )
}