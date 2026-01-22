export interface serviceDetails {
  slug: string;
  heroImage: string;
  heroAltText: string;
  heroTag: string;
  heroTitle: string;

  description: string;

  benefitsImage: string;
  benefitsAltText: string;
  benefitsTitle: string;
  benefitsSubtitle: string;

  benefits: {
    id: number;
    title: string;
    description: string;
  }[];
}

export const serviceDetailsTemplate = [
  //GRINDING MEDIA

  {
    slug: 'grinding-media',
    headerFirst: 'consumables that keep your mine',
    headerSecond: 'moving without compromise',
    heroImage: '/serviceAssets/Image-1-3.webp',
    heroAltText: 'Grinding media',
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
    benefitsAltText: 'Grinding media',
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

  // ACTIVATED CARBON
  {
    slug: 'activated-carbon',
    headerFirst: 'consumables that keep your mine',
    headerSecond: 'moving without compromise',
    heroImage: '/serviceAssets/Image-2-1.webp',
    heroAltText: 'activated carbon',
    heroTag: 'consumable',
    heroTitle: 'activated carbon',

    description: `  MASZ-AFRICA supplies premium high-adsorption, low-attrition activated carbon 
    specifically engineered for CIP (Carbon in Pulp) and CIL (Carbon in Leach) gold recovery 
    processes. Our activated carbon is designed to deliver consistent, reliable performance 
    even under demanding, high-throughput gold extraction co   ditions, ensuring maximum recovery 
    efficiency with minimal carbon degradation. This makes it ideally suited for large-scale 
    operations aiming for both operational reliability and cost-effectiveness.
    <br/><br/>
    Each batch undergoes rigorous quality testing, including assessments of moisture content, 
    iodine number, and hardness, guaranteeing uniform performance and full compliance with 
    international standards. This meticulous quality control ensures predictable adsorption 
    capacity, extended service life, and stable recovery rates across all stages of the process, 
    minimizing downtime, reducing replacement costs, and supporting uninterrupted production.
    <br/><br/>
    Beyond supplying top-quality carbon, MASZ-AFRICA provides comprehensive technical consultation 
    covering carbon handling, regeneration, and circuit optimization. Our experienced team evaluates 
    processing conditions—including ore characteristics, mill configurations, pulp chemistry, and 
    recovery targets—to recommend the optimal carbon type, size distribution, regeneration schedule, 
    and operational adjustments.
    <br/><br/>
    We also focus on process efficiency and sustainability, helping plants reduce carbon loss, 
    lower energy consumption during regeneration, and maintain environmentally responsible operations. 
    By combining premium products with tailored technical support, MASZ-AFRICA ensures that every 
    operation achieves peak performance, improved recoveries, and long-term operational stability.`,

    benefitsImage: '/serviceAssets/Image-16.jpg',
    benefitsAltText: 'Grinding media',
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
        title: 'Maximized gold recovery rates',
        description:
          'High-adsorption carbon ensures efficient metal capture in both CIP and CIL processes. This leads to higher extraction efficiency and maximizes overall gold recovery.',
      },
      {
        id: 2,
        title: 'Enhanced circuit stability',
        description:
          'Reliable adsorption performance maintains consistent processing rates across all CIP and CIL stages. It prevents fluctuations in throughput and ensures smooth, uninterrupted operations.',
      },
      {
        id: 3,
        title: 'Improved overall cost-effectiveness',
        description:
          'Longer-lasting carbon and efficient recovery help reduce consumable costsand lower maintenance expenses.This drives overall savings and improves operational profitability.',
      },
      {
        id: 4,
        title: 'Technical support for maximum impac',
        description:
          'MASZ-AFRICA consultancyensures carbon usage is tailoredto ore type, mill design, and recovery targets. Our expert guidance optimizes processes for consistent, high-performance results.',
      },
      {
        id: 5,
        title: 'Extended carbon service life',
        description:
          'Durable material and proper handling minimize frequent replacements and reduce operational interruptions. This extends service life and enhances plant reliability..',
      },
      {
        id: 6,
        title: 'Eco-friendly and sustainable operations',
        description:
          'Optimized carbon usage and efficient recovery methods minimize environmental impact while supporting sustainable practices. We focus on reducing waste and promoting responsible mining operations.',
      },   
    ],
  },



  // METAL AND STEEL PIPES
  {
    slug: 'metal-and-steel-pipes',
    headerFirst: 'consumables that keep your mine',
    headerSecond: 'moving without compromise',
    heroImage: '/serviceAssets/Image-3-1.webp',
    heroAltText: 'activated carbon',
    heroTag: 'consumable',
    heroTitle: 'metal and steel pipes',

    description: ` MASZ-AFRICA supplies high-quality carbon steel, stainless steel, and galvanized
    pipes engineered to perform reliably in the most demanding mining and industrial environments. 
    Designed to withstand abrasive slurries, high pressures, and corrosive conditions, our pipes 
    provide durable, long-lasting solutions for a wide range of applications including slurry transport, 
    water distribution, chemical processing, and heavy-duty industrial pipelines. Our products combine 
    robust material properties with precision engineering, ensuring optimal performance and minimal 
    maintenance in extreme operational environments.
    <br/><br/>
    Each pipe is manufactured to the highest international standards, including API (American Petroleum Institute), 
    ASTM (American Society for Testing and Materials), and ISO (International Organization for Standardization) 
    certifications. Every batch undergoes comprehensive inspection, including verification of wall thickness, 
    dimensional accuracy, and weld integrity, ensuring consistency, safety, and peak performance even under the 
    harshest conditions.
    <br/><br/>
    MASZ-AFRICA goes beyond supply by providing technical guidance and on-site consultation for pipe selection, 
    corrosion protection, and installation. Our team assists clients in determining the most suitable material, 
    diameter, and thickness based on the specific mining process, fluid properties, and environmental conditions. 
    We also offer custom cutting, fabrication, and pre-assembly services to meet project-specific requirements, 
    minimizing on-site adjustments and ensuring seamless integration into client systems.`,

    benefitsImage: '/serviceAssets/Image-3-1.webp',
    benefitsAltText: 'Metal and Steel Pipes',
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
        title: 'Superior durability in harsh environments',
        description:
          'Engineered to withstand abrasive slurries, high pressures, and corrosive mining conditions. Our robust construction ensures pipes maintain structural integrity even under extreme operational stress.',
      },
      {
        id: 2,
        title: 'Long-term operational stability',
        description:
          'High-performance pipes contribute to predictable system behavior and reduced downtime across projects. This reliability allows operators to focus on productivity rather than frequent maintenance.',
      },
      {
        id: 3,
        title: 'Enhanced safety and operational compliance',
        description:
          'Pipes and installation procedures adhere to industry best practices, reducing risk to personnel and equipment. Compliance with international safety standards ensures peace of mind for mining and industrial operations.',
      },
      {
        id: 4,
        title: 'Consistent, long-term performance',
        description:
          'Manufactured to international standards (API, ASTM, ISO) with rigorous wall thickness and weld integrity inspections. Every pipe batch is tested to guarantee uniform quality and dependable performance over time.',
      },
      {
        id: 5,
        title: 'Reliable supply and on-site integration',
        description:
          'MASZ-AFRICA ensures timely delivery and seamless installation support for uninterrupted operations. Our dedicated logistics and technical teams coordinate with clients for efficient project execution.',
      },
      {
        id: 6,
        title: 'Customized solutions for unique operational needs',
        description:
          'From specialized diameters to tailored coatings and fittings, MASZ-AFRICA provides solutions designed to match each client’s specific process requirements. This flexibility maximizes efficiency, reduces downtime, and optimizes long-term cost-effectiveness.',
      },
    ],
  },




  {
    slug: 'gear-box-servicing-and-heavy-equipment-maintenance',
    headerFirst: 'consumables that keep your mine',
    headerSecond: 'moving without compromise',
    heroImage: '/serviceAssets/Image-6-1.webp',
    heroAltText: 'activated carbon',
    heroTag: 'service',
    heroTitle: 'metal and steel pipes',

    description: ` MASZ-AFRICA delivers professional gearbox servicing, diagnostics, and heavy-machine 
    maintenance solutions for critical mining equipment, including crushers, grinding mills, conveyors, 
    and material-handling systems. Our services are designed to restore mechanical integrity, enhance 
    efficiency, and extend the operational lifespan of essential machinery operating in extreme mining 
    conditions. With a focus on precision, reliability, and uptime, we help mining operations maintain 
    productivity even under the harshest conditions.
    <br/><br/>
    Our highly trained technicians conduct comprehensive inspections and fault diagnostics using advanced 
    testing tools to identify wear, misalignment, lubrication issues, vibration irregularities, and 
    component fatigue. Using OEM-approved replacement parts and industry-recognized servicing procedures, 
    we repair, rebuild, and recalibrate gearboxes to return equipment to optimal working condition while 
    minimizing the risk of recurring failures.
    <br/><br/>
    MASZ-AFRICA’s mobile maintenance teams are equipped to provide rapid on-site response across active 
    mining locations. This minimizes downtime, reduces production losses, and ensures that critical 
    operations resume quickly and safely. Whether for planned preventative maintenance, predictive 
    diagnostics, or emergency interventions, our approach is structured, precise, and aligned with 
    international maintenance best practices, ensuring long-term operational continuity.`,

    benefitsImage: '/serviceAssets/Image-3-1.webp',
    benefitsAltText: 'Metal and Steel Pipes',
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
        title: 'Improved mechanical reliability',
        description:
          'Comprehensive diagnostics and precision repairs reduce the risk of unexpected failures. Advanced monitoring and maintenance techniques ensure gearboxes and machinery maintain consistent performance over time.',
      },
      {
        id: 2,
        title: 'Enhanced safety and compliance',
        description:
          'Maintenance practices align with international standards, reducing risk to personnel and equipment.Regular inspections and standardized procedures prevent accidents and promote a safe working environment.',
      },
      {
        id: 3,
        title: 'Faster turnaround on repairs',
        description:
          'Efficient on-site servicing and diagnostics restore equipment quickly, avoiding extended production delays. Our mobile teams are strategically deployed to ensure rapid response, keeping critical operations running.',
      },
      {
        id: 4,
        title: 'Reduced maintenance and repair costs',
        description:
          'Proactive servicing prevents major breakdowns and minimizes costly emergency interventions. Long-term cost savings are achieved through extended equipment lifespan and fewer unplanned stoppages.',
      },
      {
        id: 5,
        title: 'Optimized operational efficiency',
        description:
          'Properly serviced gearboxes and machinery operate at peak performance, improving throughput and energy utilization. Enhanced machine reliability contributes directly to smoother production processes and higher productivity.'
      },

      {
        id: 6,
        title: 'Tailored maintenance solutions for complex machinery',
        description:
          'MASZ-AFRICA provides customized service plans based on equipment type, operating conditions, and usage patterns. This ensures every machine receives the right level of attention, maximizing uptime and operational value.',
      },
    ],
  },
];
