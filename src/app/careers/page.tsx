import React from 'react';
import Tag from '../components/tag';
import ServicesHeroParallax from '../animations/ImageParallax';
import Image from 'next/image';
import AnimationCopy from '../animations/WritingTextAnimation';
import { Layers } from 'lucide-react';
import { Square3Stack3DIcon } from '@heroicons/react/16/solid';

interface serviceBenefitsProps {
  id: number;
  title: string;
  description: string;
}

export const serviceBenefits: serviceBenefitsProps[] = [
  {
    id: 1,
    title: 'Optimized grinding efficiency',
    description:
      'Premium forged and cast steel balls ensure uniform size and hardness for consistent milling performance. This improves energy utilization, reduces unnecessary material loss, and enhances overall mill productivity.',
  },
  {
    id: 2,
    title: 'Increased throughput',
    description:
      'Durable media reduce breakage, allowing higher processing volumes without loss of efficiency. Plants can achieve faster processing cycles while maintaining stable operational output.',
  },
  {
    id: 3,
    title: 'Enhanced process consistency',
    description:
      'Uniform hardness and composition support predictable grinding outcomes and product quality. This stability simplifies process control and minimizes unexpected variations during production.',
  },
  {
    id: 4,
    title: 'Reliable performance under intensive conditions',
    description:
      'Designed to maintain structural integrity in high-load and high-impact milling operations. This ensures dependable performance even in demanding industrial environments.',
  },
  {
    id: 5,
    title: 'Reduced mill wear and downtime',
    description:
      'High-quality media minimize abrasion on liners and components, extending mill life. Reduced maintenance frequency helps lower operating costs and improve plant availability.',
  },
  {
    id: 6,
    title: 'Reliable performance under intensive conditions',
    description:
      'Designed to maintain structural integrity in high-load and high-impact milling operations. This ensures dependable performance even in demanding industrial environments.',
  },
];

function CareersPage() {
  return (
    <section className="">
      <div className="main-section-content-container">
        <div className="upper-info mt-[80] lg:mt-[150] lg:mx-[200]">
          <Tag text="products and services" />
          <div className="section-header uppercase text-xl-semibold lg:text-4xl-semibold lg:tracking-tight mt-[50] lg:mt-[100] mb-[30] lg:mb-[50]">
            <div className="dark-text mb-[-8] lg:mb-[-20] ">
              consumables that keep your mine
            </div>
            <div className="blue-text text-primary-default">
              moving without compromise
            </div>
          </div>
        </div>

        <div className="service-hero-section h-[600] lg:h-screen">
          <div className="image-container relative h-full lg:h-full overflow-hidden ">
            <Image
              src="/serviceAssets/Image-1-3.webp"
              alt="Grinding media"
              fill
              priority
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

        {/* Description */}
        <div className="description lg:h-screen">
          <div className="description-content mx-[21] lg:mx-[200] my-[100] lg:my-[150]">
            <Tag text="details" className="mb-[40] lg:mb-[80]" />
            <AnimationCopy>
              <div className="description text-md-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
                MASZ-AFRICA supplies high-performance forged and cast steel
                grinding balls, meticulously engineered to deliver consistent,
                efficient, and reliable results in even the most demanding
                milling environments. Our grinding media are
                precision-manufactured to meet stringent international quality
                standards, ensuring superior strength, exceptional wear
                resistance, and an extended service life that minimizes downtime
                and reduces operational costs. <br />
                <br />
                Sourced exclusively from globally accredited production
                facilities that fully comply with ISO 9001 and ASTM
                specifications, each batch of grinding media undergoes rigorous,
                multi-stage quality control. This includes strict hardness
                testing, dimensional verification, and impact resistance checks,
                guaranteeing uniform performance, minimal breakage, and
                consistent results across all milling operations. The result is
                dependable grinding media that withstand extreme pressures,
                high-impact loads, and abrasive ore conditions without
                compromising efficiency. <br />
                <br />
                At MASZ-AFRICA, we go beyond simply supplying high-quality
                products. Our specialized technical support and on-site
                consultation services are designed to optimize your milling
                process and production outcomes. Our experienced engineers and
                metallurgists evaluate critical factors, including mill type,
                ore composition, feed size, grinding conditions, and operational
                parameters, to recommend the ideal grinding media in terms of
                composition, size distribution, and hardness profile. <br />
                <br />
                By tailoring solutions to your unique process requirements,
                MASZ-AFRICA ensures maximum throughput, reduced energy
                consumption, minimized wear on mill liners, and improved overall
                operational efficiency. Whether you are aiming for higher
                productivity, lower maintenance costs, or longer media life, our
                grinding media and expert support deliver measurable results
                that enhance both performance and profitability.
              </div>
            </AnimationCopy>
          </div>
        </div>

        {/* BENEFITS SECTION IMAGE */}
        <div className="benefit-section-hero bg-[#f3f3f3] w-full lg:h-[700]">
          <div className="image-container relative w-full lg:h-full overflow-hidden">
            <Image
              src="/serviceAssets/Image-16.jpg"
              alt="Grinding media"
              fill
              priority
              className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            <div className="text-container text-light absolute bottom-70 left-0 right-0 flex ">
              <div className="title uppercase  lg:text-4xl-semibold lg:w-[650] lg:mx-[200] leading-13">
                Engineered for Efficiency and Profitability.
              </div>

              <div className="subtext lg:text-lg-medium lg:max-w-[500]">
                Delivering reliable mining consumables and expert technical
                support to keep your operations running smoothly, reduce
                downtime, and maximize efficiency—helping your business save
                costs and boost profitability. Partner with us for innovative
                solutions and unwavering support that drive growth and success
                in every project.
              </div>
            </div>
          </div>
        </div>

        <div className="benefits bg-[#f3f3f3] lg:py-[120]">
          <div className="benefits-main-content flex">
            <div className="left-side  lg:mx-[200]">
              <div className="benefits-list flex items-center justify-center lg:flex-start lg:gap-6 lg:flex-wrap">
                {/* Benefit card section */}
                {serviceBenefits.map((item) => (
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

            {/* benefits image section on the right */}
            {/* <div className="right-side bg-green-400 lg:w-[50%] lg:h-[70vh]">
              <div className="image-container relative lg:h-full overflow-hidden">
                <Image
                 src='/serviceAssets/Image-4-1.webp'
                 alt='Grinding media'
                 fill 
                 priority
                 className='object-cover'
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareersPage;
