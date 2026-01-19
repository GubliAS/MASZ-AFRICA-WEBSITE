'use client';
import ParallaxSection from '../animations/ImageParallax';
import Tag from '../components/tag';
import AnimationCopy from '../animations/WritingTextAnimation';
import PerformanceMetrics from '../components/PerformanceMetrics';
import TiltCard from '../animations/TiltCard';
import CoreValueCard from '../components/MainCoreValuesCard';
import { IconAwardFilled } from '@tabler/icons-react';
import TeamMembersSection from '../sessions/TeamMembersSection';
import GallerySection from '../sessions/GallerySection';

type CoreValue = {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
};

const coreValues = [
  {
    number: 1,
    title: 'Innovation',
    description:
      'We constantly strive for new ideas and solutions to improve our services.',
  },
  {
    number: 2,
    title: 'Integrity',
    description:
      'We act ethically, transparently, and always keep our promises.',
  },
  {
    number: 3,
    title: 'Excellence',
    description:
      'We deliver quality and performance above expectations in everything we do.',
  },
  {
    number: 4,
    title: 'Customer Partnership',
    description:
      'We build strong relationships with clients through trust and collaboration.',
  },
  {
    number: 5,
    title: 'Safety & Sustainability',
    description:
      'We prioritize safety and environmental responsibility in all operations.',
  },
];

const valueCards: CoreValue[] = [
  {
    id: 1,
    number: '01',
    title: 'Innovation',
    image: '/aboutAssets/M-1.webp',
    description:
      'We are driven by a culture of creativity, curiosity, and continuous improvement. By embracing new ideas, modern technologies, and unconventional thinking, we consistently challenge the status quo to design smarter, more efficient, and future-ready solutions. Our approach to innovation enables us to adapt quickly to change, solve complex problems, and create long-term value for our clients and partners.',
  },
  {
    id: 2,
    number: '02',
    title: 'Integrity',
    image: '/aboutAssets/M-2.webp',
    description:
      'Integrity is the foundation of everything we do. We operate with honesty, transparency, and accountability in every interaction, ensuring that our decisions and actions are guided by strong ethical principles. By keeping our commitments and maintaining open communication, we build trust, credibility, and lasting relationships with our clients, partners, and stakeholders.',
  },
  {
    id: 3,
    number: '03',
    title: 'Excellence',
    image: '/aboutAssets/M-3.webp',
    description:
      'We pursue excellence through discipline, expertise, and an unwavering commitment to quality. Every project we undertake is approached with attention to detail, continuous evaluation, and a desire to exceed expectations. By combining technical competence with professionalism, we deliver outcomes that are reliable, impactful, and aligned with the highest industry standards.',
  },
  {
    id: 4,
    number: '04',
    title: 'Customer Partnership',
    image: '/aboutAssets/M-4.webp',
    description:
      'We believe that true success is built through strong, collaborative partnerships. By deeply understanding our clients’ objectives, challenges, and environments, we tailor solutions that are both practical and strategic. Through trust, open dialogue, and shared goals, we foster long-term relationships that generate sustainable growth and mutual success.',
  },
  {
    id: 5,
    number: '05',
    title: 'Safety & Sustainability',
    image: '/aboutAssets/M-4.webp',
    description:
      'Safety and sustainability are integral to our operations and decision-making processes. We prioritize the well-being of our people while actively minimizing environmental impact through responsible and efficient practices. By promoting safe working environments and sustainable resource management, we contribute to long-term environmental, social, and economic resilience.',
  },
];

const achievements = [
  {
    id: 1,
    title:
      'Founded in 2025 and operational across Ghana, west-Africa and Globally.',
  },
  {
    id: 2,
    title:
      'Expanded into technical maintenance and engineering advisory services',
  },
  {
    id: 3,
    title: '5+ Major clients served with repeated contracts.',
  },
  {
    id: 4,
    title: 'Established strategic alliances with international manufacturers.',
  },
  {
    id: 5,
    title: '5+ Major clients served with repeated contracts.',
  },
];

