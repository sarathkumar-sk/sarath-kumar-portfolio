import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, type MotionValue } from 'framer-motion';

/*
  One light source for the whole page.

  Scroll progress moves the sun from high on the right to low on the left, as
  if the page were a single long afternoon. The same value feeds the CSS
  surfaces (via custom properties on <html>) and the WebGL scene (via the
  motion value below), so the specular highlight on a card and the reflection
  on the rotor always agree about where the light is coming from.

  Motion is read through Motion's useScroll, never a scroll event listener.
*/

const SunContext = createContext<MotionValue<number> | null>(null);

export const useSun = () => {
  const sun = useContext(SunContext);
  if (!sun) throw new Error('useSun must be used inside SunProvider');
  return sun;
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const SunProvider = ({ children }: { children: ReactNode }) => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });
  const staticSun = useMotionValue(0.12);
  const sun = reduce ? staticSun : smooth;
  const frame = useRef<number>();

  const paint = (t: number) => {
    const root = document.documentElement.style;
    root.setProperty('--sun-x', `${lerp(80, 16, t).toFixed(2)}%`);
    root.setProperty('--sun-y', `${lerp(4, 64, t).toFixed(2)}%`);
    root.setProperty('--sun-intensity', lerp(0.9, 0.3, t).toFixed(3));
    root.setProperty('--sun-angle', lerp(128, 52, t).toFixed(1));
  };

  useEffect(() => {
    paint(sun.get());
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // paint is stable for the life of the provider
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(sun, 'change', (t) => {
    // Batch writes to one frame so a fast scroll cannot thrash style recalc.
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => paint(t));
  });

  return (
    <SunContext.Provider value={sun}>
      {/*
        The sky. Fixed and non-interactive so the gradient never repaints on a
        scrolling container, which keeps mobile frame rate intact.
      */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-sky" />
      {children}
    </SunContext.Provider>
  );
};
