import React from 'react';
import { serviceDetailsTemplate } from '@/app/Data/serviceDetails';
import ServiceDetailContent from './ServiceDetailContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceDetailsTemplate.find((item) => item.slug === slug);

  if (!service) {
    return <div className="p-20">Service not found: {slug}</div>;
  }

  return <ServiceDetailContent service={service} />;
}