const teamMemberDetails = [
  {
    id: 1,
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads 
  the company’s strategic vision and drives operational excellence across all its services.
  With extensive experience in procurement, supply chain management, engineering, and business operations,
  <br /><br />
  Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation.
  Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, 
  strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.
  <br /><br />
  Beyond his corporate role, Samuel is passionate about driving innovation, empowering talent, and supporting 
  Africa’s industrial and economic development.`,
    image: '/aboutAssets/TEAM-1.jpg',
  },
  {
    id: 2,
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads 
  the company’s strategic vision and drives operational excellence across all its services.
  With extensive experience in procurement, supply chain management, engineering, and business operations,
  <br /><br />
  Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation.
  Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, 
  strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.
  <br /><br />
  Beyond his corporate role, Samuel is passionate about driving innovation, empowering talent, and supporting 
  Africa’s industrial and economic development.`,
    image: '/aboutAssets/TEAM-1.jpg',
  },
  {
    id: 3,
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads 
  the company’s strategic vision and drives operational excellence across all its services.
  With extensive experience in procurement, supply chain management, engineering, and business operations,
  <br /><br />
  Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation.
  Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, 
  strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.
  <br /><br />
  Beyond his corporate role, Samuel is passionate about driving innovation, empowering talent, and supporting 
  Africa’s industrial and economic development.`,
    image: '/aboutAssets/TEAM-1.jpg',
  },
  {
    id: 4,
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads 
  the company’s strategic vision and drives operational excellence across all its services.
  With extensive experience in procurement, supply chain management, engineering, and business operations,
  <br /><br />
  Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation.
  Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, 
  strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.
  <br /><br />
  Beyond his corporate role, Samuel is passionate about driving innovation, empowering talent, and supporting 
  Africa’s industrial and economic development.`,
    image: '/aboutAssets/TEAM-1.jpg',
  },
  {
    id: 5,
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads 
  the company’s strategic vision and drives operational excellence across all its services.
  With extensive experience in procurement, supply chain management, engineering, and business operations,
  <br /><br />
  Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation.
  Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, 
  strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.
  <br /><br />
  Beyond his corporate role, Samuel is passionate about driving innovation, empowering talent, and supporting 
  Africa’s industrial and economic development.`,
    image: '/aboutAssets/TEAM-1.jpg',
  },

  ,
];

function AboutUSPage() {
  return (
    <section className="w-full">
      <div className="main-about-page-content">
        <div className="main-about-hero-content">
          <div className="tag-container mx-[21] mt-[30] lg:mt-[60] lg:mx-[200]">
            <Tag text="About us" />
          </div>

          {/* TOP TEXT */}
          <div className="about-page-hero-text-container mx-[21px] lg:mx-[200px] my-[40px] lg:my-[40px]">
            <div className="page-header text-xl-semibold uppercase lg:text-4xl-bold">
              We are{' '}
              <span className="subtext text-primary-default">Masz-Africa</span>
            </div>
            <div className="uppercase text-xs-medium text-default-body lg:text-xl-semibold">
              General Mining and procurement services limited
            </div>
          </div>

          {/* PARALLAX IMAGE */}
          <ParallaxSection
            imageSrc="/aboutAssets/Image-6.webp"
            ShowText={false}
          />
        </div>

        {/* conpany-description-section */}
        <div className="company-description-content lg:my-[100]">
          <div className="desctiption-text mx-[21] lg:mx-[200] ">
            <Tag text="our story" className="my-[40]" />
            <AnimationCopy>
              <div className="main-text-description text-lg-medium lg:text-2xl-medium lg:mt-[80] lg:leading-8 lg:tracking-tight">
                MASZ-AFRICA Ltd is a Ghana-based private limited liability
                company that provides high-quality mining consumables,
                engineering support, and procurement solutions to mining and
                mineral processing industries across Africa. <br />
                <br />
                Established in September 2025 by a multidisciplinary team with
                more than 15 years of combined experience in metallurgy,
                engineering, finance, supply chain management, and business
                improvement, the company was created to address the lack of
                dependable, responsive, and technically knowledgeable supply
                partners within the African mining sector.From the beginning,
                MASZ-Africa has focused on quality, reliability, and client
                satisfaction. Through strong partnerships with globally
                recognized manufacturers and original equipment suppliers, the
                company delivers world-class products supported by solid
                technical expertise and consistent on-time delivery. <br />
                <br />
                With a growing presence across West Africa, MASZ-Africa aims to
                become a continental leader in mining supply, logistics, and
                technical services. The company is committed to empowering
                mining operations with reliable supplies, innovative solutions,
                and smooth service delivery that keeps production running
                efficiently.
              </div>
            </AnimationCopy>
            <div className="metrics-container my-[50px] lg:flex lg:gap-8 mt-[50]">
              <PerformanceMetrics
                text="years of combined experience"
                value="15+"
              />
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
          </div>
        </div>

        {/* vision-mission-hero-section */}
        <div className="vision-mission-section-container">
          <div className="vision-mission-parallax-section">
            <ParallaxSection
              imageSrc="/aboutAssets/image-4.webp"
              title="DEFINING THE FUTURE WE STAND FOR"
              subtitle="Our guiding principles define how we operate today—and the impact we aim to make tomorrow. They guide our work, shape our decisions, and keep us aligned with the needs of a fast-evolving mining sector. Every step we take reflects our commitment to progress and long-term value."
            />
          </div>
        </div>

        {/* vision-statement-section */}
        <div className="vision-mission-statement lg:mx-[200] lg:my-[150] ">
          <div className="vision-statement lg:flex lg:justify-between ">
            <div className="text mx-[21]">
              <Tag text="our vision" className="my-[80] lg:my-0" />
              <AnimationCopy>
                <div className="main-text text-xl-semibold lg:text-3xl-semibold lg:leading-10 tracking-tight text-default-body lg:my-[50] lg:w-[650]">
                  To deliver trusted mining consumables and technical solutions
                  that enhance productivity, reliability, and sustainability
                  across Africa’s mining value chain.
                </div>
              </AnimationCopy>
              <div className="subtext text-sm-medium lg:w-[650] text-default-body lg:text-xl-medium lg:leading-6 my-[40] lg:bg-surface-card-colored-primary">
                As a trusted global partner, MASZ-AFRICA supplies quality mining
                products backed by technical expertise. We focus on improving
                productivity and ensuring uninterrupted operations. Our team
                works closely with clients to provide solutions tailored to
                their needs. We emphasize reliability, timely delivery, and
                long-term value creation. Our approach blends global standards
                with local understanding and responsiveness.
              </div>
            </div>
            <div className="image-container relative w-full lg:w-1/2 h-[520px]">
              <TiltCard
                imageSrc="/aboutAssets/Image-7.webp"
                title="Vision Image"
              />
            </div>
          </div>
        </div>

        {/* mission-statement */}
        <div className="mission-statement lg:mx-[200]  lg:my-[250]">
          <div className="mission-statement lg:flex lg:justify-between lg:flex-row">
            <div className="hidden lg:block image-container relative w-full lg:w-1/2 h-[520px]">
              <TiltCard
                imageSrc="/aboutAssets/Image-13.webp"
                title="mision Image"
              />
            </div>
            <div className="text mx-[21]">
              <Tag text="our mission" className="mb-[60] lg:mb-0" />
              <AnimationCopy>
                <div className="main-text text-xl-semibold lg:text-3xl-semibold lg:leading-10 tracking-tight text-default-body lg:my-[50] lg:w-[650]">
                  To become Africa’s most trusted and efficient mining
                  procurement and service brand, connecting global manufacturing
                  quality with local operational realities.
                </div>
              </AnimationCopy>
              <div className="subtext text-sm-medium lg:w-[650] text-default-body lg:text-xl-medium lg:leading-6  my-[40] lg:my-[18] lg:bg-surface-card-colored-primary">
                MASZ-AFRICA aims to be Africa’s most trusted and efficient
                mining procurement and service brand. We connect global
                manufacturing quality with the practical needs of local mining
                operations. Our focus is on reliability, timely delivery, and
                technical excellence. We provide solutions that streamline
                procurement, reduce downtime, and enhance productivity. By
                combining international standards with local understanding, we
                empower mining operations
              </div>
            </div>
            <div className="lg:hidden image-container relative w-full lg:w-1/2 h-[520px]">
              <TiltCard
                imageSrc="/aboutAssets/Image-13.webp"
                title="mision Image"
              />
            </div>
          </div>
        </div>

        {/* Core Values section */}
        <div className="core-values-section bg-[#f3f3f3]  my-[100] lg:pt-[50]">
          <div className="core-value-section-content-wrapper  mx-[21] lg:mx-[200]">
            <Tag text="Our core values" className="my-[60]" />
            <div className="core-values-text-wrapper">
              <div className="section-header uppercase text-xl-semibold lg:text-4xl-semibold">
                <span className="text-primary-default">The heart </span>of our
                work
              </div>
              <div className="subtext text-sm-medium lg:text-md-medium my-[20] lg:w-[700]">
                Our core values guide how we operate, shaping our decisions,
                relationships, and the standard we deliver every day, ensuring
                we remain consistent, trustworthy, and committed to excellence
                across all our operations.
              </div>
            </div>
            <div className="core-value-core-content-wrapper lg:pb-[200] lg:pt-[80]">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap- ">
                {valueCards.map((card) => (
                  <CoreValueCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* key-achievements-section */}
        <div className="key-achievements-section ">
          <div className="main-section-content mx-[21] lg:ml-[200] lg:pb-[100] lg:flex ">
            <div className="left-side ">
              <Tag text="key achievements" />

              {/* header and section texts */}
              <div className="section-text my-[40] lg:my-[80] ">
                <div className="header uppercase text-xl-semibold lg:text-4xl-semibold flex flex-col lg:flex-row gap-0 lg:mb-[20]">
                  <p>checkout our</p>
                  <span className="lg:ml-[12] text-primary-default">
                    key achievements
                  </span>
                  {/* <div className="header-breaks-wrapped flex gap-1 -mt-2 lg:-mt-5 lg:gap-3">
                    <p className="text-primary-default">key achievements</p>
                    <span>AND</span>
                    <span className="text-primary-default">milsestone</span>
                  </div> */}
                </div>
                <div className="subtext text-sm-regular text-default-body lg:text-lg-medium lg:w-[940]">
                  Every milestone we’ve reached is a result of hard work, strong
                  partnerships, and a genuine commitment to supporting our
                  clients’ operations. These achievements represent the trust
                  we’ve earned and our ongoing mission to keep Africa’s mining
                  industry moving forward.
                </div>
              </div>

              {/* achievements card section */}

              <div className="achievement-cards flex flex-col lg:flex-row gap-4 lg:flex-wrap lg:gap-8">
                {achievements.map((card) => (
                  <div
                    key={card.id}
                    tabIndex={0} // 🔹 makes div focusable on mobile
                    className="achievements-card group bg-white border-default-card-stroke text-sm-regular lg:text-lg-regular flex items-center gap-4 lg:gap-16 cursor-pointer lg:w-[750px] p-[20px] lg:p-[30px] 
                    transition-all duration-500 ease-in-out
                  hover:bg-[#016BF2] hover:scale-105
                  focus-within:bg-[#016BF2] focus-within:scale-105"
                  >
                    <div
                      className="icon bg-surface-card-colored-secondary rounded-full p-[10px] lg:p-[15px] transition-all duration-500 ease-in-out
                      group-hover:bg-white group-focus-within:bg-white"
                    >
                      <IconAwardFilled
                        className="text-primary-default w-[25px] h-[25px] lg:w-[35px] lg:h-[35px] transition-all duration-500 ease-in-out
                                  group-hover:text-default-primary group-focus-within:text-default-primary"
                      />
                    </div>

                    <div
                      className="text-[#777777] transition-all duration-500 ease-in-out
                      group-hover:text-white group-focus-within:text-white"
                    >
                      {card.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="Team-members-section h-screen bg-[#f3f3f3]">
          <div className="team-member-section-main-content flex lg:flex-col lg:justify-center lg:items-center gap-40 lg:pt-[100]">
            <div className="details-section-upper flex lg:justify-center lg:gap-25 lg:mx-[200]">
              <div className="image-left relative lg:w-[30%] lg:h-[500]">
                <Image
                  src="/aboutAssets/TEAM-1.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="details-right lg:w-[50%]">
                <div className="team-member-name uppercase text-primary-default lg:text-3xl-semibold lg:mb-[20]">
                  samuel Okwabeng
                </div>
                <div className="text-description lg:text-lg-medium text-default-body">
                  Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA,
                  where he leads the company’s strategic vision and drives
                  operational excellence across all its services. With extensive
                  experience in procurement, supply chain management,
                  engineering, and business operations, Samuel has transformed
                  MASZ-AFRICA into a trusted partner for clients seeking
                  quality, efficiency, and innovation.His leadership blends
                  deep industry knowledge with a forward-thinking approach,
                  ensuring the company stays ahead in a competitive and dynamic
                  market. Under his guidance, MASZ-AFRICA has significantly
                  expanded its reach across Africa and internationally,
                  strengthened its service delivery, and earned a reputation for
                  integrity, reliability, and client satisfaction. 
                  continent.
                </div>
              </div>
            </div>
            <div className="indicator-section-lower flex items-center justify-center gap-6 w-[20%] h-auto bg-white p-[10] ">
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-1.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-2.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-3.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-4.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-5.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div> */}

        <TeamMembersSection />

        <div className="gallery-container lg:py-[100]">
          <GallerySection/>
        </div>
        
      </div>
    </section>
  );
}

export default AboutUSPage;
