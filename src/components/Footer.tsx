import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/content';

const links = [
  { icon: Github, href: profile.github, label: 'GitHub' },
  { icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
];

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="shell flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-heading text-lg font-semibold" style={{ fontVariationSettings: "'wdth' 118" }}>
          {profile.name}
        </p>
        <p className="mono mt-2 text-muted-foreground">
          {profile.role}, {profile.location}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            aria-label={link.label}
          >
            <link.icon size={17} strokeWidth={1.5} />
          </a>
        ))}
      </div>
    </div>

    <div className="shell mt-10">
      <div className="rule" />
      <p className="mono mt-6 text-muted-foreground">
        &copy; {new Date().getFullYear()} {profile.name}
      </p>
    </div>
  </footer>
);

export default Footer;
