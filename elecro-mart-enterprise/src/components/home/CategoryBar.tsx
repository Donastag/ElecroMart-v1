import React from 'react';
import { CATEGORIES } from '../../lib/constants';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[80px] z-30 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
                ${selectedCategory === category
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
