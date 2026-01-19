import React from 'react';
import Tag from '../app/components/tag';
import Image from 'next/image';
import AnimationCopy from '../app/animations/WritingTextAnimation';
import { Square3Stack3DIcon } from '@heroicons/react/16/solid';

/* -------------------- BENEFITS DATA -------------------- */
const benefits = [
  {
    id: 1,
    title: 'Optimized grinding efficiency',
    description:
      'Premium forged and cast steel balls ensure uniform size and hardness for consistent milling performance.',
  },
  {
    id: 2,
    title: 'Extended service life',
    description:
      'Superior wear resistance minimizes frequent replacements and reduces downtime.',
  },
  {
    id: 3,
    title: 'Reduced energy consumption',
    description:
      'Optimized media hardness improves milling efficiency and lowers power usage.',
  },
  {
    id: 4,
    title: 'Consistent product quality',
    description:
      'Uniform size distribution guarantees predictable output and stable processing.',
  },
  {
    id: 5,
    title: 'Lower operational costs',
    description:
      'Longer durability and reduced maintenance deliver measurable cost savings.',
  },
];

/* -------------------- PAGE -------------------- */
function CareersPage() {
  return (
    <section>
      <div className="main-section-content-container">
        {/* -------------------- HEADER -------------------- */}
        <div className="upper-info mt-[80] lg:mt-[150] lg:mx-[200]">
          <Tag text="products and services" />

          <div className="section-header uppercase text-xl-semibold lg:text-4xl-semibold lg:tracking-tight mt-[50] lg:mt-[100] mb-[30] lg:mb-[50]">
            <div className="dark-text mb-[-8] lg:mb-[-20]">
              consumables that keep your mine
            </div>
            <div className="blue-text text-primary-default">
              moving without compromise
            </div>
          </div>
        </div>

        {/* -------------------- HERO IMAGE -------------------- */}
        <div className="service-hero-section h-[600] lg:h-screen">
          <div className="image-container relative h-full overflow-hidden">
            <Image
              src="/serviceAssets/Image-1-3.webp"
              alt="Grinding media"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            <div className="text-container text-light absolute bottom-20 left-0 right-0 flex items-center justify-center flex-col">
              <div className="hero-tag text-md-medium uppercase border-2 rounded-full lg:p-[10]">
                Consumables
              </div>
              <div className="title uppercase lg:text-4xl-semibold">
                grinding media
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- DESCRIPTION -------------------- */}
        <div className="description lg:h-screen">
          <div className="description-content mx-[21] lg:mx-[200] my-[100] lg:my-[150]">
            <Tag text="details" className="mb-[40] lg:mb-[80]" />

            <AnimationCopy>
              <div className="description text-md-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
                MASZ-AFRICA supplies high-performance forged and cast steel
                grinding balls, meticulously engineered to deliver consistent,
                efficient, and reliable results in even the most demanding
                milling environments...
              </div>
            </AnimationCopy>
          </div>
        </div>

        {/* -------------------- BENEFITS -------------------- */}
        <div className="benefit-highlights bg-[#f3f3f3] lg:py-[100]">
          <div className="main-content">
            <div className="upper-info mx-[21] lg:mx-[200] my-[100] lg:py-[150]">
              <Tag text="benefits" className="mb-[40] lg:mb-[80]" />

              <div className="header uppercase lg:text-4xl-semibold">
                <div className="first mb-[-8] lg:mb-[-20]">
                  engineered for{' '}
                  <span className="text-primary-default">Efficiency</span> and
                </div>
                <div className="second text-primary-default">
                  profitability
                </div>
              </div>
            </div>

            <div className="lower-info flex flex-col lg:flex-row lg:justify-between lg:ml-[200]">
              {/* -------- LEFT BENEFITS LIST -------- */}
              <div className="left lg:max-w-[50%] flex flex-col">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="
                      group
                      main-content
                      items-center
                      justify-center
                      flex
                      gap-14
                      py-[40px]
                      border-t
                      border-b
                      border-transparent
                      transition-all
                      duration-300
                      hover:border-primary-default
                    "
                  >
                    <div className="icon-container p-[10px] lg:p-[15px] bg-surface-card-colored-secondary rounded-full">
                      <Square3Stack3DIcon className="w-8 h-8 text-primary-default transition group-hover:scale-110" />
                    </div>

                    <div className="text-data">
                      <div className="title uppercase lg:text-2xl-semibold">
                        {benefit.title}
                      </div>

                      <div className="subtext lg:text-lg-medium lg:max-w-[500] lg:mt-[20]">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* -------- RIGHT IMAGE -------- */}
              <div className="right lg:w-[50%] lg:h-[500px]">
                <div className="relative overflow-hidden h-full">
                  <Image
                    src="/serviceAssets/Image-8-1.webp"
                    alt="grinding media"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareersPage;
