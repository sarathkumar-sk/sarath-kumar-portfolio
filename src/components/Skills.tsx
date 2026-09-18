import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { skillGroups } from '@/data/content';
import GlowCard from '@/components/GlowCard';
import ShinyText from '@/components/ShinyText';
import GlowButton from '@/components/GlowButton';

/*
  A circular carousel: three groups on stage at a time, the middle one face on
  and its neighbours turned away, advancing on its own and wrapping around.

  Every group stays in the DOM at all times and is only transformed, so the
  whole skill list is still there for a crawler and for find-in-page. Autoplay
  stops on hover and on focus, and under reduced motion the whole thing falls
  back to the scrolling rail it replaced.
*/

const AUTOPLAY_MS = 3000;

const Card = ({ group }: { group: (typeof skillGroups)[number] }) => (
  <GlowCard innerClassName="p-7">
    <h3 className="text-lg font-semibold">{group.title}</h3>
    <div className="rule mt-5" />
    <ul className="mt-5 flex flex-wrap gap-2">
      {group.skills.map((skill) => (
        <li
          key={skill}
          className="mono rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          {skill}
        </li>
      ))}
    </ul>
  </GlowCard>
);

const Skills = () => {
  const reduce = useReducedMotion();
  const count = skillGroups.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: number) => setActive((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduce, paused, count]);

  // Shortest signed distance around the ring, so the last group sits directly
  // to the left of the first one rather than five places away.
  const offsetOf = (index: number) => {
    let d = index - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  return (
    <section id="skills" className="band border-t border-border">
      <div className="shell">
        <h2 className="display max-w-[20ch] text-4xl font-semibold md:text-5xl">
          <ShinyText
            text="The stack I actually reach for"
            speed={3.6}
            delay={4.5}
            spread={110}
            disabled={Boolean(reduce)}
          />
        </h2>
      </div>

      {reduce ? (
        <div
          className="shell rail mt-12 scroll-pl-4 sm:scroll-pl-8 lg:scroll-pl-12"
          tabIndex={0}
          role="group"
          aria-label="Technical skills, scroll horizontally"
        >
          {skillGroups.map((group) => (
            <div key={group.title} className="w-[min(85vw,360px)] shrink-0">
              <Card group={group} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            className="relative mx-auto h-[350px] overflow-x-clip sm:h-[330px]"
            /* clip rather than hidden: the side cards deliberately hang past
               the stage, and hidden would turn this into a scroll container. */
            style={{ perspective: '1400px' }}
            aria-roledescription="carousel"
            aria-label="Technical skills"
          >
            {skillGroups.map((group, index) => {
              const offset = offsetOf(index);
              const onStage = Math.abs(offset) <= 1;
              const isCentre = offset === 0;

              return (
                <motion.div
                  key={group.title}
                  className="absolute left-1/2 top-0 w-[min(86vw,380px)]"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{
                    x: `calc(-50% + ${offset * 80}%)`,
                    scale: isCentre ? 1 : 0.8,
                    rotateY: offset * -26,
                    opacity: onStage ? (isCentre ? 1 : 0.42) : 0,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden={!onStage}
                >
                  {/*
                    A side card is a target for bringing itself to the centre.
                    The centre card is not a control, so it leaves the tab order
                    and its contents read as ordinary text.
                  */}
                  <button
                    type="button"
                    tabIndex={isCentre || !onStage ? -1 : 0}
                    onClick={() => !isCentre && setActive(index)}
                    className={`block w-full text-left ${isCentre ? 'cursor-default' : 'cursor-pointer'}`}
                    aria-label={isCentre ? undefined : `Show ${group.title}`}
                  >
                    <Card group={group} />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="shell mt-4 flex items-center justify-center gap-5">
            <GlowButton
              variant="ghost"
              size="icon"
              glowRadius={16}
              onClick={() => go(-1)}
              aria-label="Previous skill group"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </GlowButton>

            <p className="mono min-w-[18ch] text-center text-foreground" aria-live="polite">
              {skillGroups[active].title}
            </p>

            <GlowButton
              variant="ghost"
              size="icon"
              glowRadius={16}
              onClick={() => go(1)}
              aria-label="Next skill group"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </GlowButton>
          </div>
        </div>
      )}
    </section>
  );
};

export default Skills;
