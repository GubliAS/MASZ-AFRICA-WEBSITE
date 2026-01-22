import React from 'react';
import AnimationCopy from '../animations/WritingTextAnimation';
import PerformanceMetrics from '../components/PerformanceMetrics';
import Image from 'next/image';

function CoreValueSession() {
  return (
    <section className="lg:my-[180]">
      <div className="core-value-section-container">
        {/* Header */}
        <div className="section-header uppercase text-xl-semibold lg:mx-[200] ml-[22px] my-[30px] lg:text-4xl-semibold">
          what makes us <span className="text-primary-default">stand out</span>
        </div>

        {/* Description */}
        <AnimationCopy>
          <div className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
            Our uniqueness comes from blending product authenticity with real
            technical intelligence and dependable service delivery. Every item
            we supply is verified, traceable, and backed by expert insight
            tailored to the realities of mining environments. This combination
            allows us to offer solutions that improve efficiency, reduce risk,
            and keep operations running without interruption. But we don’t just
            provide products—we provide peace of mind. From precision-engineered
            consumables to end-to-end procurement support, we anticipate your
            operational needs and deliver solutions that empower your team to
            perform at their best. Our clients trust us not only for the quality
            of our supplies but for our commitment to safety, sustainability,
            and innovation, ensuring that every decision we make enhances the
            value of your operations. With MASZ-Africa, you gain a partner who
            is as invested in your success as you are, driving measurable
            results, minimizing downtime, and unlocking new levels of
            operational excellence.
          </div>
        </AnimationCopy>

        {/* Metrics */}
        <div className="metrics-container lg: lg:mx-[200] lg:mb-[100] my-[50px] gap-6 mx-[21] lg:flex">
          <PerformanceMetrics text="years of combined experience" value="15+" />
          <PerformanceMetrics
            text="clients who rely on our consistent delivery and expertise."
            value="5+"
          />
          <PerformanceMetrics
            text="client satisfaction built on trust, transparency, and performance."
            value="99%"
          />
          <PerformanceMetrics
            text="on-time delivery, driven by efficiency and dependable logistics."
            value="98%"
          />
        </div>

        {/* Images */}
        <div className="core-value-section-images flex flex-col gap-[20px] lg:flex">
          {/* Image 1 */}
          <div className="relative h-[300px] mx-[21px] overflow-hidden lg:hidden">
            <Image
              src="/homeAssets/Image-3.jpg"
              alt="Core value visual"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Image 2 & 3 */}
          <div className="flex gap-[20px] lg:gap-[40] mx-[21px] lg:mx-0">
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800]">
              <Image
                src="/homeAssets/Image-4.jpg"
                alt="Core value visual"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800] lg:mx-0">
              <Image
                src="/homeAssets/Image-5.jpg"
                alt="Core value visual"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreValueSession;
