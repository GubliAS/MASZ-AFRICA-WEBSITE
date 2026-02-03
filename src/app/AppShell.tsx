'use client'; // Entire AppShell is client-side

import dynamic from 'next/dynamic';
import Navbar from './components/navbar';
import LenisProvider from './providers/LenisProvider';
import Footer from './components/footer';
import Chatbot from './components/chatbot';

// Make CallToAction client-only (no SSR)
const CallToAction = dynamic(() => import('./sessions/CallToAction'), {
  ssr: false,
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <LenisProvider>{children}</LenisProvider>
      <CallToAction />
      <Footer />
      <Chatbot />
    </>
  );
}
