import { ProductConfigurator } from '@/components/ProductConfigurator';

export const metadata = {
  title: 'Design Your Dog Collar | PawCharms Collar Configurator',
  description: 'Build your perfect dog collar step by step. Pick a colour, choose charms, select size and add a personal engraving. Ships from Vilnius, Lithuania.',
  openGraph: {
    title: 'Design Your Dog Collar | PawCharms',
    description: 'Build your perfect dog collar — pick colour, charms, size and engraving.',
    type: 'website',
    url: 'https://pawcharms.lt/configure',
    siteName: 'PawCharms',
  },
};

export default function ConfigurePage() {
  return <ProductConfigurator />;
}
