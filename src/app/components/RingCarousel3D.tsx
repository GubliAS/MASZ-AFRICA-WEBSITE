"use client";

import * as THREE from "three";
import React, { useRef, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Canvas,
  useFrame,
  type RootState,
  type ThreeEvent,
} from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { easing } from "maath";

/**
 * Slide data – images from /public/aboutAssets
 */
const herodata3d = [
  { title: "Slide 1", image: "/aboutAssets/Image-1.webp" },
  { title: "Slide 2", image: "/aboutAssets/Image-2.webp" },
  { title: "Slide 2", image: "/aboutAssets/Image-4.webp" },
  { title: "Slide 3", image: "/aboutAssets/Image-3.webp" },
  { title: "Slide 4", image: "/aboutAssets/Image-4.webp" },
  { title: "Slide 4", image: "/aboutAssets/Image-5.webp" },
  { title: "Slide 6", image: "/aboutAssets/Image-1.webp" },
  { title: "Slide 6", image: "/aboutAssets/Image-6.webp" },
  { title: "Slide 7", image: "/aboutAssets/Image-7.webp" },
];

const SLIDE_COUNT = herodata3d.length;

function useViewport() {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === "undefined") return { isMobile: false, isTablet: false, isSmallDesktop: false };
    const w = window.innerWidth;
    return {
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isSmallDesktop: w >= 1024 && w < 1200,
    };
  });

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const w = window.innerWidth;
      setViewport({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isSmallDesktop: w >= 1024 && w < 1200,
      });
      ticking = false;
    };
    const onResize = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewport;
}

function createBentPlaneGeometry(
  width: number,
  height: number,
  radius: number,
  segX = 16,
  segY = 16
) {
  const geometry = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();
  const arcWidth = width / radius;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const angle = (v.x / width) * arcWidth;
    const z = -radius * Math.cos(angle) + radius;
    pos.setXYZ(i, v.x, v.y, z);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

interface RigProps {
  onRotationChange?: (index: number) => void;
  rotation?: [number, number, number];
  targetRotation?: number;
  children?: ReactNode;
}

const Rig = React.memo(function Rig({
  onRotationChange,
  targetRotation,
  children,
  rotation: initialRotation = [0, 0, 0],
  ...props
}: RigProps) {
  const ref = useRef<THREE.Group>(null);
  const lastSlideIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.rotation.set(
      initialRotation[0],
      initialRotation[1],
      initialRotation[2]
    );
  }, [initialRotation]);

  useFrame((state: RootState, delta: number) => {
    if (!ref.current) return;

    if (targetRotation !== undefined) {
      easing.dampE(
        ref.current.rotation,
        [initialRotation[0], targetRotation, initialRotation[2]],
        0.2,
        delta
      );
    } else {
      ref.current.rotation.y -= delta * 0.05;
    }

    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 0.45, 1.2 - state.pointer.y * 0.3, 10.5],
      0.25,
      delta
    );

    state.camera.lookAt(0, 0, 0);

    if (onRotationChange) {
      const normRot =
        ((ref.current.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const slideIndex =
        Math.round((normRot / (Math.PI * 2)) * SLIDE_COUNT) % SLIDE_COUNT;
      if (slideIndex !== lastSlideIndexRef.current) {
        lastSlideIndexRef.current = slideIndex;
        onRotationChange(slideIndex);
      }
    }
  });

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
});

interface CardProps {
  url: string;
  title: string;
  position: [number, number, number];
  rotation: [number, number, number];
  cardSize: [number, number];
  radius: number;
}

const Card = React.memo(function Card({ url, cardSize, radius, ...props }: CardProps) {
  const ref = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);

  const texture = useTexture(url);

  const bentGeometry = useMemo(() => {
    return createBentPlaneGeometry(cardSize[0], cardSize[1], radius, 16, 16);
  }, [cardSize[0], cardSize[1], radius]);

  useEffect(() => {
    return () => bentGeometry.dispose();
  }, [bentGeometry]);

  const pointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoveredRef.current = true;
  };

  const pointerOut = () => {
    hoveredRef.current = false;
  };

  useFrame((_, delta) => {
    if (!ref.current) return;
    easing.damp3(
      ref.current.scale,
      hoveredRef.current ? 1.2 : 1,
      0.12,
      delta
    );
  });

  return (
    <group {...props}>
      <mesh
        ref={ref}
        geometry={bentGeometry}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        scale={[-1, 1, 1]}
      >
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
});

const Carousel = React.memo(function Carousel({
  radius = 3.5,
  count = SLIDE_COUNT,
  cardSize = [2.5, 2],
}: {
  radius: number;
  count?: number;
  cardSize: [number, number];
}) {
  const slides = herodata3d.slice(0, count);

  const positions = useMemo(() => {
    return slides.map((_, i) => [
      Math.sin((i / count) * Math.PI * 2) * radius,
      0,
      Math.cos((i / count) * Math.PI * 2) * radius,
    ] as [number, number, number]);
  }, [count, radius, slides.length]);

  const rotations = useMemo(() => {
    return slides.map((_, i) =>
      [0, Math.PI + (i / count) * Math.PI * 2, 0] as [number, number, number]
    );
  }, [count, slides.length]);

  return (
    <>
      {slides.map((slide, i) => (
        <Card
          key={i}
          url={slide.image}
          title={slide.title}
          radius={radius}
          position={positions[i]}
          rotation={rotations[i]}
          cardSize={cardSize}
        />
      ))}
    </>
  );
});

const RIG_ROTATION: [number, number, number] = [0.04, 0, -0.08];

export default function RingCarousel3D() {
  const { isMobile, isTablet, isSmallDesktop } = useViewport();

  const [targetRotation, setTargetRotation] = useState<number | undefined>(
    undefined
  );

  const slideCount = herodata3d.length;
  const baseRadius = isMobile ? 2.7 : isTablet ? 3.3 : isSmallDesktop ? 3.6 : 4.1;
  // Scale radius with slide count; smaller divisor = more spacing
  const radius = baseRadius * (slideCount / 7.7);

  const cardWidth = isMobile ? 1.75 : isTablet ? 2.25 : isSmallDesktop ? 2.55 : 3.0;
  const cardHeight = isMobile ? 1.4 : isTablet ? 1.8 : isSmallDesktop ? 2.0 : 2.35;

  const cardSize = useMemo<[number, number]>(
    () => [cardWidth, cardHeight],
    [cardWidth, cardHeight]
  );

  return (
    <div className="w-full min-h-[50vh] h-[65vh] sm:h-[75vh] lg:h-screen bg-transparent overflow-visible flex items-center justify-center -mt-6 lg:-mt-12">
      <div className="w-full h-full overflow-visible min-h-[320px]">
        <Canvas
          camera={{ position: [0, 0, 10.5], fov: 40 }}
          dpr={[1, 2]}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            alpha: true,
            premultipliedAlpha: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={1} />
          <Rig rotation={RIG_ROTATION} targetRotation={targetRotation}>
            <Carousel radius={radius} cardSize={cardSize} />
          </Rig>
        </Canvas>
      </div>
    </div>
  );
}

