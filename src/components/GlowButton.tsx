import { useTheme } from 'next-themes';
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';
import BorderGlow from '@/components/BorderGlow';

/*
  Every button on the page is a BorderGlow, so the pointer-tracked edge light is
  the one shared language for controls.

  BorderGlow renders a div, so the interactive element lives inside it and the
  glow wraps it. That keeps the button a real <button> (or <a> when given an
  href) with its own semantics, focus ring and keyboard behaviour, rather than
  a div pretending to be one.

  Colours are CSS colour strings built from the page tokens, so the browser
  retints on a theme change with no re-render. Only glowColor is parsed in JS,
  so it is passed as literal "H S L" numbers matching --sun-tint per theme.
*/

type Variant = 'accent' | 'solid' | 'ghost' | 'bare';
type Size = 'sm' | 'md' | 'icon';

export type GlowButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  innerClassName?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string;
  download?: string;
  target?: string;
  rel?: string;
  glowRadius?: ComponentProps<typeof BorderGlow>['glowRadius'];
} & Record<`aria-${string}`, unknown>;

const SIZES: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-3 text-sm',
  icon: 'h-full w-full justify-center p-0',
};

const GlowButton = ({
  children,
  variant = 'accent',
  size = 'md',
  className = '',
  innerClassName = '',
  onClick,
  type = 'button',
  disabled,
  href,
  download,
  target,
  rel,
  glowRadius = 22,
  ...rest
}: GlowButtonProps) => {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  const skin: Record<Variant, { bg: string; text: string; border: boolean }> = {
    accent: { bg: 'hsl(var(--primary))', text: 'text-primary-foreground', border: false },
    solid: { bg: 'hsl(var(--foreground))', text: 'text-background', border: false },
    ghost: { bg: 'hsl(var(--card))', text: 'text-foreground', border: true },
    bare: { bg: 'transparent', text: 'text-muted-foreground hover:text-foreground', border: false },
  };

  const s = skin[variant];

  const inner = (
    <span
      className={`flex w-full items-center gap-2 font-medium leading-none transition-colors ${SIZES[size]} ${s.text} ${innerClassName}`}
    >
      {children}
    </span>
  );

  const shared = {
    className: 'block h-full w-full rounded-full focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60',
    onClick,
    ...rest,
  };

  // The wrapper is inline-grid, so it shrinks to its content. An icon button
  // has no text to give it width and needs the box stated explicitly.
  const box = size === 'icon' ? 'h-9 w-9' : '';

  return (
    <BorderGlow
      className={`glow-button ${s.border ? 'glow-button--edged' : 'glow-button--flat'} ${box} ${className}`.trim()}
      innerClassName="overflow-hidden"
      backgroundColor={s.bg}
      lightSurface={!dark}
      borderRadius={999}
      glowRadius={glowRadius}
      glowIntensity={dark ? 0.9 : 0.65}
      fillOpacity={dark ? 0.4 : 0.28}
      edgeSensitivity={10}
      glowColor={dark ? '26 96 58' : '34 96 60'}
      colors={['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--border))']}
    >
      {href ? (
        <a {...shared} href={href} download={download} target={target} rel={rel}>
          {inner}
        </a>
      ) : (
        <button {...shared} type={type} disabled={disabled}>
          {inner}
        </button>
      )}
    </BorderGlow>
  );
};

export default GlowButton;
