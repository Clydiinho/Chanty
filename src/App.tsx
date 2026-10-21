import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion, type Variants } from 'motion/react';
import heroImage from './assets/images/namibia_desert_road_hero_1791964286493.jpg';
import photoCliffsImage from './assets/images/travel_photo_cliffs_1792508617960.jpg';
import photoMountainsImage from './assets/images/travel_photo_mountains_1792508635961.jpg';
import deskImage from './assets/images/driftwood_table_surface_1791972002370.jpg';
import journalImage from './assets/images/complete_notebook_transparent.png';

// High-fidelity assets loaded directly from /public
const cameraImage = '/camera.png';
const glassesImage = '/glasses.png';
const coffeeImage = '/coffee.webp';
const penHolderImage = '/pen holder.png';
const fountainPenImage = '/pen.png';
const pencilImage = '/pencil.webp';
const plant1Image = '/plant 1.webp';
const plant2Image = '/plant 2.webp';
const plant3Image = '/plant 3.webp';

export interface ItemConfig {
  x: number; // % from left edge (center of item)
  y: number; // % from top edge (center of item)
  width: number; // % of desk container width
  rotation: number; // degrees, positive = clockwise
  zIndex: number; // initial stacking order
}

/**
 * INITIAL_ITEMS
 * Exact landing configuration per specification:
 * - Pen is sized proportionately to the pencil (width 8.6% gives ~12% length vs 13% pencil).
 * - Camera starts on top of the photo, close to it (x: 27.2%, y: 50.5%, resting on Photo B's corner).
 * - Stacking order preserves natural contact layers.
 */
export const INITIAL_ITEMS: Record<string, ItemConfig> = {
  // LEFT SIDE
  monstera: {
    // 1. Dark monstera plant in a gray round pot (plant 1.webp)
    x: 6.7,
    y: 26.0,
    width: 11.5,
    rotation: 0,
    zIndex: 2,
  },
  variegatedPlant: {
    // 2. Variegated plant (green with cream veins) in a terracotta pot (plant 3.webp)
    x: 18.0,
    y: 24.0,
    width: 11.8,
    rotation: 0,
    zIndex: 3,
  },
  camera: {
    // 3. Vintage gold/tan camera with a silver lens (camera.png)
    // Starts on top of the photo, close to it
    x: 27.2,
    y: 50.5,
    width: 12.9,
    rotation: -3,
    zIndex: 7,
  },

  // CENTER-LEFT: THREE PRINTED PHOTOS (fanned, overlapping)
  photoA: {
    // 4. Photo A (mountain valley with winding road) (photoMountainsImage)
    x: 47.7,
    y: 41.8,
    width: 19.4,
    rotation: 8,
    zIndex: 5,
  },
  photoB: {
    // 5. Photo B (orange sea cliffs with blue waves) (photoCliffsImage)
    x: 30.4,
    y: 61.0,
    width: 13.5,
    rotation: -9,
    zIndex: 6,
  },
  photoC: {
    // 6. Photo C (desert road with red dunes) (heroImage)
    x: 45.0,
    y: 64.2,
    width: 19.9,
    rotation: -3,
    zIndex: 8,
  },

  // CENTER-RIGHT: JOURNAL AND WRITING TOOLS
  journal: {
    // 7. Open vintage journal (brown leather, handwritten pages) (journalImage)
    x: 72.0,
    y: 61.0,
    width: 24.1,
    rotation: -1,
    zIndex: 9,
  },
  glasses: {
    // 8. Round tortoiseshell eyeglasses (glasses.png)
    x: 65.2,
    y: 51.6,
    width: 12.3,
    rotation: 10,
    zIndex: 10,
  },
  pencil: {
    // 9. Yellow pencil with a pink eraser (pencil.webp)
    x: 72.7,
    y: 83.3,
    width: 13.0,
    rotation: -22,
    zIndex: 11,
  },
  fountainPen: {
    // 10. Black and gold fountain pen (pen.png) - proportional to the pencil
    x: 68.3,
    y: 81.5,
    width: 8.6,
    rotation: -35,
    zIndex: 12,
  },

  // FAR RIGHT
  penCup: {
    // 11. Wooden pen cup with pens and pencils (pen holder.png)
    x: 80.9,
    y: 27.6,
    width: 7.6,
    rotation: 0,
    zIndex: 13,
  },
  greenPlant: {
    // 12. Green leafy plant in a terracotta pot (plant 2.webp)
    x: 92.8,
    y: 24.5,
    width: 12.0,
    rotation: 0,
    zIndex: 3,
  },
  coffee: {
    // 13. White coffee mug with latte foam (coffee.webp)
    x: 91.1,
    y: 52.0,
    width: 9.9,
    rotation: 0,
    zIndex: 14,
  },
};

const LETTERS = ['C', 'H', 'A', 'N', 'T', 'Y'];

