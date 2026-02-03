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

    useGSAP(() => {

        if (!containerRef.current) return;

        splitRefs.current = [];
        lastScrollProgress.current = 0;
        colorTransitionTimers.current.clear();
        completedChars.current.clear();

        let elements = [];
        if (containerRef.current?.hasAttribute("data-copy-wrapper")){
            elements = Array.from(containerRef.current.children);
        } else {
            elements = [containerRef.current]
        }

        // ✅ FIXED: Added 'element' parameter
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
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const totalChars = allChars.length;
                const isScrollDown = progress >= lastScrollProgress.current;
                const currentCharIndex = Math.floor(progress * totalChars);
                allChars.forEach((char: any, index: number) => {
                    if (!isScrollDown && index >= currentCharIndex) {
                        if (colorTransitionTimers.current.has(index)){
                            clearTimeout(colorTransitionTimers.current.get(index));
                            colorTransitionTimers.current.delete(index);
                        }
                        completedChars.current.delete(index);
                        gsap.set(char, { color: colorInitial});
                        return
                    }

                        if (completedChars.current.has(index)){
                            return;
                        }

                        if (index <= currentCharIndex) {
                            gsap.set(char, {color: colorAccent});
                            if (!colorTransitionTimers.current.has(index)) {
                                scheduleFinalTransition(char, index)
                            }
                        } else {
                            gsap.set(char, { color: colorInitial})
                        }


                });

                lastScrollProgress.current = progress;
            },

        })

    }, {
        scope: containerRef,
        dependencies: [colorInitial, colorAccent, colorFinal, animateOnMount],
    })

    if (React.Children.count(children) === 1) {
        return React.cloneElement(children as React.ReactElement, { ref: containerRef });
    }

    return (

        <div ref={containerRef}  data-copy-wrapper="true">
            {children}
        </div>
    )
}