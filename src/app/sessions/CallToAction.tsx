import Image from 'next/image';
import React from 'react';
import Button from '../components/button';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

function CallToAction() {
  return (
    <section>
      <div className="relative h-screen h-[600px] lg:h-screen overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <Image
          src="/homeAssets/cta-image-4.png"
          alt="cta image"
          fill
          priority
          className="object-cover"
        />

        {/* BOTTOM FADE OVERLAY */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[45%] lg:h-[60%]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(13,13,13,0) 0%, var(--surface-overlay) 100%)',
          }}
        />

        {/* CONTENT */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center px-4 ">
          <div className="relative w-[50px] h-[50px]  top-[-40]">
            <Image
              src="/maszAssets/website-logo.svg"
              alt="cta-logo-element"
              fill
              priority
            />
          </div>

          <h2 className="text-2xl-semibold font-semibold max-w-[350px] my-[20] lg:my-[30] lg:text-4xl-semibold lg:max-w-[800px] leading-tight">
            READY TO TAKE YOUR MINING OPERATIONS TO THE NEXT LEVEL?
          </h2>

          <p className="mt-6 text-sm max-w-[400px] lg:text-xl lg:max-w-[850px] lg:mb-[20]">
            With industry expertise, advanced solutions, and a commitment to
            safety and efficiency, we are ready to support your project from
            planning to execution. Our team works closely with you to optimize
            performance, reduce risks, and achieve sustainable results. Reach
            out today and experience a partner who delivers real value at every
            step.
          </p>

          <Link href="/contactUs" className="my-[50]">
            <Button
              label="contact us"
              variant="primary"
              size="extraLarge"
              icon={
                <>
                  <span className="lg:hidden">
                    <MoveRight size={16} strokeWidth={2} />
                  </span>
                  <span className="hidden lg:inline-block">
                    <MoveRight size={16} strokeWidth={3} />
                  </span>
                </>
              }
              className="text-lg lg:text-xl"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
