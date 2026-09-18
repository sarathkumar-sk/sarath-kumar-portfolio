import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Loader2, Mail, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { profile } from '@/data/content';
import portrait from '@/assets/profile-photo.jpg';
import GlowButton from '@/components/GlowButton';
import ShinyText from '@/components/ShinyText';

const channels = [
  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: 'Phone', value: profile.phone, href: profile.phoneHref },
  { icon: Linkedin, label: 'LinkedIn', value: 'sarath-kumar-sk', href: profile.linkedin },
  { icon: Github, label: 'GitHub', value: 'sarathkumar-sk', href: profile.github },
];

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: '', email: '', subject: '', message: '' };

const validate = (fields: Fields): Errors => {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = 'Enter your name so I know who is writing.';
  if (!fields.email.trim()) errors.email = 'Enter an email address I can reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'That email address does not look right.';
  if (!fields.subject.trim()) errors.subject = 'Add a subject.';
  if (!fields.message.trim()) errors.message = 'Add a message.';
  return errors;
};

const fieldClass =
  'w-full rounded border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-foreground/40';

const Contact = () => {
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const update = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    try {
      await emailjs.send(
        'service_6qx3f7k',
        'template_vrzaxur',
        {
          from_name: fields.name,
          from_email: fields.email,
          subject: fields.subject,
          message: fields.message,
        },
        '39spmISJIeucggpB5',
      );
      toast({ title: 'Message sent', description: 'I will get back to you shortly.' });
      setFields(empty);
    } catch {
      toast({
        title: 'Message not sent',
        description: 'Something went wrong. Email me directly and it will reach me.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section id="contact" className="band border-t border-border">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <motion.div {...reveal}>
          <h2 className="display max-w-[14ch] text-4xl font-semibold md:text-5xl">
            <ShinyText text="Get in touch" speed={3.6} delay={4.5} spread={110} disabled={Boolean(reduce)} />
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
            I am in Manchester and open to robotics and machine learning roles, research collaboration and anything
            involving hardware that has to make its own decisions.
          </p>

          <div className="sunlit surface mt-10 aspect-[4/3] max-w-sm overflow-hidden">
            <img
              src={portrait}
              alt="Portrait of Sarath Kumar S K, robotics engineer"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded border border-border bg-border">
            {channels.map((channel) => (
              <li key={channel.label} className="bg-card">
                <a
                  href={channel.href}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-5 transition-colors hover:bg-muted"
                >
                  <channel.icon size={18} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                  <span className="min-w-0">
                    <span className="mono block text-muted-foreground">{channel.label}</span>
                    <span className="block break-all text-sm text-foreground">{channel.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form {...reveal} onSubmit={handleSubmit} noValidate className="grid content-start gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={fields.name}
                onChange={update('name')}
                className={fieldClass}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={fields.email}
                onChange={update('email')}
                className={fieldClass}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="subject" className="text-sm font-medium text-foreground">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={fields.subject}
              onChange={update('subject')}
              className={fieldClass}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="text-sm text-destructive">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={7}
              value={fields.message}
              onChange={update('message')}
              className={`${fieldClass} resize-y`}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          <GlowButton variant="accent" type="submit" disabled={sending} innerClassName="justify-center">
            {sending && <Loader2 size={16} strokeWidth={2} className="animate-spin" />}
            {sending ? 'Sending' : 'Send message'}
          </GlowButton>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
