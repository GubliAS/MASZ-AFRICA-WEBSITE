'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ScrollReveal from '../components/ScrollReveal';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

export default function CareersPage() {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/lottie/hero-cropped.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Animation loaded successfully', data);
        setAnimationData(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Lottie load error:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="w-full h-[500px] lg:h-[600px] flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] lg:h-[600px] flex items-center justify-center">
        Loading animation...
      </div>
    );
  }

  return (
    <ScrollReveal direction="up" duration={0.75} start="top 60%" scale>
    <div className="w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-white">
      <style jsx>{`
        /* Ensure fonts are loaded */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Monument+Extended&display=swap');
      `}</style>
      
      <div style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ 
            width: '100%', 
            height: '100%',
            maxWidth: '1457px', // Match animation width
            maxHeight: '734px', // Match animation height
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: false,
            hideOnTransparent: false,
          }}
          onDOMLoaded={() => console.log('Lottie DOM loaded')}
          onComplete={() => console.log('Lottie animation completed')}
        />
      </div>
    </div>
    </ScrollReveal>
  );
}