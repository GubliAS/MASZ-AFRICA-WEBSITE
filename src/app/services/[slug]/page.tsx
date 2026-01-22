import React from 'react';
import Tag from '../../components/tag';
import Image from 'next/image';
import AnimationCopy from '../../animations/WritingTextAnimation';
import { Layers } from 'lucide-react';
import { Square3Stack3DIcon } from '@heroicons/react/16/solid';
import { serviceDetailsTemplate } from '@/app/Data/serviceDetails';

interface pageProps {
    params: Promise<{
      slug: string
    }>
}


async function CareersPage({ params }:pageProps) {

  const { slug } = await params;

  const service = serviceDetailsTemplate.find(
    (item) => item.slug === slug
   )

   if(!service) {
    return <div className="p-20">Service not found: {slug}</div>;
}


  return (
    <section className="">
      <div className="main-section-content-container">
        {/* <div className="upper-info mt-[80] lg:mt-[150] lg:mx-[200]">
          <Tag text="products and services" />
          <div className="section-header uppercase text-xl-semibold lg:text-4xl-semibold lg:tracking-tight mt-[50] lg:mt-[100] mb-[30] lg:mb-[50]">
            <div className="dark-text mb-[-8] lg:mb-[-20] ">
              {service.headerFirst}
            </div>
            <div className="blue-text text-primary-default">
              {service.headerSecond}
            </div>
          </div>
        </div> */}


{/* Hero section Image */}
        <div className="service-hero-section h-[600] lg:h-[850]">
          <div className="image-container relative h-full lg:h-full overflow-hidden ">
            <Image
              src={service.heroImage}
              alt="Grinding media"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            <div className="text-container text-light absolute bottom-20 left-0 right-0 flex items-center justify-center flex-col">
              <div className="hero-tag text-md-medium uppercase border-2 rounded-full lg:p-[10]">
                {service.heroTag}
              </div>
              <div className="title uppercase lg:text-4xl-semibold">
                {service.heroTitle}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="description lg:h-screen">
          <div className="description-content mx-[21] lg:mx-[200] my-[100] lg:my-[150]">
            <Tag text="details" className="mb-[40] lg:mb-[80]" />
            <AnimationCopy>
              <div dangerouslySetInnerHTML={{ __html: service.description || '' }} className="description text-md-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight"/>
               
              
            </AnimationCopy>
          </div>
        </div>

        {/* BENEFITS SECTION IMAGE */}
        <div className="benefit-section-hero bg-[#f3f3f3] w-full lg:h-[700]">
          <div className="image-container relative w-full lg:h-full overflow-hidden">
            <Image
              src={service.benefitsImage}
              alt={service.benefitsAltText}
              fill
              priority
              className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            <div className="text-container text-light absolute bottom-70 left-0 right-0 flex ">
              <div className="title uppercase  lg:text-4xl-semibold lg:w-[650] lg:mx-[200] leading-13">
                {service.benefitsTitle}
              </div>

              <div className="subtext lg:text-lg-medium lg:max-w-[500]">
                {service.benefitsSubtitle}
              </div>
            </div>
          </div>
        </div>

        <div className="benefits bg-[#f3f3f3] lg:py-[120]">
          <div className="benefits-main-content flex">
            <div className="left-side  lg:mx-[200]">
              <div className="benefits-list flex items-center justify-center lg:flex-start lg:gap-6 lg:flex-wrap">
                {/* Benefit card section */}
                {service.benefits.map((item) => (
                  <div
                    key={item.id}
                    className="item-list group relative overflow-hidden bg-white flex flex-col 
                    lg:max-w-[400px] lg:h-[350px] items-center justify-center 
                    lg:gap-10 lg:px-[30px] lg:py-[40px] cursor-pointer"
                  >
                    {/* Liquid Layer */}
                    <span className="liquid-bg absolute inset-0 -z-0" />

                    <div className="item-icon relative z-10 bg-surface-card-colored-secondary rounded-full lg:p-[10px] transition-colors duration-500 group-hover:bg-white">
                      <Square3Stack3DIcon className="lg:h-8 lg:w-auto text-primary-default transition-colors duration-500 group-hover:text-blue-600" />
                    </div>

                    <div className="item-text relative z-10 text-center flex flex-col items-center justify-center transition-colors duration-500 group-hover:text-white">
                      <div className="title capitalize lg:text-xl-medium">
                        {item.title}
                      </div>
                      <div className="subtext lg:mt-[20px] lg:text-md-regular">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
          
        </div>
      </div>
    </section>
  );
}

export default CareersPage;
