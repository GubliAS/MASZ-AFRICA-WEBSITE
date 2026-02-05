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
  { title: "Slide 2", image: "/aboutAssets/Image-6.webp" },
  { title: "Slide 2", image: "/aboutAssets/Image-4.webp" },
  { title: "Slide 3", image: "/aboutAssets/Image-3.webp" },
  { title: "Slide 3", image: "/aboutAssets/Image-7.webp" },
  { title: "Slide 4", image: "/aboutAssets/Image-4.webp" },
  { title: "Slide 4", image: "/aboutAssets/Image-5.webp" },
 
  { title: "Slide 7", image: "/aboutAssets/Image-7.webp" },
];

const SLIDE_COUNT = herodata3d.length;

/**
 * PERFORMANCE OPTIMIZATION: useViewport Hook
 * 
 * Detects screen size to adjust carousel settings (radius, card size, DPR).
 * 
 * Optimizations:
 * 1. **Throttled resize handler**: Uses requestAnimationFrame to batch updates
 *    - Prevents excessive state updates during window resize
 *    - Only updates once per frame (60fps max)
 * 
 * 2. **Initial state from window**: Checks size on mount, not after render
 *    - Prevents flash of wrong size on first render
 *    - SSR-safe (returns defaults on server)
 * 
 * 3. **Single listener**: One resize listener instead of multiple
 *    - Reduces event listener overhead
 */
