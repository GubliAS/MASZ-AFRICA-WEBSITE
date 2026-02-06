'use client'; // Entire AppShell is client-side

import dynamic from 'next/dynamic';
import Navbar from './components/navbar';
import LenisProvider from './providers/LenisProvider';
import PageTransitionProvider from './providers/PageTransitionProvider';

// PERFORMANCE: Lazy load heavy components that appear below the fold
// Footer and Chatbot are loaded only when needed (reduces initial bundle size)
// This does NOT affect scrolling - Lenis handles smooth scroll independently
const Footer = dynamic(() => import('./components/footer'), {
  ssr: false,
  loading: () => null, // No loading state needed for footer
});

const Chatbot = dynamic(() => import('./components/chatbot'), {
  ssr: false,
  loading: () => null, // Chatbot button appears immediately, content loads on demand
});

// Make CallToAction client-only (no SSR)
const CallToAction = dynamic(() => import('./sessions/CallToAction'), {
  ssr: false,
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PageTransitionProvider>
      <div className="page-grid-bg" aria-hidden />
      <Navbar />
      <LenisProvider>{children}</LenisProvider>
      <CallToAction />
      <Footer />
      <Chatbot />
    </PageTransitionProvider>
  );
}
