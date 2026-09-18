import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSun } from '@/components/SunLayer';
import { profile } from '@/data/content';
import ShinyText from '@/components/ShinyText';
import VariableProximity from '@/components/VariableProximity';
import GlowButton from '@/components/GlowButton';

const RobotScene = lazy(() => import('@/components/three/RobotScene'));

const Hero = () => {
  const sun = useSun();
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Hold the 3D scene back until the browser is idle. Mounting it in a plain
  // effect starts a ~1 MB fetch plus WebGL context creation while the browser
  // is still laying out and painting the page, which is what makes the first
  // second feel sticky.
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === 'function') {
      const id = idle(() => setMounted(true), { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  const dark = mounted && resolvedTheme === 'dark';

  // One orchestrated entrance for the page, not a per-section reveal habit.
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section id="top" className="relative flex min-h-[100dvh] items-center pb-16 pt-24">
      <div className="shell grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="max-w-xl">
          <motion.p
            {...rise(0)}
            className="mono uppercase tracking-widest2 text-muted-foreground"
          >
            Robotics Engineer, MSc Robotics at Manchester
          </motion.p>

          {/*
            The name carries both effects: the sweep is the page's light
            crossing it, the per-letter weight is the cursor. Proximity needs a
            positioned container to measure against, which is the h1 itself.
          */}
          <motion.h1
            ref={nameRef}
            {...rise(0.08)}
            className="display relative mt-6 text-5xl font-semibold md:text-6xl lg:text-[4.5rem]"
          >
            <ShinyText speed={3} delay={2.6} spread={110} disabled={Boolean(reduce)}>
              {reduce ? (
                'Sarath Kumar S K'
              ) : (
                <VariableProximity
                  label="Sarath Kumar S K"
                  containerRef={nameRef}
                  radius={150}
                  falloff="gaussian"
                  fromFontVariationSettings="'wght' 600, 'wdth' 118"
                  toFontVariationSettings="'wght' 900, 'wdth' 125"
                />
              )}
            </ShinyText>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
            I design control and perception systems for robots, then take them from simulation through to real
            hardware.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
            <GlowButton
              variant="accent"
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View work
              <ArrowDown size={16} strokeWidth={1.75} />
            </GlowButton>
            <GlowButton
              variant="ghost"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get in touch
            </GlowButton>
          </motion.div>
        </div>

        {/* The lit object. Everything on the page takes its light from here. */}
        <motion.div
          {...(reduce
            ? { initial: false as const }
            : {
                initial: { opacity: 0, scale: 0.96 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const },
              })}
          className="relative h-[46vh] min-h-[280px] w-full lg:h-[62vh]"
        >
          <Suspense
            fallback={
              <div
                aria-hidden
                className="h-full w-full rounded-lg border border-border/60 bg-muted/40"
              />
            }
          >
            {mounted && <RobotScene sun={sun} dark={dark} animate={!reduce} />}
          </Suspense>
          <p className="sr-only">
            A three-dimensional robot rendered in real time. It turns to follow the pointer and is lit by a sun that moves as the page scrolls.
          </p>
        </motion.div>
      </div>

      {/* Structured, crawlable summary of the identity this page belongs to. */}
      <p className="sr-only">
        {profile.name}, also known as Sarath Kumar and SKSK, is a robotics engineer studying MSc Robotics at{' '}
        {profile.university} in {profile.location}.
      </p>
    </section>
  );
};

export default Hero;
