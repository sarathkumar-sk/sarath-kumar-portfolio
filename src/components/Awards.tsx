import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { awards, certifications } from '@/data/content';
import GlowButton from '@/components/GlowButton';
import GlowCard from '@/components/GlowCard';
import ShinyText from '@/components/ShinyText';

type Certificate = { title: string; src: string };

const Lightbox = ({ certificate, onClose }: { certificate: Certificate; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={certificate.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground"
        aria-label="Close"
      >
        <X size={18} strokeWidth={1.5} />
      </button>
      <img
        src={certificate.src}
        alt={certificate.title}
        className="max-h-[85vh] w-auto max-w-full object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </motion.div>
  );
};

const Awards = () => {
  const [expanded, setExpanded] = useState(true);
  const [open, setOpen] = useState<Certificate | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="recognition" className="band border-t border-border">
      <div className="shell">
        <h2 className="display max-w-[16ch] text-4xl font-semibold md:text-5xl">
          <ShinyText
            text="Competitions and credentials"
            speed={3.6}
            delay={4.5}
            spread={110}
            disabled={Boolean(reduce)}
          />
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {awards.map((award, index) => (
            <motion.div
              key={award.title}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.3 },
                    transition: { duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as const },
                  })}
            >
              <GlowCard innerClassName="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen({ title: `${award.title} certificate`, src: award.certificateLink })}
                className="group w-full text-left"
              >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={award.certificateLink}
                  alt={`${award.title} certificate awarded to Sarath Kumar S K`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <p className="mono text-primary">
                  {award.award}, {award.year}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-tight">{award.title}</h3>
                <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted-foreground">{award.description}</p>
              </div>
              </button>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        <GlowButton
          variant="ghost"
          className="mt-12"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="certification-grid"
        >
          <Plus
            size={16}
            strokeWidth={1.75}
            className={`transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}
          />
          {expanded ? 'Hide certificates' : 'More certificates'}
        </GlowButton>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id="certification-grid"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                {certifications.map((cert) => (
                  <button
                    key={cert.title + cert.date}
                    type="button"
                    onClick={() => setOpen({ title: `${cert.title} certificate`, src: cert.certificateLink })}
                    className="surface group overflow-hidden text-left transition-colors hover:border-foreground/30"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={cert.certificateLink}
                        alt={`${cert.title} certificate issued by ${cert.issuer}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-snug">{cert.title}</h3>
                      <p className="mono mt-2 text-muted-foreground">{cert.issuer}</p>
                      <p className="mono text-muted-foreground">{cert.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{open && <Lightbox certificate={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

export default Awards;
