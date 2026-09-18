import { useTheme } from 'next-themes';
import BorderGlow, { type BorderGlowProps } from '@/components/BorderGlow';

/*
  Project wrapper around BorderGlow.

  Every colour is handed over as a CSS colour string built from the page
  tokens, so the browser retints the card on a theme change with no re-render
  and no chance of reading a stale palette. The one exception is `glowColor`,
  which BorderGlow parses in JS, so it is passed as literal "H S L" numbers
  matching --sun-tint in each theme: the edge light is the same warm sun that
  lights the rest of the page.

  The demo's three-hue mesh gradient is replaced with the accent and two
  neutrals, because a purple-pink-blue border would be the only place on this
  site carrying a second and third hue.
*/

type GlowCardProps = Omit<BorderGlowProps, 'glowColor' | 'backgroundColor' | 'lightSurface' | 'colors'>;

const GlowCard = ({ className = '', borderRadius = 4, ...rest }: GlowCardProps) => {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  return (
    <BorderGlow
      className={`glow-card ${className}`.trim()}
      borderRadius={borderRadius}
      backgroundColor="hsl(var(--card))"
      lightSurface={!dark}
      glowColor={dark ? '26 96 58' : '34 96 60'}
      colors={['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--border))']}
      glowRadius={28}
      glowIntensity={dark ? 0.85 : 0.6}
      fillOpacity={dark ? 0.4 : 0.28}
      {...rest}
    />
  );
};

export default GlowCard;
