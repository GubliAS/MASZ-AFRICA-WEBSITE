import React from 'react';
import Tag from '../components/tag';
import Image from 'next/image';
import Button from '../components/button';
import { MoveRight } from 'lucide-react';
import AnimationCopy from '../animations/WritingTextAnimation';

function AboutSession() {
  return (
    <section className="lg:ml-[200] relative lg:my-[180]">
      <div className="about-session-container my-[100] lg:flex lg:justify-between lg:items-start lg:gap-[50px]">
        {/* Left: Text + Button */}
        <div className="session-container lg:w-1/2" data-scroll-reveal-item>
          <Tag text="About us" className="ml-[22]" />
          <div className="about-us-header text-xl-semibold uppercase ml-[22] my-[30] lg:my-[70] lg:text-4xl-semibold">
            Who <span className="text-primary-default">We are</span>
          </div>

          <AnimationCopy>
            <div className="about-us-text mx-[25] text-lg-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
              MASZ-Africa is a Ghana-based mining supply and engineering support
              company committed to helping mining operations run efficiently,
              reliably, and without interruption. We provide high-quality
              consumables, certified equipment, and practical technical services
              backed by real hands-on industry experience. Through trusted
              global sourcing and strong technical understanding, we ensure
              every product we deliver performs exactly as required in demanding
              mining environments.
              <br />
              <br />
              Our team works closely with clients to understand their
              operational needs, recommend the right solutions, and provide
              support that genuinely improves performance. With a consistent
              focus on on-time delivery, transparent communication, and
              dependable field assistance, we help mines reduce downtime and
              keep production moving. At MASZ-Africa, our goal is simple —
              supply what works, support what matters, and deliver the level of
              service every mining operation expects and deserves.
            </div>
          </AnimationCopy>

          {/* Mobile-only image */}
          <div className="lg:hidden about-us-image relative w-[88%] h-[400px] mx-[25] mt-[50] bg-red-500 flex items-center justify-center">
            <Image
              src="/homeAssets/Image-2.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>

          <Button
            label="Explore our services"
            variant="primary"
            size="large"
            icon={<MoveRight size={16} />}
            className="ml-[22] my-[35] lg:my-[65]"
          />
        </div>

        {/* Right: Large screen image */}
        <div className="hidden lg:flex lg:w-1/2 lg:justify-end lg:items-start" data-scroll-reveal-item>
          <div className="about-us-image relative w-full h-[900px] flex items-center justify-center  transition-all ease-in-out">
            <Image
              src="/homeAssets/Image-14.webp"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSession;
