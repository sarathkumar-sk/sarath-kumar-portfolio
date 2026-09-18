import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { experiences } from '@/data/content';
import GlowCard from '@/components/GlowCard';
import ShinyText from '@/components/ShinyText';

/*
  Sticky stack. Each role pins at the top of the viewport and recedes as the
  next one slides over it, so the three placements read as a sequence rather
  than three interchangeable cards.

  The pinning is CSS position: sticky; only the recede is scroll-linked, and it
  runs on motion values so nothing re-renders per frame. Under reduced motion
  the cards become a plain stacked list.
*/

type Role = (typeof experiences)[number];

const Panel = ({ role, last, reduce }: { role: Role; last: boolean; reduce: boolean | null }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Progress from "this card is parked at the top" to "the next card has
  // covered it", used only for the cards that get covered.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const still = !reduce && !last;

  return (
    <div
      ref={ref}
      className="relative flex items-start pb-6 md:sticky md:top-0 md:min-h-[100dvh] md:pb-0 md:pt-20"
    >
      <motion.div
        style={still ? { scale, opacity } : undefined}
        className="w-full origin-top"
      >
        <GlowCard innerClassName="overflow-hidden">
        <article className="grid gap-8 p-6 md:grid-cols-[1fr_1.5fr] md:gap-12 md:p-10">
          <div>
            <span className="inline-flex h-14 items-center rounded bg-white px-3">
              <img
                src={role.logo}
                alt={`${role.company} logo`}
                loading="lazy"
                className="h-9 w-auto max-w-[150px] object-contain"
              />
            </span>
            <h3 className="mt-6 text-2xl font-semibold leading-tight md:text-3xl">{role.role}</h3>
            <a
              href={role.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep mt-3 inline-flex text-muted-foreground hover:text-foreground"
            >
              {role.company}
              <ExternalLink size={14} strokeWidth={1.5} />
            </a>
            <p className="mono mt-5 text-muted-foreground">{role.period}</p>
            <p className="mono text-muted-foreground">{role.location}</p>
          </div>

          <div>
            <p className="text-xl font-medium leading-snug md:text-2xl">{role.headline}</p>
            <ul className="mt-6 space-y-4">
              {role.achievements.map((item) => (
                <li key={item} className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>
        </GlowCard>
      </motion.div>
    </div>
  );
};

const Experience = () => {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="band border-t border-border">
      <div className="shell">
        <h2 className="display max-w-[16ch] text-4xl font-semibold md:text-5xl">
          <ShinyText
            text="Three placements, each one shipped"
            speed={3.6}
            delay={4.5}
            spread={110}
            disabled={Boolean(reduce)}
          />
        </h2>
      </div>

      <div className="shell mt-10">
        {experiences.map((role, index) => (
          <Panel
            key={role.company}
            role={role}
            last={index === experiences.length - 1}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;