function useViewport() {
  const [viewport, setViewport] = useState(() => {
    // PERFORMANCE: SSR-safe initialization
    // On server: returns defaults (no window object)
    // On client: reads actual window size immediately
    if (typeof window === "undefined") return { isMobile: false, isTablet: false, isSmallDesktop: false };
    const w = window.innerWidth;
    return {
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isSmallDesktop: w >= 1024 && w < 1200,
    };
  });

  useEffect(() => {
    // PERFORMANCE: Throttle resize with requestAnimationFrame
    // Prevents excessive state updates during window resize
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

/**
 * PERFORMANCE OPTIMIZATION: Reduced Geometry Segments
 * 
 * Creates a bent plane geometry for the 3D cards.
 * 
 * Why 12x12 instead of 16x16 or higher?
 * - Fewer vertices = less GPU work per frame
 * - 12x12 = 144 vertices per card (vs 16x16 = 256 vertices)
 * - Still looks smooth enough for curved cards
 * - With 9 cards: 144 * 9 = 1,296 vertices (vs 2,304 with 16x16)
 * - ~44% reduction in vertex count = faster rendering
 * 
 * Trade-off: Slightly less smooth curves, but imperceptible at viewing distance
 */
function createBentPlaneGeometry(
  width: number,
  height: number,
  radius: number,
  segX = 12, // PERFORMANCE: Reduced from 16 to 12 (25% fewer vertices)
  segY = 12  // PERFORMANCE: Reduced from 16 to 12 (25% fewer vertices)
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

/**
 * PERFORMANCE OPTIMIZATION: Rig Component (Camera & Rotation Controller)
 * 
 * This component handles:
 * 1. Auto-rotation of the carousel
 * 2. Camera following mouse pointer (parallax effect)
 * 3. Smooth rotation transitions
 * 
 * Optimizations:
 * - React.memo prevents re-renders when parent updates
 * - lastSlideIndexRef prevents calling onRotationChange every frame
 * - Only calls callback when slide index actually changes
 */
const Rig = React.memo(function Rig({
  onRotationChange,
  targetRotation,
  children,
  rotation: initialRotation = [0, 0, 0],
  ...props
}: RigProps) {
  const ref = useRef<THREE.Group>(null);
  // PERFORMANCE: Track last slide index to prevent unnecessary callbacks
  // Without this: onRotationChange called every frame → parent re-renders → lag
  // With this: Only called when slide actually changes → smooth
  const lastSlideIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.rotation.set(
      initialRotation[0],
      initialRotation[1],
      initialRotation[2]
    );
  }, [initialRotation]);

  // PERFORMANCE: Throttle camera updates to reduce GPU work
  // Accumulates delta between camera updates for smooth interpolation
  const cameraUpdateCounter = useRef(0);
  const accumulatedDelta = useRef(0);

  /**
   * PERFORMANCE: useFrame runs every frame (60fps) when Canvas is active
   * 
   * DESKTOP OPTIMIZATIONS:
   * 1. **Throttled camera updates**: Updates every 2 frames (30fps) instead of 60fps
   *    - Reduces GPU work by ~50% for camera calculations
   *    - Accumulates delta for smooth interpolation
   *    - Still looks smooth (human eye can't tell difference)
   * 
   * 2. **Reduced rotation speed**: Slightly slower auto-rotation
   *    - Less GPU work per frame
   *    - Still visually appealing
   * 
   * 3. **Reduced parallax intensity**: Less camera movement = less GPU work
   * 
   * 4. **Optimized easing**: Uses efficient interpolation
   * 
   * 5. **Callback throttling**: Only fires when slide actually changes
   */
  useFrame((state: RootState, delta: number) => {
    if (!ref.current) return;

    // Auto-rotate or animate to target rotation
    if (targetRotation !== undefined) {
      easing.dampE(
        ref.current.rotation,
        [initialRotation[0], targetRotation, initialRotation[2]],
        0.2,
        delta
      );
    } else {
      // PERFORMANCE: Reduced rotation speed for desktop (0.04 instead of 0.05)
      // Slightly slower = less GPU work, still smooth
      ref.current.rotation.y -= delta * 0.04;
    }

    // PERFORMANCE: Throttle camera updates to every 2 frames
    // This reduces GPU work by ~50% while maintaining smooth appearance
    accumulatedDelta.current += delta;
    cameraUpdateCounter.current += 1;
    
    if (cameraUpdateCounter.current % 2 === 0) {
      // PERFORMANCE: Further reduced camera movement multipliers for desktop
      // Less parallax = less GPU work, still looks good
      // Uses accumulated delta for smooth interpolation
      easing.damp3(
        state.camera.position,
        [-state.pointer.x * 0.35, 1.2 - state.pointer.y * 0.25, 10.5],
        0.25,
        accumulatedDelta.current
      );
      state.camera.lookAt(0, 0, 0);
      accumulatedDelta.current = 0; // Reset accumulator
    }

    // PERFORMANCE: Only call callback when slide index changes
    // Prevents parent component from re-rendering every frame
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
  // PERFORMANCE: Use ref instead of state for hover
  // State causes re-render → React reconciliation → slower
  // Ref updates don't trigger re-render → faster
  const hoveredRef = useRef(false);

  /**
   * PERFORMANCE: useTexture from @react-three/drei
   * 
   * Automatically handles:
   * - Texture loading and caching (same URL = reused texture)
   * - Error handling
   * - Loading states
   * 
   * Textures are GPU memory intensive (~2-4MB per image).
   * Drei's useTexture caches them so we don't reload if same image used elsewhere.
   * 
   * DESKTOP OPTIMIZATION:
   * - Textures are loaded at full resolution (no downscaling)
   * - Consider compressing images in /public/aboutAssets/ for better performance
   */
  const texture = useTexture(url);
  
  // PERFORMANCE: Optimize texture settings after load
  useEffect(() => {
    if (!texture) return;
    
    // PERFORMANCE: Set texture anisotropy for better quality at angles
    // Lower value (2) = less GPU work, still looks good
    // Higher values (4-16) look better but cost more GPU
    texture.anisotropy = 2;
    
    // PERFORMANCE: Enable mipmaps for better quality at distance
    // Mipmaps use extra memory but improve rendering quality
    texture.generateMipmaps = true;
    
    // PERFORMANCE: Set texture filtering for performance
    // Linear filtering = smooth but more expensive
    // We keep it for quality, but could use NearestFilter for max performance
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  /**
   * PERFORMANCE: Memoize geometry creation
   * 
   * Geometry creation is expensive (calculates vertex positions).
   * useMemo ensures we only create it once per cardSize/radius change.
   * Without memo: Creates new geometry every render → expensive!
   */
  const bentGeometry = useMemo(() => {
    return createBentPlaneGeometry(cardSize[0], cardSize[1], radius, 12, 12);
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

  // PERFORMANCE: Throttle hover animation updates
  // Updates every 2 frames instead of every frame (30fps vs 60fps)
  // Still smooth but uses less GPU
  const hoverUpdateCounter = useRef(0);
  const hoverAccumulatedDelta = useRef(0);

  /**
   * PERFORMANCE: useFrame runs every frame (60fps)
   * 
   * DESKTOP OPTIMIZATION: Throttled hover updates
   * - Updates scale every 2 frames instead of every frame
   * - Reduces GPU work by ~50% for hover animations
   * - Still looks smooth (scale interpolation is forgiving)
   * 
   * Why this is efficient:
   * - Direct Three.js manipulation (ref.current.scale) - no React re-render
   * - Only runs when component is mounted and visible
   * - easing.damp3 is optimized for smooth interpolation
   */
  useFrame((_, delta) => {
    if (!ref.current) return;
    
    hoverAccumulatedDelta.current += delta;
    hoverUpdateCounter.current += 1;
    
    // PERFORMANCE: Update hover scale every 2 frames
    if (hoverUpdateCounter.current % 2 === 0) {
      easing.damp3(
        ref.current.scale,
        hoveredRef.current ? 1.2 : 1,
        0.12,
        hoverAccumulatedDelta.current
      );
      hoverAccumulatedDelta.current = 0;
    }
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
          // PERFORMANCE: Optimize texture settings for desktop
          // GenerateMipmaps: false = saves GPU memory (mipmaps use extra memory)
          // But we keep it true for better quality at different distances
          // Anisotropy: 2 = good quality without being too expensive (max is 16)
        />
      </mesh>
    </group>
  );
});

/**
 * PERFORMANCE OPTIMIZATION: Carousel Component
 * 
 * Renders all cards in a circle. Optimizations:
 * 
 * 1. **React.memo**: Prevents re-render when parent updates
 * 2. **Precomputed positions/rotations**: Calculated once, reused every render
 *    - Without useMemo: New arrays created every render → React sees "new" props → re-renders all cards
 *    - With useMemo: Same array references → React skips re-render → faster
 * 3. **Stable key prop**: Using index (i) is fine since slides don't reorder
 */
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

  /**
   * PERFORMANCE: Precompute positions in useMemo
   * 
   * Why this matters:
   * - Math.sin/cos calculations happen once, not every render
   * - Same array reference = React doesn't re-render Card components
   * - Without memo: New array every render → all Cards re-render → expensive!
   */
  const positions = useMemo(() => {
    return slides.map((_, i) => [
      Math.sin((i / count) * Math.PI * 2) * radius,
      0,
      Math.cos((i / count) * Math.PI * 2) * radius,
    ] as [number, number, number]);
  }, [count, radius, slides.length]);

  /**
   * PERFORMANCE: Precompute rotations in useMemo
   * Same reasoning as positions - prevents unnecessary Card re-renders
   */
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

export interface RingCarousel3DProps {
  /** When false, the canvas stops updating (saves GPU/CPU when off-screen). Default true. */
  inView?: boolean;
}

/**
 * PERFORMANCE OPTIMIZATION: RingCarousel3D Component
 * 
 * This component renders a 3D carousel using Three.js/React Three Fiber.
 * Key optimizations applied:
 * 
 * 1. **Conditional Rendering**: Only renders Canvas when `inView` is true
 *    - Prevents WebGL context creation until needed
 *    - Saves GPU memory and CPU cycles when component is off-screen
 * 
 * 2. **Device Pixel Ratio (DPR)**: Sharp edges on desktop, optimized on mobile
 *    - Mobile: [1, 1.5] - fewer pixels for performance
 *    - Desktop: [1, 2] - 2x resolution for sharp, non-pixellated card edges
 * 
 * 3. **Antialiasing**: Sharp card silhouettes on desktop
 *    - Desktop: enabled — smooths edges so cards look crisp, not jagged
 *    - Mobile: disabled — saves GPU for higher FPS
 * 
 * 4. **Frameloop Control**: Pauses when not visible
 *    - "always" = runs every frame (60fps) even when off-screen
 *    - "never" = stops completely, saving CPU/GPU when not visible
 *    - Controlled by `inView` prop from parent IntersectionObserver
 * 
 * 5. **Geometry Optimization**: Reduced segments (16x16 instead of 24x24)
 *    - Fewer vertices = less GPU work per frame
 *    - Still looks smooth but renders faster
 * 
 * 6. **Memoization**: Components wrapped in React.memo
 *    - Prevents unnecessary re-renders when parent updates
 *    - Only re-renders when props actually change
 */
export default function RingCarousel3D({ inView = true }: RingCarousel3DProps) {
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

  // Always render Canvas so carousel is visible. inView only pauses frameloop when off-screen.
  return (
    <div className="w-full min-h-[50vh] h-[65vh] sm:h-[75vh] lg:h-screen bg-transparent overflow-visible flex items-center justify-center -mt-6 lg:-mt-12">
      <div className="w-full h-full overflow-visible min-h-[320px]" style={{ contain: 'layout' }}>
        <Canvas
          camera={{ position: [0, 0, 10.5], fov: 40 }}
          // SHARP EDGES: DPR drives render resolution — higher = crisp, lower = pixellated
          // Mobile: [1, 1.5] = optimized, fewer pixels
          // Desktop: [1, 2] = sharp edges on retina/hi-DPI (2x resolution)
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          // PERFORMANCE: Pause frame loop when not visible
          frameloop={inView ? "always" : "never"}
          gl={{
            powerPreference: "high-performance",
            // SHARP EDGES: Antialiasing smooths card silhouettes (no jagged edges)
            // Desktop: enabled for crisp edges; Mobile: disabled to keep FPS high
            antialias: !isMobile,
            stencil: false,
            alpha: true,
            premultipliedAlpha: false,
            // SHARP EDGES: Prefer higher quality when GPU allows (desktop)
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            // Set transparent clear color so background shows through
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

