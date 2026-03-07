"use client";

import React from "react";
import Tag from "../components/tag";
import AnimationCopy from "../animations/WritingTextAnimation";
import ServicesCardsSection from "../sessions/ServicesCardsSection";
import ScrollReveal from "../components/ScrollReveal";
import LineByLineText from "../components/LineByLineText";

export default function Page() {
  return (
    <section className="">
      <ScrollReveal direction="up" duration={0.75} start="top 60%" scale>
        <div className="services-main-content mx-[24]  xl:mx-[120] mt-[80] lg:mt-[150] max-h-[800] pb-[100] lg:pb-0 lg:h-screen ">
          <Tag text="products and Services" />
          <div className="text-content lg:mt-[50]">
            <div className="header uppercase text-xl-semibold lg:text-4xl-semibold mt-[50] xl:mt-[100]  mb-[30] lg:mb-[50]">
              <div className="line-1 lg:mb-[-20] mb-[-8]">
                Strengthening the
              </div>
              <div className="line-2 text-primary-default">
                Global minining backbone
              </div>
            </div>
            {/* <AnimationCopy> */}
            <LineByLineText
              startAnimation={true}
              delay={0.5}
              duration={0.3}
              stagger={0.05}
              className="description text-md-regular  lg:text-2xl-medium text-default-body lg:tracking-tight lg:leading-8"
            >
              At Masz-Africa, we do more than just supply mining products — we
              become a true operational partner for your business. Our
              commitment extends beyond delivery: we provide the tools,
              expertise, and ongoing support necessary to keep your projects
              running seamlessly. Whether it’s high-quality consumables,
              specialized equipment, or expert technical consultancy,
              Masz-Africa is dedicated to ensuring that every aspect of your
              mining operations is efficient, safe, and productive. We
              understand that each mining project has unique challenges, which
              is why our solutions are tailored to meet the specific demands of
              your site, no matter where you operate across West Africa. With
              Masz-Africa, you gain more than a supplier — you gain a trusted
              partner focused on maximizing performance, reducing downtime, and
              helping your operations achieve their full potential.
            </LineByLineText>
            {/* </AnimationCopy> */}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" duration={0.75} start="top 70%" scale>
        <div className="service-cards-section">
          <ServicesCardsSection />
        </div>
      </ScrollReveal>
    </section>
  );
}
