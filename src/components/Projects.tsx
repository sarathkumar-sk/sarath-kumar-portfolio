import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, X } from 'lucide-react';
import { projects, type MediaItem, type Project } from '@/data/content';
import ShinyText from '@/components/ShinyText';
import GlowCard from '@/components/GlowCard';
import GlowButton from '@/components/GlowButton';

/*
  Bento spans, one per project. Ten items, ten cells, every row of the six
  column grid filled exactly: 4+2 over two rows, then 2+2+2, 3+3, 2+4.
*/
const spans = [
  'lg:col-span-4 lg:row-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-2',
  'lg:col-span-4',
];

const MediaViewer = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const [index, setIndex] = useState(0);
  const media: MediaItem[] = project.media;

  useEffect(() => setIndex(0), [project]);

  const prev = useCallback(() => setIndex((i) => (i - 1 + media.length) % media.length), [media.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % media.length), [media.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [next, prev, onClose]);

  const current = media[index];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} media`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="surface-raised relative w-full max-w-5xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-border p-5">
          <div>
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="mono mt-1 text-muted-foreground">
              {project.category}, {project.date}
            </p>
          </div>
          <GlowButton variant="ghost" size="icon" glowRadius={16} onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={1.5} />
          </GlowButton>
        </div>

        <div className="relative grid max-h-[62vh] place-items-center bg-muted/40 p-4">
          {current.type === 'image' ? (
            <img
              src={current.src}
              alt={`${project.title}, view ${index + 1} of ${media.length}`}
              className="max-h-[56vh] w-auto object-contain"
              loading="lazy"
            />
          ) : (
            <video
              key={current.src}
              src={current.src}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="max-h-[56vh] w-auto object-contain"
            />
          )}

          {media.length > 1 && (
            <>
              <GlowButton
                variant="ghost"
                size="icon"
                glowRadius={16}
                className="absolute left-4"
                onClick={prev}
                aria-label="Previous"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </GlowButton>
              <GlowButton
                variant="ghost"
                size="icon"
                glowRadius={16}
                className="absolute right-4"
                onClick={next}
                aria-label="Next"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </GlowButton>
            </>
          )}
        </div>

        <div className="grid gap-4 border-t border-border p-5 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
            <p className="mt-3 text-sm leading-relaxed">
              <span className="font-medium">My part: </span>
              <span className="text-muted-foreground">{project.contribution}</span>
            </p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech} className="mono rounded-full border border-border px-3 py-1 text-muted-foreground">
                  {tech}
                </li>
              ))}
            </ul>
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sweep mono mt-4 inline-flex text-foreground"
              >
                <Github size={15} strokeWidth={1.5} />
                Source on GitHub
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [open, setOpen] = useState<Project | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="work" className="band border-t border-border">
      <div className="shell">
        <h2 className="display max-w-[18ch] text-4xl font-semibold md:text-5xl">
          <ShinyText
            text="Ten systems, built and tested on real hardware"
            speed={3.6}
            delay={4.5}
            spread={110}
            disabled={Boolean(reduce)}
          />
        </h2>

        <div className="mt-14 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[220px]">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.2 },
                    transition: { duration: 0.6, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] as const },
                  })}
              className={`row-span-1 ${spans[index]}`}
            >
              <GlowCard className="h-full" innerClassName="h-full overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(project)}
                className="group relative block h-full w-full text-left"
                aria-label={`Open media for ${project.title}`}
              >
              <img
                src={project.thumbnail}
                alt={`${project.title}, ${project.category} project by Sarath Kumar S K`}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />

              {/* Scrim carries the caption, so the type stays legible on any photo. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="mono text-white/70">
                  {project.category}, {project.date}
                </p>
                <h3 className="mt-1 text-base font-semibold leading-snug text-white md:text-lg">{project.title}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
                  {project.contribution}
                </p>
              </div>
              </button>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>{open && <MediaViewer project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

export default Projects;