const NAV_LINKS = [
  { label: 'Stories', href: '#stories' },
  { label: 'Journal', href: '#journal' },
  { label: 'Photographs', href: '#photographs' },
  { label: 'About', href: '#about' },
];

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const deskContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });
  const [navInteractive, setNavInteractive] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);

  // Dynamic Z-Index stacking: Initial state strictly reflects INITIAL_ITEMS stacking order
  const [zIndices, setZIndices] = useState<Record<string, number>>(() => ({
    monstera: INITIAL_ITEMS.monstera.zIndex,
    variegatedPlant: INITIAL_ITEMS.variegatedPlant.zIndex,
    camera: INITIAL_ITEMS.camera.zIndex,
    photoA: INITIAL_ITEMS.photoA.zIndex,
    photoB: INITIAL_ITEMS.photoB.zIndex,
    photoC: INITIAL_ITEMS.photoC.zIndex,
    journal: INITIAL_ITEMS.journal.zIndex,
    glasses: INITIAL_ITEMS.glasses.zIndex,
    pencil: INITIAL_ITEMS.pencil.zIndex,
    fountainPen: INITIAL_ITEMS.fountainPen.zIndex,
    penCup: INITIAL_ITEMS.penCup.zIndex,
    greenPlant: INITIAL_ITEMS.greenPlant.zIndex,
    coffee: INITIAL_ITEMS.coffee.zIndex,
  }));
  const topZRef = useRef(15);

  const bringToFront = (id: string) => {
    // Keep max zIndex at 80 so it NEVER exceeds the floating glassmorphic navbar (z-[100])
    topZRef.current = Math.min(80, topZRef.current + 1);
    const newZ = topZRef.current;
    setZIndices((prev) => ({
      ...prev,
      [id]: newZ,
    }));
  };

  // Drag MotionValues for all 13 desktop objects (offsets in px from initial landing position)
  const monsteraDragX = useMotionValue(0);
  const monsteraDragY = useMotionValue(0);
  const variegatedPlantDragX = useMotionValue(0);
  const variegatedPlantDragY = useMotionValue(0);
  const cameraDragX = useMotionValue(0);
  const cameraDragY = useMotionValue(0);
  const photoADragX = useMotionValue(0);
  const photoADragY = useMotionValue(0);
  const photoBDragX = useMotionValue(0);
  const photoBDragY = useMotionValue(0);
  const photoCDragX = useMotionValue(0);
  const photoCDragY = useMotionValue(0);
  const journalDragX = useMotionValue(0);
  const journalDragY = useMotionValue(0);
  const glassesDragX = useMotionValue(0);
  const glassesDragY = useMotionValue(0);
  const pencilDragX = useMotionValue(0);
  const pencilDragY = useMotionValue(0);
  const fountainPenDragX = useMotionValue(0);
  const fountainPenDragY = useMotionValue(0);
  const penCupDragX = useMotionValue(0);
  const penCupDragY = useMotionValue(0);
  const greenPlantDragX = useMotionValue(0);
  const greenPlantDragY = useMotionValue(0);
  const coffeeDragX = useMotionValue(0);
  const coffeeDragY = useMotionValue(0);

  // Reset function to restore all items to exact INITIAL_ITEMS landing values
  const resetToInitial = () => {
    monsteraDragX.set(0);
    monsteraDragY.set(0);
    variegatedPlantDragX.set(0);
    variegatedPlantDragY.set(0);
    cameraDragX.set(0);
    cameraDragY.set(0);
    photoADragX.set(0);
    photoADragY.set(0);
    photoBDragX.set(0);
    photoBDragY.set(0);
    photoCDragX.set(0);
    photoCDragY.set(0);
    journalDragX.set(0);
    journalDragY.set(0);
    glassesDragX.set(0);
    glassesDragY.set(0);
    pencilDragX.set(0);
    pencilDragY.set(0);
    fountainPenDragX.set(0);
    fountainPenDragY.set(0);
    penCupDragX.set(0);
    penCupDragY.set(0);
    greenPlantDragX.set(0);
    greenPlantDragY.set(0);
    coffeeDragX.set(0);
    coffeeDragY.set(0);

    setZIndices({
      monstera: INITIAL_ITEMS.monstera.zIndex,
      variegatedPlant: INITIAL_ITEMS.variegatedPlant.zIndex,
      camera: INITIAL_ITEMS.camera.zIndex,
      photoA: INITIAL_ITEMS.photoA.zIndex,
      photoB: INITIAL_ITEMS.photoB.zIndex,
      photoC: INITIAL_ITEMS.photoC.zIndex,
      journal: INITIAL_ITEMS.journal.zIndex,
      glasses: INITIAL_ITEMS.glasses.zIndex,
      pencil: INITIAL_ITEMS.pencil.zIndex,
      fountainPen: INITIAL_ITEMS.fountainPen.zIndex,
      penCup: INITIAL_ITEMS.penCup.zIndex,
      greenPlant: INITIAL_ITEMS.greenPlant.zIndex,
      coffee: INITIAL_ITEMS.coffee.zIndex,
    });
    topZRef.current = 15;
  };

  // Normalized scroll zoom progress [0.0 -> 1.0]
  const progress = useMotionValue(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Responsive dimension tracker
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Strict Viewport Bounding Constraints:
  // Items move freely anywhere across the desk, but CANNOT leave the viewport
  // and stay strictly below the top navigation bar (~56px).
  const getDeskConstraints = (key: keyof typeof INITIAL_ITEMS, aspectRatio: number) => {
    const config = INITIAL_ITEMS[key];
    const itemW = (config.width / 100) * dimensions.width;
    const itemH = itemW / aspectRatio;
    const initX = (config.x / 100) * dimensions.width;
    const initY = (config.y / 100) * dimensions.height;

    const minLeft = -initX + itemW / 2;
    const maxRight = dimensions.width - initX - itemW / 2;
    const minTop = 56 - initY + itemH / 2;
    const maxBottom = dimensions.height - initY - itemH / 2;

    return {
      left: Math.min(0, minLeft),
      right: Math.max(0, maxRight),
      top: Math.min(0, minTop),
      bottom: Math.max(0, maxBottom),
    };
  };

  // Smooth frame interpolation loop: clamps strictly between 0 and 1
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0004) {
        currentProgressRef.current += diff * 0.12;
        progress.set(currentProgressRef.current);
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        progress.set(currentProgressRef.current);
      }

      setNavInteractive(currentProgressRef.current > 0.08);
      const currentlyDraggable = currentProgressRef.current > 0.65;
      setIsDraggable(currentlyDraggable);

      // Seamless zoom-back physics:
      // When scrolling back up towards 0.0, smoothly ease photoC's drag offsets back to 0
      if (currentProgressRef.current < 0.65) {
        const curPX = photoCDragX.get();
        const curPY = photoCDragY.get();
        if (Math.abs(curPX) > 0.05) photoCDragX.set(curPX * 0.88);
        else if (curPX !== 0) photoCDragX.set(0);

        if (Math.abs(curPY) > 0.05) photoCDragY.set(curPY * 0.88);
        else if (curPY !== 0) photoCDragY.set(0);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress, photoCDragX, photoCDragY]);

  // Handle wheel, touch, and keyboard interactions
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const normalizedDelta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 80);
      const delta = normalizedDelta / 450;
      targetProgressRef.current = Math.min(1, Math.max(0, targetProgressRef.current + delta));
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        touchStartY = currentY;
        const delta = deltaY / 380;
        targetProgressRef.current = Math.min(1, Math.max(0, targetProgressRef.current + delta));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        targetProgressRef.current = Math.min(1, targetProgressRef.current + 0.16);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.16);
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetProgressRef.current = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetProgressRef.current = 1;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Initial load animation variants for CHANTY letters
  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? 'none' : 'blur(10px)',
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.9,
            delay: 0.25 + index * 0.14,
            ease: [0.22, 1, 0.36, 1] as const,
          },
    }),
  };

  // Tagline initial load animation
  const taglineVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
    },
    visible: {
      opacity: 0.85,
      y: 0,
      filter: 'blur(0px)',
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 1.0,
            delay: 1.35,
            ease: [0.22, 1, 0.36, 1] as const,
          },
    },
  };

  // Scroll indicator initial load animation
  const scrollIndicatorVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.8,
            delay: 1.85,
            ease: 'easeOut' as const,
          },
    },
  };

  // --- Transformations for the Unified Camera Rig ---
  // Photo C (hero image) dimension on the desk:
  const photoCWidth = dimensions.width * (INITIAL_ITEMS.photoC.width / 100);
  const photoCHeight = photoCWidth / 1.5;

  // Scale required at progress 0 so the camera starts close on top of Photo C
  const initialScale = Math.max(
    dimensions.width / photoCWidth,
    dimensions.height / photoCHeight
  );

  // Offset of Photo C's center from desk center:
  const photoCOffsetX = (INITIAL_ITEMS.photoC.x / 100 - 0.5) * dimensions.width;
  const photoCOffsetY = (INITIAL_ITEMS.photoC.y / 100 - 0.5) * dimensions.height;

  // 1. Unified Camera Scale: pulls back from initialScale (tight macro close on Photo C) down to 1.0 (full desk)
  const cameraScale = useTransform(progress, [0, 0.88], [initialScale, 1.0], { clamp: true });

  // 2. Unified Camera Pan: shifts from centered on Photo C to centered on the full desk
  const cameraX = useTransform(progress, [0, 0.88], [-photoCOffsetX * initialScale, 0], { clamp: true });
  const cameraY = useTransform(progress, [0, 0.88], [-photoCOffsetY * initialScale, 0], { clamp: true });

  // 3. Photo C rotation: aligns with camera (0deg) at progress 0; settles at INITIAL_ITEMS.photoC.rotation (-3deg)
  const photoCRotate = useTransform(progress, [0.15, 0.85], [0, INITIAL_ITEMS.photoC.rotation], { clamp: true });

  // 4. White archival print border & shadow for Photo C: 0 at start, emerges as camera pulls back
  const photoBorderOpacity = useTransform(progress, [0.03, 0.35], [0, 1], { clamp: true });
  const photoShadowOpacity = useTransform(progress, [0.05, 0.45], [0, 1], { clamp: true });

  // 5. Centered Hero Wordmark: In front of the photo (z-40); dissolves on scroll start
  const heroWordmarkOpacity = useTransform(progress, [0, 0.28], [1, 0], { clamp: true });
  const heroWordmarkY = useTransform(progress, [0, 0.32], [0, -90], { clamp: true });
  const heroWordmarkScale = useTransform(progress, [0, 0.32], [1, 0.65], { clamp: true });

  // 6. Tagline & Scroll indicator: Fades out immediately on scroll start
  const heroSecondaryOpacity = useTransform(progress, [0, 0.08], [1, 0], { clamp: true });

  // 7. Floating Pill Glassmorphic Navigation Bar: Emerges as you scroll and locks at top
  const navOpacity = useTransform(progress, [0.06, 0.28], [0, 1], { clamp: true });
  const navY = useTransform(progress, [0.06, 0.28], [-24, 0], { clamp: true });

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    targetProgressRef.current = 0;
    resetToInitial();
  };

  const handleScrollIndicatorClick = () => {
    targetProgressRef.current = 1;
  };

  return (
    <main className="relative w-screen h-[100svh] overflow-hidden bg-[#141210] text-[#F1E9DA] select-none">
      {/* ============================================================== */}
      {/* FLOATING PILL-SHAPED GLASSMORPHISM NAVIGATION BAR              */}
      {/* Highest Z-Index (z-[100]): ALL desktop objects stay underneath */}
      {/* ============================================================== */}
      <motion.header
        style={{
          opacity: navOpacity,
          y: navY,
        }}
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 sm:gap-7 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#141210]/70 backdrop-blur-xl border border-[#F1E9DA]/20 shadow-[0_12px_36px_rgba(0,0,0,0.65),0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all ${
          navInteractive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Zone 1: Brand Wordmark in Cormorant Garamond */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="font-editorial text-lg sm:text-xl font-normal tracking-[0.24em] text-[#F1E9DA] uppercase whitespace-nowrap shrink-0 hover:text-[#C66A48] transition-colors"
          aria-label="CHANTY - Return to full photo"
        >
          CHANTY
        </a>

        {/* Delicate Glass Divider */}
        <div className="w-[1px] h-4 bg-[#F1E9DA]/20 hidden sm:block" />

        {/* Zone 2: Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 text-xs font-light tracking-[0.18em] uppercase text-[#F1E9DA]/75 font-body"
          aria-label="Primary Navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => e.preventDefault()}
              className="whitespace-nowrap shrink-0 hover:text-[#F1E9DA] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Delicate Glass Divider */}
        <div className="w-[1px] h-4 bg-[#F1E9DA]/20 hidden sm:block" />

        {/* Zone 3: Editorial Action */}
        <div className="flex items-center shrink-0">
          <a
            href="#journal"
            onClick={(e) => e.preventDefault()}
            className="font-body text-xs tracking-[0.16em] uppercase px-4 py-1.5 rounded-full border border-[#F1E9DA]/30 hover:border-[#F1E9DA]/75 hover:bg-[#F1E9DA]/10 text-[#F1E9DA] transition-all whitespace-nowrap shrink-0"
          >
            Index
          </a>
        </div>
      </motion.header>

      {/* ============================================================== */}
      {/* UNIFIED CAMERA VIEWPORT CANVAS                                 */}
      {/* Strictly bounded: objects cannot be dragged out of the scene   */}
      {/* ============================================================== */}
      <div
        ref={deskContainerRef}
        className="relative w-full h-full overflow-hidden flex items-center justify-center"
      >
        {/* Unified Camera Rig */}
        <motion.div
          style={{
            scale: cameraScale,
            x: cameraX,
            y: cameraY,
          }}
          className="relative w-full h-full flex items-center justify-center origin-center"
        >
          {/* Layer 1: Weathered Single-Slab Driftwood Table Surface */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={deskImage}
              alt="Naturally weathered solid single-slab driftwood table with organic grain and live edges"
              className="w-full h-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            {/* Soft natural studio ambient vignette */}
            <div
              className="absolute inset-0 bg-radial from-transparent via-[#141210]/15 to-[#0C0B0A]/60 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* ========================================================== */}
          {/* 1. DARK MONSTERA PLANT (LEFT SIDE)                         */}
          {/* x: 6.7%, y: 26%, width: 11.5%, rotation: 0°, z: 2         */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.monstera.x}%`,
              top: `${INITIAL_ITEMS.monstera.y}%`,
              width: `${INITIAL_ITEMS.monstera.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.monstera,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('monstera', 263 / 247)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: monsteraDragX,
                y: monsteraDragY,
                rotate: INITIAL_ITEMS.monstera.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.05,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(20,15,10,0.25)) drop-shadow(0px 18px 28px rgba(15,10,5,0.35))',
              }}
              onPointerDown={(e) => {
                bringToFront('monstera');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={plant1Image}
                alt="Dark monstera plant in a gray round pot"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(25,18,12,0.40)] drop-shadow-[0_8px_18px_rgba(20,14,8,0.25)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 2. VARIEGATED PLANT (LEFT SIDE)                            */}
          {/* x: 18%, y: 24%, width: 11.8%, rotation: 0°, z: 3          */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.variegatedPlant.x}%`,
              top: `${INITIAL_ITEMS.variegatedPlant.y}%`,
              width: `${INITIAL_ITEMS.variegatedPlant.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.variegatedPlant,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('variegatedPlant', 747 / 816)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: variegatedPlantDragX,
                y: variegatedPlantDragY,
                rotate: INITIAL_ITEMS.variegatedPlant.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.05,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(20,15,10,0.25)) drop-shadow(0px 18px 28px rgba(15,10,5,0.35))',
              }}
              onPointerDown={(e) => {
                bringToFront('variegatedPlant');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={plant3Image}
                alt="Variegated plant (green with cream veins) in a terracotta pot"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(25,18,12,0.38)] drop-shadow-[0_8px_18px_rgba(20,14,8,0.22)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 12. GREEN LEAFY PLANT (FAR RIGHT)                          */}
          {/* x: 92.8%, y: 24.5%, width: 12%, rotation: 0°, z: 3         */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.greenPlant.x}%`,
              top: `${INITIAL_ITEMS.greenPlant.y}%`,
              width: `${INITIAL_ITEMS.greenPlant.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.greenPlant,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('greenPlant', 316 / 280)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: greenPlantDragX,
                y: greenPlantDragY,
                rotate: INITIAL_ITEMS.greenPlant.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.05,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(20,15,10,0.25)) drop-shadow(0px 18px 28px rgba(15,10,5,0.35))',
              }}
              onPointerDown={(e) => {
                bringToFront('greenPlant');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={plant2Image}
                alt="Green leafy plant in a terracotta pot"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(25,18,12,0.38)] drop-shadow-[0_8px_18px_rgba(20,14,8,0.22)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 4. PHOTO A (MOUNTAIN VALLEY) - BOTTOM OF PHOTO STACK       */}
          {/* x: 47.7%, y: 41.8%, width: 19.4%, rotation: +8°, z: 5      */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.photoA.x}%`,
              top: `${INITIAL_ITEMS.photoA.y}%`,
              width: `${INITIAL_ITEMS.photoA.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.photoA,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('photoA', 1.5)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: photoADragX,
                y: photoADragY,
                rotate: INITIAL_ITEMS.photoA.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.04,
                zIndex: 85,
              }}
              onPointerDown={(e) => {
                bringToFront('photoA');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <div
                className="absolute inset-0 pointer-events-none rounded-[1px] shadow-[0_1px_2px_rgba(30,22,15,0.40),0_3px_6px_rgba(30,22,15,0.22),0_8px_16px_-2px_rgba(30,22,15,0.18),2px_12px_22px_-4px_rgba(25,18,12,0.12)]"
                aria-hidden="true"
              />
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#292B28] rounded-[1px]">
                <img
                  src={photoMountainsImage}
                  alt="Mountain valley with winding road travel photograph"
                  className="w-full h-full object-cover object-center pointer-events-none"
                  loading="eager"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 border-[6px] sm:border-[8px] md:border-[9px] border-[#FAF7F0] z-10 shadow-[inset_0_0_1px_rgba(0,0,0,0.25)] pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 5. PHOTO B (SEA CLIFFS) - LOWER-LEFT OF PHOTO STACK        */}
          {/* x: 30.4%, y: 61%, width: 13.5%, rotation: -9°, z: 6        */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.photoB.x}%`,
              top: `${INITIAL_ITEMS.photoB.y}%`,
              width: `${INITIAL_ITEMS.photoB.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.photoB,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('photoB', 1.5)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: photoBDragX,
                y: photoBDragY,
                rotate: INITIAL_ITEMS.photoB.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.04,
                zIndex: 85,
              }}
              onPointerDown={(e) => {
                bringToFront('photoB');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <div
                className="absolute inset-0 pointer-events-none rounded-[1px] shadow-[0_1px_2px_rgba(30,22,15,0.40),0_3px_6px_rgba(30,22,15,0.22),0_8px_16px_-2px_rgba(30,22,15,0.18),2px_12px_22px_-4px_rgba(25,18,12,0.12)]"
                aria-hidden="true"
              />
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#292B28] rounded-[1px]">
                <img
                  src={photoCliffsImage}
                  alt="Orange sea cliffs with blue waves travel photograph"
                  className="w-full h-full object-cover object-center pointer-events-none"
                  loading="eager"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 border-[6px] sm:border-[8px] md:border-[9px] border-[#FAF7F0] z-10 shadow-[inset_0_0_1px_rgba(0,0,0,0.25)] pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 3. VINTAGE RETRO CAMERA (ON TOP OF THE PHOTO, CLOSE TO IT) */}
          {/* Starts on top of Photo B corner, close to the photo stack */}
          {/* x: 27.2%, y: 50.5%, width: 12.9%, rotation: -3°, z: 7      */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.camera.x}%`,
              top: `${INITIAL_ITEMS.camera.y}%`,
              width: `${INITIAL_ITEMS.camera.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.camera,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('camera', 461 / 287)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: cameraDragX,
                y: cameraDragY,
                rotate: INITIAL_ITEMS.camera.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.05,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(25,16,10,0.25)) drop-shadow(0px 18px 26px rgba(18,10,5,0.36))',
              }}
              onPointerDown={(e) => {
                bringToFront('camera');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={cameraImage}
                alt="Vintage gold/tan camera with a silver lens"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_3px_rgba(25,16,10,0.42)] drop-shadow-[0_8px_16px_rgba(20,12,6,0.26)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 6. PHOTO C (DESERT ROAD) - TOP OF PHOTO STACK (HERO)       */}
          {/* x: 45%, y: 64.2%, width: 19.9%, rotation: -3°, z: 8        */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.photoC.x}%`,
              top: `${INITIAL_ITEMS.photoC.y}%`,
              width: `${INITIAL_ITEMS.photoC.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.photoC,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('photoC', 1.5)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: photoCDragX,
                y: photoCDragY,
                rotate: photoCRotate,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.04,
                zIndex: 85,
              }}
              onPointerDown={(e) => {
                bringToFront('photoC');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              {/* Authentic Photographic Paper Warm Optical Shadow */}
              <motion.div
                style={{
                  opacity: photoShadowOpacity,
                }}
                className="absolute inset-0 pointer-events-none rounded-[1px] shadow-[0_1px_2px_rgba(30,22,15,0.40),0_3px_6px_rgba(30,22,15,0.22),0_8px_16px_-2px_rgba(30,22,15,0.18),2px_12px_22px_-4px_rgba(25,18,12,0.12)]"
                aria-hidden="true"
              />

              {/* Photographic Print Wrapper */}
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#292B28] rounded-[1px]">
                <img
                  src={heroImage}
                  alt="Desert road with red dunes travel photograph"
                  className="w-full h-full object-cover object-center pointer-events-none"
                  loading="eager"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#292B28]/35 via-black/25 to-[#292B28]/50 pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 film-grain mix-blend-overlay pointer-events-none"
                  aria-hidden="true"
                />
                <motion.div
                  style={{
                    opacity: photoBorderOpacity,
                  }}
                  className="absolute inset-0 border-[6px] sm:border-[8px] md:border-[9px] border-[#FAF7F0] z-10 shadow-[inset_0_0_1px_rgba(0,0,0,0.25)] pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 7. OPEN VINTAGE JOURNAL (CENTER-RIGHT)                     */}
          {/* x: 72%, y: 61%, width: 24.1%, rotation: -1°, z: 9          */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.journal.x}%`,
              top: `${INITIAL_ITEMS.journal.y}%`,
              width: `${INITIAL_ITEMS.journal.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.journal,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('journal', 770 / 534)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: journalDragX,
                y: journalDragY,
                rotate: INITIAL_ITEMS.journal.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.04,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(30,18,10,0.25)) drop-shadow(0px 18px 28px rgba(20,12,6,0.32))',
              }}
              onPointerDown={(e) => {
                bringToFront('journal');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={journalImage}
                alt="Open vintage journal (brown leather, handwritten pages)"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(35,25,18,0.30)] drop-shadow-[0_10px_20px_rgba(30,20,12,0.20)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 8. ROUND TORTOISESHELL EYEGLASSES (ON JOURNAL LEFT PAGE)   */}
          {/* x: 65.2%, y: 51.6%, width: 12.3%, rotation: +10°, z: 10    */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.glasses.x}%`,
              top: `${INITIAL_ITEMS.glasses.y}%`,
              width: `${INITIAL_ITEMS.glasses.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.glasses,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('glasses', 926 / 332)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: glassesDragX,
                y: glassesDragY,
                rotate: INITIAL_ITEMS.glasses.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.03 } : undefined}
              whileDrag={{
                scale: 1.06,
                zIndex: 85,
                filter: 'drop-shadow(0px 3px 4px rgba(35,20,12,0.25)) drop-shadow(0px 14px 20px rgba(25,14,7,0.32))',
              }}
              onPointerDown={(e) => {
                bringToFront('glasses');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={glassesImage}
                alt="Round tortoiseshell eyeglasses"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_1px_2px_rgba(35,20,12,0.42)] drop-shadow-[0_5px_10px_rgba(30,16,8,0.22)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 9. YELLOW PENCIL WITH PINK ERASER (WRITING TOOLS)          */}
          {/* x: 72.7%, y: 83.3%, width: 13%, rotation: -22°, z: 11      */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.pencil.x}%`,
              top: `${INITIAL_ITEMS.pencil.y}%`,
              width: `${INITIAL_ITEMS.pencil.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.pencil,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('pencil', 497 / 36)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: pencilDragX,
                y: pencilDragY,
                rotate: INITIAL_ITEMS.pencil.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.04 } : undefined}
              whileDrag={{
                scale: 1.06,
                zIndex: 85,
                filter: 'drop-shadow(0px 2px 3px rgba(25,16,10,0.25)) drop-shadow(0px 10px 16px rgba(18,10,5,0.32))',
              }}
              onPointerDown={(e) => {
                bringToFront('pencil');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={pencilImage}
                alt="Yellow pencil with a pink eraser"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_1px_2px_rgba(25,16,10,0.40)] drop-shadow-[0_3px_6px_rgba(20,12,6,0.22)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 10. BLACK AND GOLD FOUNTAIN PEN (PROPORTIONAL TO PENCIL)   */}
          {/* x: 68.3%, y: 81.5%, width: 8.6%, rotation: -35°, z: 12     */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.fountainPen.x}%`,
              top: `${INITIAL_ITEMS.fountainPen.y}%`,
              width: `${INITIAL_ITEMS.fountainPen.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.fountainPen,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('fountainPen', 899 / 867)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: fountainPenDragX,
                y: fountainPenDragY,
                rotate: INITIAL_ITEMS.fountainPen.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.04 } : undefined}
              whileDrag={{
                scale: 1.06,
                zIndex: 85,
                filter: 'drop-shadow(0px 3px 4px rgba(25,16,10,0.30)) drop-shadow(0px 14px 20px rgba(18,10,5,0.35))',
              }}
              onPointerDown={(e) => {
                bringToFront('fountainPen');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={fountainPenImage}
                alt="Black and gold fountain pen"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_3px_rgba(25,16,10,0.45)] drop-shadow-[0_6px_12px_rgba(20,12,6,0.25)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 11. WOODEN PEN CUP WITH PENS AND PENCILS (FAR RIGHT)       */}
          {/* x: 80.9%, y: 27.6%, width: 7.6%, rotation: 0°, z: 13       */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.penCup.x}%`,
              top: `${INITIAL_ITEMS.penCup.y}%`,
              width: `${INITIAL_ITEMS.penCup.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.penCup,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('penCup', 366 / 450)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: penCupDragX,
                y: penCupDragY,
                rotate: INITIAL_ITEMS.penCup.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.02 } : undefined}
              whileDrag={{
                scale: 1.04,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(30,20,12,0.25)) drop-shadow(0px 18px 26px rgba(25,16,10,0.32))',
              }}
              onPointerDown={(e) => {
                bringToFront('penCup');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              <img
                src={penHolderImage}
                alt="Wooden pen cup with pens and pencils"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(25,16,10,0.40)] drop-shadow-[0_8px_18px_rgba(20,12,6,0.25)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>

          {/* ========================================================== */}
          {/* 13. WHITE COFFEE MUG WITH HIGH-VISIBILITY ANIMATED STEAM   */}
          {/* x: 91.1%, y: 52%, width: 9.9%, rotation: 0°, z: 14         */}
          {/* ========================================================== */}
          <div
            style={{
              position: 'absolute',
              left: `${INITIAL_ITEMS.coffee.x}%`,
              top: `${INITIAL_ITEMS.coffee.y}%`,
              width: `${INITIAL_ITEMS.coffee.width}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: zIndices.coffee,
            }}
            className="flex items-center justify-center select-none"
          >
            <motion.div
              drag={isDraggable}
              dragConstraints={getDeskConstraints('coffee', 947 / 741)}
              dragElastic={0}
              dragMomentum={true}
              style={{
                x: coffeeDragX,
                y: coffeeDragY,
                rotate: INITIAL_ITEMS.coffee.rotation,
              }}
              whileHover={isDraggable ? { scale: 1.03 } : undefined}
              whileDrag={{
                scale: 1.06,
                zIndex: 85,
                filter: 'drop-shadow(0px 4px 6px rgba(25,16,10,0.25)) drop-shadow(0px 16px 24px rgba(20,12,6,0.32))',
              }}
              onPointerDown={(e) => {
                bringToFront('coffee');
                if (isDraggable) e.stopPropagation();
              }}
              className={`relative w-full select-none ${
                isDraggable
                  ? 'cursor-grab active:cursor-grabbing pointer-events-auto touch-none'
                  : 'pointer-events-none'
              }`}
            >
              {/* Coffee Cup Image */}
              <img
                src={coffeeImage}
                alt="White coffee mug with latte foam"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(25,16,10,0.38)] drop-shadow-[0_8px_18px_rgba(20,12,6,0.22)]"
                loading="eager"
                decoding="async"
              />

              {/* High-Visibility Animated Rising Steam Wisps from the Coffee Crema */}
              <div
                className="absolute left-[44%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-32 h-44 pointer-events-none overflow-visible"
                aria-hidden="true"
              >
                {/* Luminous ambient warm heat haze cloud */}
                <motion.div
                  animate={{
                    opacity: [0.35, 0.70, 0.35],
                    scale: [0.9, 1.25, 0.9],
                    y: [-2, -12, -2],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-t from-white/60 via-[#FAF7F0]/30 to-transparent blur-md pointer-events-none"
                />

                {/* Steam Plume 1: Left curling wisp (High Visibility) */}
                <motion.svg
                  viewBox="0 0 60 110"
                  className="absolute bottom-6 left-0 w-16 h-36 overflow-visible pointer-events-none"
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 0.95, 0.70, 0],
                    y: [0, -25, -55, -90],
                    x: [0, -6, -12, -20],
                    scale: [0.8, 1.05, 1.35, 1.65],
                  }}
                  transition={{
                    duration: 3.0,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <path
                    d="M30,105 Q18,70 34,48 T22,12"
                    fill="none"
                    stroke="url(#steamPlume1)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.85)] blur-[1px]"
                  />
                  <defs>
                    <linearGradient id="steamPlume1" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#FAF7F0" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </motion.svg>

                {/* Steam Plume 2: Central undulating dense plume */}
                <motion.svg
                  viewBox="0 0 60 110"
                  className="absolute bottom-6 left-6 w-16 h-36 overflow-visible pointer-events-none"
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 0.98, 0.78, 0],
                    y: [0, -30, -65, -105],
                    x: [0, 5, -4, 10],
                    scale: [0.85, 1.1, 1.4, 1.75],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: 1.0,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <path
                    d="M28,105 Q40,70 24,42 T36,10"
                    fill="none"
                    stroke="url(#steamPlume2)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] blur-[1.2px]"
                  />
                  <defs>
                    <linearGradient id="steamPlume2" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                      <stop offset="50%" stopColor="#FFF9EE" stopOpacity="0.80" />
                      <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </motion.svg>

                {/* Steam Plume 3: Right curling tendril */}
                <motion.svg
                  viewBox="0 0 60 110"
                  className="absolute bottom-6 left-12 w-16 h-36 overflow-visible pointer-events-none"
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.7 }}
                  animate={{
                    opacity: [0, 0.90, 0.65, 0],
                    y: [0, -22, -50, -82],
                    x: [0, 8, 16, 24],
                    scale: [0.75, 1.0, 1.3, 1.55],
                  }}
                  transition={{
                    duration: 2.8,
                    delay: 1.8,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <path
                    d="M22,105 Q35,74 26,48 T38,16"
                    fill="none"
                    stroke="url(#steamPlume3)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] blur-[1px]"
                  />
                  <defs>
                    <linearGradient id="steamPlume3" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.90" />
                      <stop offset="50%" stopColor="#FAF7F0" stopOpacity="0.70" />
                      <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </motion.svg>

                {/* Steam Plume 4: Whispering center wisps */}
                <motion.svg
                  viewBox="0 0 50 90"
                  className="absolute bottom-6 left-4 w-14 h-28 overflow-visible pointer-events-none"
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 0.85, 0.55, 0],
                    y: [0, -20, -45, -70],
                    x: [0, -3, 3, -2],
                    scale: [0.8, 1.0, 1.25, 1.45],
                  }}
                  transition={{
                    duration: 3.2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <path
                    d="M25,85 Q20,55 30,35 T24,12"
                    fill="none"
                    stroke="url(#steamPlume4)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] blur-[1px]"
                  />
                  <defs>
                    <linearGradient id="steamPlume4" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#FAF7F0" stopOpacity="0.60" />
                      <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* Layer 3: Centered Hero Title & Reveal Overlay                  */}
        {/* Placed prominently at z-40 IN FRONT OF Photo C                 */}
        {/* At scroll 0: Centered title; on scroll glides & dissolves     */}
        {/* ============================================================== */}
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 pointer-events-none">
          <motion.div
            style={{
              opacity: heroWordmarkOpacity,
              y: heroWordmarkY,
              scale: heroWordmarkScale,
            }}
            className="text-center flex flex-col items-center justify-center transform-gpu"
          >
            {/* CHANTY Editorial Wordmark */}
            <h1
              className="font-editorial text-[#F1E9DA] tracking-[0.24em] md:tracking-[0.28em] lg:tracking-[0.32em] uppercase font-light flex items-center justify-center text-[clamp(2.75rem,8vw,7.5rem)] leading-none pl-[0.24em] md:pl-[0.28em] lg:pl-[0.32em]"
              aria-label="CHANTY"
            >
              {LETTERS.map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block transform-gpu"
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* Understated Tagline: "Every place leaves a story." */}
            <motion.p
              style={{
                opacity: heroSecondaryOpacity,
              }}
              variants={taglineVariants}
              initial="hidden"
              animate="visible"
              className="font-body text-[#F1E9DA] font-light text-xs sm:text-sm md:text-base tracking-[0.22em] uppercase mt-5 sm:mt-7 text-center max-w-md antialiased"
            >
              Every place leaves a story.
            </motion.p>
          </motion.div>
        </div>

        {/* Layer 4: Minimal Scroll Indicator (visible at scroll 0, fades on scroll) */}
        <motion.div
          style={{
            opacity: heroSecondaryOpacity,
          }}
          variants={scrollIndicatorVariants}
          initial="hidden"
          animate="visible"
          onClick={handleScrollIndicatorClick}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center cursor-pointer pointer-events-auto"
          aria-hidden="true"
        >
          <div className="w-[1px] h-9 sm:h-11 bg-[#F1E9DA]/20 relative overflow-hidden rounded-full">
            <div className="w-full h-full bg-[#F1E9DA]/85 animate-scroll-line" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
