import Image from 'next/image';

import type { Restaurant } from '@/types';

interface MenuHeaderProps {
  restaurant: Restaurant;
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const { name, description, logo, bannerImage, headerType, theme } = restaurant;

  if (headerType === 'image' && bannerImage) {
    return (
      <header className="relative h-48 w-full overflow-hidden sm:h-64">
        <Image src={bannerImage} alt={name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-white">
          {logo && (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-lg">
              <Image src={logo} alt={`Logo ${name}`} fill className="object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-bold drop-shadow-lg sm:text-3xl">{name}</h1>
          {description && (
            <p className="max-w-md text-sm text-white/80 drop-shadow">{description}</p>
          )}
        </div>
      </header>
    );
  }

  // headerType === 'text'
  return (
    <header
      className="w-full px-4 py-8 text-center"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="mx-auto max-w-2xl">
        {logo && (
          <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-white/30 shadow-lg">
            <Image src={logo} alt={`Logo ${name}`} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{name}</h1>
        {description && (
          <p className="mt-1 text-sm text-white/80">{description}</p>
        )}
      </div>
    </header>
  );
}
