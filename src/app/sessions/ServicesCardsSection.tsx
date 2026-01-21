'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MoveRight } from 'lucide-react';
import Button from '../components/button';
import Tag from '../components/tag';
import Link from 'next/link';

interface CardData {
  id: number;
  slug: string;
  tag: string;
  number: string;
  title: string;
  description: string;
  image: string;
  category: string;
  href: string;
}

const cardsData: CardData[] = [
  {
    id: 1,
    slug: 'grinding-media',
    tag: 'product',
    number: '01',
    title: 'Grinding media',
    description:
      'We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.',
    image: '/serviceAssets/Image-1-3.webp',
    category: 'product',
    href: '/'
  },
  {
    id: 2,
    slug: 'activated-carbon',
    tag: 'service',
    number: '02',
    title: 'ACTIVATED CARBON',
    description:
      'Advanced industrial solutions designed to optimize your operations. We provide cutting-edge technology and expert support to ensure maximum efficiency and minimal downtime in your production processes.',
    image:
      '/serviceAssets/Image-2-1.webp',
    category: 'product',
    href: '/'
  },
  {
    id: 3,
    slug: 'metal-and-steel-pipes'
,    tag: 'innovation',
    number: '03',
    title: 'METAL AND STEEL PIPES',
    description:
      'Leverage the power of IoT and AI-driven insights to transform your manufacturing processes. Our smart solutions help you predict maintenance needs, optimize workflows, and reduce operational costs significantly.',
    image:
      '/serviceAssets/Image-4-1.webp',
    category: 'product',
    href: '/'
  },
  {
    id: 4,
    slug: 'gear-box-servicing-and-heavy-equipment-maintenance',
    tag: 'technology',
    number: '04',
    title: 'GEAR BOX SERVICING AND HEAVY EQUIPMENT MAINTENANCE',
    description:
      'State-of-the-art automation systems that streamline your production line. From robotics to control systems, we deliver comprehensive automation solutions tailored to your specific industry requirements.',
    image:
      '/serviceAssets/Image-6-1.webp',
    category: 'services',
    href: '/'
  },
  {
    id: 5,
    slug: 'crusher-seals-installation-and-equipment-protection',
    tag: 'consulting',
    number: '05',
    title: 'CRUSHER SEALS INSTALLATION AND EQUIPMENT PROTECTION',
    description:
      'Expert consulting services to help you navigate complex industrial challenges. Our team provides strategic insights and actionable plans to drive growth, improve efficiency, and maintain competitive advantage.',
    image:
      '/serviceAssets/Image-7-1.webp',
    category: 'services',
    href: '/'
  },
  {
    id: 6,
    slug: 'procurement-and-supply-chain-management',
    tag: 'support',
    number: '06',
    title: 'PROCUREMENT AND SUPPLY CHAIN MANAGEMENT',
    description:
      '24/7 technical support and maintenance services to keep your operations running smoothly. Our dedicated team ensures rapid response times and effective solutions to minimize disruptions.',
    image:
      '/serviceAssets/Image-8-1.webp',
    category: 'services',
    href: '/'
  },
  {
    id: 7,
    slug: 'technical-consultancy-and-field-support',
    tag: 'training',
    number: '07',
    title: 'TECHNICAL CONSULTANCY AND FIELD SUPPORT',
    description:
      'Comprehensive training programs designed to upskill your workforce. From basic operations to advanced techniques, we ensure your team stays ahead of industry standards.',
    image:
      '/serviceAssets/Image-9-1.webp',
    category: 'services',
    href: '/'
  },
];

function ServicesCardsSection(): React.JSX.Element {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress through the section
        const scrolled = -rect.top;
        const totalScroll = sectionHeight - windowHeight;
        const progress = Math.max(0, Math.min(scrolled / totalScroll, 1));

        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCardScale = (index: number): number => {
    const cardsCount = cardsData.length;
    const cardProgress = scrollProgress * cardsCount;

    // Calculate how far this card is in the scroll sequence
    const cardPosition = cardProgress - index;

    // Reverse the scale logic: earlier cards have SMALLER min scales, later cards have LARGER min scales
    // This way, when card enters, it's already wider than the previous stacked card
    // Card 0: min = 0.70
    // Card 1: min = 0.74
    // Card 2: min = 0.78
    // Card 3: min = 0.82
    // Card 4: min = 0.86
    // Card 5: min = 0.90
    // Card 6: min = 0.94
    const calculatedMinScale = 0.7 + index * 0.05;

    // Cap the minimum scale at 1.0 to prevent cards from exceeding 100%
    const minScale = Math.min(calculatedMinScale, 1.0);
    const maxScale = 1.0;

    // For cards where minScale = maxScale (last ones), they don't scale at all
    // They stay at 100% throughout

    if (cardPosition < 0) {
      // Card hasn't entered yet - stays at max scale, ready to enter
      return maxScale;
    } else if (cardPosition >= 0 && cardPosition < 1) {
      // Card is active - scales down as next card approaches
      // If minScale = maxScale, this results in no scaling
      return maxScale - (maxScale - minScale) * cardPosition;
    } else {
      // Card has been passed and is stacked - stays at minimum scale
      return minScale;
    }
  };

  return (
    <section ref={sectionRef} className="bg-[#f3f3f3] py-20">
      {cardsData.map((card: CardData, index: number) => (
        <div
          key={card.id}
          className="sticky h-screen  flex justify-center items-center px-[21px] lg:px-[200px]"
          style={{
            top: `${index * 30}px`,
            zIndex: index + 1,
          }}
        >
          <div
            className="card-content w-full lg:w-[78%] lg:h-[580px] cursor-pointer overflow-hidden shadow-2xl transition-transform duration-300 ease-out hover:scale-[1.02]"
            style={{
              transform: `scale(${getCardScale(index)})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Upper Section */}
            <div className="upper-section flex justify-between items-center p-6 lg:p-8 bg-white">
              <div className="left-section">
                <Tag text={card.category}/>
              </div>
              <div className="right-section">
                <a
                  href="#"
                  className="text-sm lg:text-base font-medium hover:underline transition-all"
                >
                  Details
                </a>
              </div>
            </div>

            {/* Lower Section with Image */}
            <div className="lower-section w-full h-[calc(100%-80px)] lg:h-[488px] relative">
              <div className="image-container relative w-full h-full overflow-hidden">
                {/* Background Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex justify-between items-center p-6 lg:p-12">
                  <div className="text-white text-6xl lg:text-8xl font-bold opacity-100">
                    {card.number}
                  </div>

                  <div className="text-container max-w-[600px] bg-white/10 backdrop-blur-lg border-2 border-white/40  p-6 lg:p-8 shadow-xl">
                    <h3 className="text-2xl lg:text-4xl font-semibold text-white uppercase mb-4">
                      {card.title}
                    </h3>
                    <p className="text-sm lg:text-md-regular text-white/90 mb-6 leading-relaxed">
                      {card.description}
                    </p>
                    <Link href={`/services/${card.slug}`}>
                      <Button
                        label="Explore our services"
                        variant="primary"
                        size="large"
                        icon={
                          <>
                            {/* Mobile / default arrow */}
                            <span className="lg:hidden">
                              <MoveRight size={16} strokeWidth={2} />
                            </span>

                            {/* Desktop / large screen thicker arrow */}
                            <span className="hidden lg:inline-block">
                              <MoveRight size={16} strokeWidth={3} width={50} />
                            </span>
                          </>
                        }
                        className="mt-[25]"
                      />
                    
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Extra spacer to allow last card to complete stacking */}
      <div className="h-screen"></div>
    </section>
  );
}

export default ServicesCardsSection;
