import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { education } from '@/data/content';
import ShinyText from '@/components/ShinyText';

/*
  The timeline as a light travelling down a rail.

  A single accent line fills from the top as you scroll the section, and each
  stop's tick lights the moment the light reaches it. That is the same idea the
  rest of the page runs on: one moving light source, and the section reacting to
  where it currently is. The degree titles are uncovered by a left-to-right
  wipe, as if the light were passing over them.

  All of it is driven by scroll progress through motion values, so nothing
  re-renders per frame, and every part of it collapses to static under reduced
  motion.
*/

type Stop = (typeof education)[number];

const titleSizes = ['text-3xl md:text-5xl', 'text-2xl md:text-3xl', 'text-xl md:text-2xl'];

const Entry = ({
  item,
  index,
  total,
  progress,
  reduce,
}: {
  item: Stop;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) => {
  // The point on the rail where this stop sits, so the tick lights exactly as
  // the fill line reaches it rather than on an arbitrary timer.
  const mark = (index + 0.3) / total;
  const lit = useTransform(progress, [mark - 0.06, mark], [0, 1]);
  const litScale = useTransform(lit, [0, 1], [0.25, 1]);
  const current = index === 0;

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <li className="relative pb-16 pl-10 last:pb-0 md:pl-16">
      {/*
        Graduation marks crossing the rail, the way a scale is marked on an
        instrument. The lit one is longer and heavier, so the stop the light has
        reached reads as the major graduation.
      */}
      <span aria-hidden className="absolute left-0 top-[11px] h-px w-5 -translate-x-2 bg-border md:top-[15px]" />
      <motion.span
        aria-hidden
        style={reduce ? undefined : { opacity: lit, scaleX: litScale }}
        className="absolute left-0 top-[11px] h-[2px] w-8 -translate-x-2 origin-left bg-primary md:top-[15px]"
      />

      <div className="flex flex-wrap items-baseline gap-x-3">
        <p className="mono text-muted-foreground">{item.period}</p>
        {current && <p className="mono text-primary">Current</p>}
      </div>

      {/*
        The light passing over the title. It is an additive overlay that starts
        invisible, so if the animation never runs the heading is simply a
        heading. Never wipe the text itself: a reveal that fails takes the
        content with it.
      */}
      <div className="relative mt-3 overflow-hidden">
        <motion.h3 {...rise} className={`display font-semibold leading-[1.05] ${titleSizes[index]}`}>
          {item.degree}
        </motion.h3>
        {!reduce && (
          <motion.span
            aria-hidden
            initial={{ x: '-60%', opacity: 0 }}
            whileInView={{ x: '160%', opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.33, 0, 0.2, 1] }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* Institution lockups are wide marks on their own backing, so they get
            a consistent plate to sit on in both themes. */}
        <span className="inline-flex h-11 items-center rounded bg-white px-3">
          <img
            src={item.image}
            alt={`${item.institution} logo`}
            loading="lazy"
            className="h-7 w-auto object-contain"
          />
        </span>
        <div>
          <p className="text-base text-foreground">{item.institution}</p>
          <p className="mono text-muted-foreground">
            {item.location}
            {item.grade ? `, ${item.grade}` : ''}
          </p>
        </div>
      </div>

      <ul className="mt-6 flex max-w-4xl flex-wrap gap-2">
        {item.focus.map((module, i) => (
          <motion.li
            key={module}
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 8 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.8 },
                  transition: { duration: 0.4, delay: 0.25 + i * 0.035, ease: [0.16, 1, 0.3, 1] as const },
                })}
            className="mono rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {module}
          </motion.li>
        ))}
      </ul>
    </li>
  );
};

const Education = () => {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  // Progress of the section past a line two thirds down the viewport.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ['start 65%', 'end 65%'],
  });

  return (
    <section id="education" className="band border-t border-border">
      <div className="shell">
        <h2 className="display max-w-[18ch] text-4xl font-semibold md:text-5xl">
          <ShinyText
            text="Studying robotics in Manchester, built on computer science"
            speed={3.6}
            delay={4.5}
            spread={110}
            disabled={Boolean(reduce)}
          />
        </h2>

        <div ref={track} className="relative mt-16">
          {/* The rail, and the light running down it */}
          <div aria-hidden className="absolute bottom-0 left-0 top-2 w-px bg-border md:top-3" />
          <motion.div
            aria-hidden
            style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }}
            className="absolute bottom-0 left-0 top-2 w-px origin-top bg-primary md:top-3"
          />

          <ol>
            {education.map((item, index) => (
              <Entry
                key={item.institution}
                item={item}
                index={index}
                total={education.length}
                progress={scrollYProgress}
                reduce={reduce}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Education;
