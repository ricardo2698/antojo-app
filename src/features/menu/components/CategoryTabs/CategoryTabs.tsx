'use client';

import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  primaryColor: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, activeId, primaryColor, onSelect }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-10 overflow-x-auto border-b border-gray-200 bg-white">
      <div className="flex min-w-max gap-1 px-4 py-2">
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
              style={isActive ? { backgroundColor: primaryColor } : undefined}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
