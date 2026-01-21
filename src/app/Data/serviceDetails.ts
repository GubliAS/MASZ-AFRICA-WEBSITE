export interface serviceDetails {
  slug: string;
  heroImage: string;
  heroTag: string;
  heroTitle: string;

  description: string;

  benefitsImage: string;
  benefitsTitle: string;
  benefitsSubtitle: string;

  benefits: {
    id: number;
    title: string;
    description: string;
  }[];
}

export const serviceDetailsTemplate = [
  {
    slug: 'grinding-media',
    heroImage: '/serviceAssets/Image-1-3.webp',
    heroTag: 'consumable',
    heroTitle: 'grinding media',

    description: `   MASZ-AFRICA supplies high-performance forged and cast steel
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
                that enhance both performance and profitability.`,

    benefitsImage: '/serviceAssets/Image-16.jpg',
    benefitsTitle: ' Engineered for Efficiency and Profitability.',
    benefitsSubtitle: `Delivering reliable mining consumables and expert technical
                support to keep your operations running smoothly, reduce
                downtime, and maximize efficiency—helping your business save
                costs and boost profitability. Partner with us for innovative
                solutions and unwavering support that drive growth and success
                in every project.`,

    benefits: [
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
    ],
  },
];
