import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Home, Menu, MoonStar, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { navItems, profile } from '@/data/content';
import GlowButton from '@/components/GlowButton';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState('');
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  // State flips once at the threshold rather than on every frame.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24;
    setLifted((prev) => (prev === next ? prev : next));
  });

  // Active section via IntersectionObserver, never a scroll listener.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-colors duration-300 ${lifted ? 'border-b border-border bg-background/85 backdrop-blur-md' : 'border-b border-transparent'
          }`}
      >
        <nav className="shell flex h-16 items-center justify-between gap-6 md:h-[68px]" aria-label="Primary">
          {/*
            Still a link, so it keeps its href for crawlers and middle-click,
            but wearing the same skin as every other control in the bar.
          */}
          <GlowButton
            variant="ghost"
            size="icon"
            glowRadius={16}
            className="shrink-0"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Sarath Kumar S K, home"
          >
            <Home size={16} strokeWidth={1.5} />
          </GlowButton>

          <ul className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <GlowButton
                  variant="bare"
                  size="sm"
                  glowRadius={14}
                  onClick={() => go(item.href)}
                  innerClassName={active === item.href ? '!text-foreground' : undefined}
                  aria-current={active === item.href ? 'true' : undefined}
                >
                  {item.name}
                </GlowButton>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <GlowButton
              variant="ghost"
              size="icon"
              glowRadius={16}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mounted ? (isDark ? <Sun size={16} strokeWidth={1.5} /> : <MoonStar size={16} strokeWidth={1.5} />) : null}
            </GlowButton>

            <GlowButton
              variant="solid"
              size="sm"
              href={profile.cv}
              download="Sarath_Kumar_SK_CV.pdf"
              className="hidden sm:inline-grid"
            >
              Download CV
            </GlowButton>

            <GlowButton
              variant="ghost"
              size="icon"
              glowRadius={16}
              className="lg:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
            </GlowButton>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border bg-background/95 backdrop-blur-md lg:hidden"
          >
            <ul className="shell flex flex-col py-2">
              {navItems.map((item) => {
                const isCurrent = active === item.href;

                return (
                  <li key={item.href} className="border-b border-border/60 last:border-0">
                    <GlowButton
                      variant="bare"
                      size="sm"
                      glowRadius={14}
                      className="w-full"
                      innerClassName={`justify-start text-base ${isCurrent ? '!text-primary' : '!text-foreground'}`}
                      onClick={() => go(item.href)}
                      aria-current={isCurrent ? 'true' : undefined}
                    >
                      {item.name}
                    </GlowButton>
                  </li>
                );
              })}
              <li className="py-4">
                <GlowButton variant="solid" size="sm" href={profile.cv} download="Sarath_Kumar_SK_CV.pdf">
                  Download CV
                </GlowButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
